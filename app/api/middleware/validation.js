import {
  allowOneInputForCategory,
  bookDetailsValidationFunction,
  emailInputValidation,
  magazineDetailsValidationFunction,
  validatedISBNinput,
  csvFileNameInputValidation
} from '../utils/validationSchema.js';
import * as appResponse from '../utils/appResponse.js';
import constants from '../utils/constants.js';
import logger from './logger.js';
import { fetchAllAuthorsEmailFromDb } from '../repositories/dataAndMagazineRepo.js';

const createJoiErrorDetailsForHighlighting = (errorResult, log = false, replaceBracketsInMessages = false) => {
  const { error } = errorResult;
  const valid = error == null; // return true or false

  if (!valid) {
    if (log) logger.error(error); // if we want log the error

    const errorDetails = error.details.map(({ message, path }) => ({
      indexValue: path[0],
      field: path[1],
      // \[[^\]]\]{1} => regex pattern to match only one occurrence/first of [all data within brackets included]
      errorMessage: replaceBracketsInMessages
        ? message.replace(/\[[^\]]\]{1}/gi, '').replace(/([.]{1})/gi, '') // return message by removing brackets
        : message, // return joi built in message as it is.};
    }));

    return { valid, errorDetails };
  }
  // if no error, then send valid condition(which will be true)
  return { valid, errorDetails: [] };
};

export const csvInputValidation = (req, res, next) => {
  const result = csvFileNameInputValidation.validate(req.query);
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};

export const BookOrMagazineInputValidation = (req, res, next) => {
  const result = validatedISBNinput.validate(req.query);
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};

export const validationForEmailInput = (req, res, next) => {
  const result = emailInputValidation.validate(req.query);
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};

export const validateNewMagazineDetails = async (req, res, next) => {
  const allAuthorEmail = await fetchAllAuthorsEmailFromDb();
  const result = magazineDetailsValidationFunction(req.body, { allAuthorEmail });
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};

export const validateNewBooksDetails = async (req, res, next) => {
  const allAuthorEmail = await fetchAllAuthorsEmailFromDb();
  const result = bookDetailsValidationFunction(req.body, { allAuthorEmail });
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};

export const validateCategoryInput = async (req, res, next) => {
  const result = allowOneInputForCategory.validate(req.query);
  const { valid, errorDetails } = createJoiErrorDetailsForHighlighting(result);
  if (!valid) {
    return appResponse.unProcessableEntity(res, constants.INVALID_INPUT, { error: errorDetails });
  }
  next();
};
