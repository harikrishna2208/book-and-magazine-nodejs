/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

export const validatedISBNinput = Joi.object().keys({
  isbn: Joi.string().min(1).max(15).required(),
});

export const emailInputValidation = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const csvFileNameInputValidation = Joi.object().keys({
  category: Joi.string().valid('books', 'magazine', 'authors'),
});

export const magazineDetailsValidationFunction = (requestBody, detailsFromDatabase) => {
  const { allAuthorEmail } = detailsFromDatabase;
  const magazineDetailsValidationSchemaElement = Joi.object().keys({
    title: Joi.string().max(255).required(),
    isbn: Joi.string().max(20).required(),
    authors: Joi.array()
      .items(
        Joi.string()
          .valid(...allAuthorEmail)
          .max(50),
      )
      .min(1),
    publishedAt: Joi.date().required(),
  });
  const magazineDetailsValidationSchema = Joi.array().items(magazineDetailsValidationSchemaElement);
  return magazineDetailsValidationSchema.validate(requestBody, { abortEarly: false });
};

export const bookDetailsValidationFunction = (requestBody, detailsFromDatabase) => {
  const { allAuthorEmail } = detailsFromDatabase;
  const bookDetailsValidationSchemaElement = Joi.object().keys({
    title: Joi.string().max(255).required(),
    isbn: Joi.string().max(20).required(),
    authors: Joi.array()
      .items(
        Joi.string()
          .valid(...allAuthorEmail)
          .max(50),
      )
      .min(1),
    description: Joi.string().required().max(1000),
  });

  const bookDetailsValidationSchema = Joi.array().items(bookDetailsValidationSchemaElement);

  return bookDetailsValidationSchema.validate(requestBody, { abortEarly: false });
};

export const allowOneInputForCategory = Joi.object().keys({
  category: Joi.string().valid('magazine', 'books'),
});
