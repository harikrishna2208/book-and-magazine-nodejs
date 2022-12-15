import { Parser as json2csvParser } from 'json2csv';
import {
  createAuthorDataInDatabase,
  createBooksDetailsInDatabase,
  createMagazineDetailsInDatabase,
  fetchBookDetailsByUsingISBN,
  fetchMagazineDetailsByUsingISBN,
  fetchAllMagazineAndBookDetails,
  fetchAllMagazineAndBookDetailsWithDesc,
} from '../repositories/dataAndMagazineRepo';
import { convertDateWithDotToStandardDate } from '../utils/dates';

const removeNullStringInEmail = (email) => {
  return email.indexOf('null-') === -1 ? email : email.substring(5, email.length);
};

export const saveAuthorsDetailsToDatabase = async (authorsDetails) => {
  const authorsDetailsWithNullRemoved = authorsDetails.map(({ email, firstname, lastname }) => {
    return { email: removeNullStringInEmail(email), firstName: firstname, lastName: lastname };
  });
  const savedToDb = await createAuthorDataInDatabase(authorsDetailsWithNullRemoved);
  return savedToDb;
};

const processRawDetails = (rawDetails) => {
  const processedEmailAndDate = rawDetails.map((currentElement) => {
    const authors = currentElement.authors.split(',').map((ele) => removeNullStringInEmail(ele));
    if (currentElement?.publishedAt) {
      const publishedAt = convertDateWithDotToStandardDate(currentElement.publishedAt);
      return { ...currentElement, authors, publishedAt };
    }
    return { ...currentElement, authors };
  });
  return processedEmailAndDate;
};

export const saveBooksDetailsToDatabase = async (rawBooksDetails) => {
  const booksDetails = processRawDetails(rawBooksDetails);
  console.log(booksDetails, 'books');
  const savedToDb = await createBooksDetailsInDatabase(booksDetails);
  return savedToDb;
};

export const saveMagazineDetailsToDatabase = async (rawMagazineDetails) => {
  const magazineDetails = processRawDetails(rawMagazineDetails);
  const saveToMagazineDb = await createMagazineDetailsInDatabase(magazineDetails);
  return saveToMagazineDb;
};

export const fetchMagazineOrBookByItsISNB = async (isbn) => {
  const bookDetails = (await fetchBookDetailsByUsingISBN(isbn)) ?? {};
  const magazineDetails = (await fetchMagazineDetailsByUsingISBN(isbn)) ?? {};
  return { bookDetails, magazineDetails };
};

export const fetchAllAuthorWorkByEmail = async (email) => {
  const allAuthorWork = await fetchAllMagazineAndBookDetails(email);
  return allAuthorWork;
};

export const fetchAllMagazineAndBookSortedByTitle = async (authorDetails, sortByTitle) => {
  const allMagazineAndBookDetails = await fetchAllMagazineAndBookDetails(authorDetails, sortByTitle);
  return allMagazineAndBookDetails;
};

const parserCustomData = async (myFields) => {
  const json2csv = new json2csvParser({ fields: myFields });
  return json2csv;
};

export const convertTableToCsvFormat = async (detailsFromDatabase, category) => {
  if (category === 'magazine') {
    const parseMagazineDetails = await parserCustomData(['title', 'isbn', 'authors', 'publishedAt']);
    const magazineCsv = parseMagazineDetails.parse(detailsFromDatabase.authorWorkOnMagazine);
    return magazineCsv;
  }
  const parseBookDetails = await parserCustomData(['title', 'isbn', 'authors', 'description']);
  const bookCsv = parseBookDetails.parse(detailsFromDatabase.authorWorkOnBooks);
  return bookCsv;
};
export const fetchAllMagazineAndBookWithoutDescription = async () => {
  const allMagazineAndBookDetails = await fetchAllMagazineAndBookDetailsWithDesc();
  return allMagazineAndBookDetails;
};

export const saveNewMagazineDetailsFromUserInput = async (magazineDetails) => {
  const saveToTable = await createMagazineDetailsInDatabase(magazineDetails);
  return saveToTable;
};

export const saveNewBooksDetailsFromUserInput = async (bookDetails) => {
  const saveToTable = await createBooksDetailsInDatabase(bookDetails);
  return saveToTable;
};
