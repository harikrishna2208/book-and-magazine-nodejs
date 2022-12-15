import { Op } from 'sequelize';
import dbInstance from '../../config/models/index.js';

export const fetchAllAuthorsEmailFromDb = async () => {
  const allAuthorEmail = await dbInstance.authors.findAll({
    raw: true,
    attributes: [[dbInstance.sequelize.fn('ARRAY_AGG', dbInstance.sequelize.col('email')), 'emails']],
  });
  return allAuthorEmail[0].emails;
};

export const createAuthorDataInDatabase = async (authorData) => {
  const createAuthorDetails = await dbInstance.authors.bulkCreate(authorData);
  return createAuthorDetails;
};

export const createBooksDetailsInDatabase = async (booksDetails) => {
  const createBookDetails = await dbInstance.books.bulkCreate(booksDetails);
  return createBookDetails;
};

export const createMagazineDetailsInDatabase = async (magazine) => {
  const createMagazine = await dbInstance.magazine.bulkCreate(magazine);
  return createMagazine;
};
export const fetchBookDetailsByUsingISBN = async (isbn) => {
  const bookDetails = await dbInstance.books.findOne({
    where: {
      isbn,
    },
  });
  return bookDetails;
};

export const getAllAuthorsUniqueIdFromDatabase = async (authorsEmail) => {
  const authorsTableUnique = await dbInstance.authors.findAll({
    where: { email: authorsEmail },
    attributes: ['email', 'id'],
  });
  return authorsTableUnique;
};

export const fetchMagazineDetailsByUsingISBN = async (isbn) => {
  const magazineDetails = await dbInstance.magazine.findOne({
    raw: true,
    where: {
      isbn,
    },
  });
  return magazineDetails;
};

const conditionForFetching = (authorDetails, sortByTitle) => {
  const conditionForFetch = {
    raw: true,
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
  };
  if (authorDetails) {
    conditionForFetch.where = { authors: { [Op.contains]: [authorDetails] } };
  }
  if (sortByTitle) {
    conditionForFetch.order = [['title', 'ASC']];
  }
  return conditionForFetch;
};

export const fetchAllMagazineAndBookDetails = async (findAuthorDetails, sortByTitle = false) => {
  const condition = conditionForFetching(findAuthorDetails, sortByTitle);
  const authorWorkOnBooks = await dbInstance.books.findAll({ ...condition });
  const authorWorkOnMagazine = await dbInstance.magazine.findAll({ ...condition });

  return { authorWorkOnBooks: authorWorkOnBooks ?? [], authorWorkOnMagazine: authorWorkOnMagazine ?? [] };
};

export const fetchAllMagazineAndBookDetailsWithDesc = async () => {
  const authorWorkOnBooks = await dbInstance.books.findAll({
    raw: true,
    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'description'] },
  });
  const authorWorkOnMagazine = await dbInstance.magazine.findAll({
    raw: true,
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
  });

  return { authorWorkOnBooks: authorWorkOnBooks ?? [], authorWorkOnMagazine: authorWorkOnMagazine ?? [] };
};
