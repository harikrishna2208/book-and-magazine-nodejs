import logger from '../middleware/logger.js';
import * as appResponse from '../utils/appResponse.js';
import constants from '../utils/constants.js';
import multer from 'multer';
import { parse } from 'csv';

import {
  saveAuthorsDetailsToDatabase,
  saveBooksDetailsToDatabase,
  saveMagazineDetailsToDatabase,
  fetchMagazineOrBookByItsISNB,
  fetchAllAuthorWorkByEmail,
  fetchAllMagazineAndBookSortedByTitle,
  fetchAllMagazineAndBookWithoutDescription,
  saveNewMagazineDetailsFromUserInput,
  saveNewBooksDetailsFromUserInput,
  convertTableToCsvFormat,
} from '../services/dataAndMagazineService.js';

const categoryColumns = (category) => {
  if (category === 'authors') {
    return ['email', 'firstname', 'lastname'];
  }
  if (category === 'books') {
    return ['title', 'isbn', 'authors', 'description'];
  }
  if (category === 'magazine') {
    return ['title', 'isbn', 'authors', 'publishedAt'];
  }
};

const readRecordsFromCsvFile = async (buffer, fileCategory) => {
  const parseCSVToArrayOfObject = await new Promise((resolve, reject) => {
    parse(
      buffer,
      {
        columns: categoryColumns(fileCategory),
        delimiter: ';',
        from: 2,
      },
      (err, records) => {
        if (err) {
          throw new Error('error in reading file');
        }
        resolve(records);
      },
    );
  });
  return parseCSVToArrayOfObject;
};

export const readDataFromCSVFile = async (req, res) => {
  try {
    const { category: fileCategory } = req.query;

    const storage = multer.memoryStorage();
    const uploadCSVFile = multer({ storage }).single('csvFile');

    uploadCSVFile(req, res, async (err) => {
      if (err) {
        logger.error(err);
        return appResponse.badRequest(res, constants.UPLOAD_FAIL);
      }
      try {
        const finalRecordsData = await readRecordsFromCsvFile(req.file.buffer, fileCategory);

        if (fileCategory === 'authors') {
          const savedToAuthorDb = await saveAuthorsDetailsToDatabase(finalRecordsData);
          if (savedToAuthorDb) {
            return appResponse.success(res, constants.UPLOAD_SUCCESS);
          }
        } else if (fileCategory === 'magazine') {
          const savedToMagazineDb = await saveMagazineDetailsToDatabase(finalRecordsData);
          if (savedToMagazineDb) {
            return appResponse.success(res, constants.UPLOAD_SUCCESS);
          }
        } else if (fileCategory === 'books') {
          const savedToBooksDb = await saveBooksDetailsToDatabase(finalRecordsData);
          if (savedToBooksDb) {
            return appResponse.success(res, constants.UPLOAD_SUCCESS);
          }
        }
        return appResponse.conflict(res, constants.UPLOAD_FAIL);
      } catch (error) {
        if (error.parent.code === '23505') {
          return appResponse.methodNotAllowed(res, constants.UPDATE_FAIL, { message: error.parent.detail });
        }
        logger.error(error);
        return appResponse.internalServerError(res, constants.UPLOAD_FAIL);
      }
    });
  } catch (error) {
    logger.error(error);
    return appResponse.internalServerError(res, constants.UPLOAD_FAIL);
  }
};

export const getMagazineOrBookByISBN = async (req, res) => {
  console.log(req.query, 'requested');
  try {
    const bookAndMagazineDetails = await fetchMagazineOrBookByItsISNB(req.query.isbn);

    if (
      Object.keys(bookAndMagazineDetails.bookDetails).length > 0 ||
      Object.keys(bookAndMagazineDetails.magazineDetails).length > 0
    ) {
      // console.log(res, 'res');
      return appResponse.success(res, constants.SUCCESSFULLY_FETCHED, bookAndMagazineDetails);
    }
    return appResponse.conflict(res, constants.NO_RECORD_FOUND);
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const getAllAuthorsWorks = async (req, res) => {
  try {
    const bookAndMagazineDetails = await fetchAllAuthorWorkByEmail(req.query.email);
    if (bookAndMagazineDetails.authorWorkOnBooks.length > 0 || bookAndMagazineDetails.authorWorkOnMagazine.length > 0) {
      return appResponse.success(res, constants.SUCCESSFULLY_FETCHED, bookAndMagazineDetails);
    }
    return appResponse.conflict(res, constants.NO_RECORD_FOUND);
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const getAllMagazineAndBooksSortedByTitle = async (req, res) => {
  try {
    const bookAndMagazineDetails = await fetchAllMagazineAndBookSortedByTitle(false, true);
    if (bookAndMagazineDetails.authorWorkOnBooks.length > 0 || bookAndMagazineDetails.authorWorkOnMagazine.length > 0) {
      return appResponse.success(res, constants.SUCCESSFULLY_FETCHED, bookAndMagazineDetails);
    }
    return appResponse.conflict(res, constants.NO_RECORD_FOUND);
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const printAllBooksAndMagazine = async (req, res) => {
  try {
    const bookAndMagazineDetails = await fetchAllMagazineAndBookWithoutDescription();

    console.info('All books details with their author');
    console.table(bookAndMagazineDetails.authorWorkOnBooks);
    console.log('\n');
    console.log('---------------------------------------------------------------------- ');
    console.info('All magazine details with their authors');
    console.table(bookAndMagazineDetails.authorWorkOnMagazine);

    return appResponse.success(res, constants.PRINT_TO_CONSOLE);
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const saveNewMagazineDetails = async (req, res) => {
  try {
    const newMagazineDetails = req.body;
    const savedMagazineDetails = await saveNewMagazineDetailsFromUserInput(newMagazineDetails);
    if (!savedMagazineDetails) {
      return appResponse.conflict(res, constants.NO_RECORD_FOUND);
    }
    return appResponse.success(res, constants.INSERTED_SUCCESSFULLY, savedMagazineDetails);
  } catch (error) {
    if (error.parent.code === '23505') {
      return appResponse.methodNotAllowed(res, constants.UPDATE_FAIL, { message: error.parent.detail });
    }
    logger.error(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const saveNewBooksDetailsInDb = async (req, res) => {
  try {
    const newBookDetails = req.body;
    const savedBooksDetails = await saveNewBooksDetailsFromUserInput(newBookDetails);
    if (!savedBooksDetails) {
      return appResponse.conflict(res, constants.NO_RECORD_FOUND);
    }
    return appResponse.success(res, constants.INSERTED_SUCCESSFULLY, savedBooksDetails);
  } catch (error) {
    if (error.parent.code === '23505') {
      return appResponse.methodNotAllowed(res, constants.UPDATE_FAIL, { message: error.parent.detail });
    }
    logger.error(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};

export const exportTableDataToCvn = async (req, res) => {
  try {
    const { category } = req.query;
    const allTableData = await fetchAllMagazineAndBookSortedByTitle(false, false);
    const csvData = await convertTableToCsvFormat(allTableData, category);
    if (!csvData) {
      return appResponse.conflict(res, constants.NO_RECORD_FOUND);
    }
    return res.attachment('data.csv').send(csvData).status(200);
    // if required
    // return appResponse.success(res, constants.SUCCESSFULLY_FETCHED, csvData);
  } catch (error) {
    console.log(error);
    return appResponse.internalServerError(res, constants.CANNOT_FETCH);
  }
};
