/* eslint-disable no-unused-vars */
import { Router } from 'express';
import {
  readDataFromCSVFile,
  getMagazineOrBookByISBN,
  getAllAuthorsWorks,
  getAllMagazineAndBooksSortedByTitle,
  printAllBooksAndMagazine,
  saveNewMagazineDetails,
  saveNewBooksDetailsInDb,
  exportTableDataToCvn,
} from '../controller/dataAndMagazineController.js';
import * as appResponse from '../utils/appResponse.js';
import {
  validationForEmailInput,
  BookOrMagazineInputValidation,
  validateNewMagazineDetails,
  validateNewBooksDetails,
  validateCategoryInput,
  csvInputValidation,
} from '../middleware/validation.js';

const router = Router();

router.get('/magazineOrBook', BookOrMagazineInputValidation, getMagazineOrBookByISBN);

router.get('/authorBooksAndMagazine', validationForEmailInput, getAllAuthorsWorks);

router.get('/allMagazineAndBook', getAllMagazineAndBooksSortedByTitle);

router.get('/printAllBookAndMagazine', printAllBooksAndMagazine);

router.post('/readCSVData', csvInputValidation, readDataFromCSVFile);

router.post('/magazine', validateNewMagazineDetails, saveNewMagazineDetails);

router.post('/books', validateNewBooksDetails, saveNewBooksDetailsInDb);

router.get('/exportAll', validateCategoryInput, exportTableDataToCvn);

router.use((error, req, res, next) => appResponse.noRoute(res, constants.NO_ROUTE));

export default router;
