const SUCCESS = 200;
const CREATED = 201;
const CONFLICT = 409;
const NOTFOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const RESET_CONTENT = 205;
const BAD_REQUEST = 400;
const METHOD_NOT_ALLOWED = 405;
const PRECONDITION_REQUIRED = 428;
const UNPROCESSABLE_ENTITY = 422;

export const success = (res, message, data) => {
  res.status(SUCCESS).send({ status: 'SUCCESS', message, data });
};

export const badRequest = (res, message, data) => {
  res.status(BAD_REQUEST).send({ status: 'FAILURE', message, data });
};

export const created = (res, message, data) => {
  res.status(CREATED).send({ status: 'SUCCESS', message, data });
};

export const conflict = (res, message, data) => {
  res.status(CONFLICT).send({ status: 'FAILURE', message, data });
};

export const unProcessableEntity = (res, message, data) => {
  res.status(UNPROCESSABLE_ENTITY).send({ status: 'FAILURE', message, data });
};

export const invalidInput = (res, message, data) => {
  res.status(RESET_CONTENT).send({ status: 'FAILURE', message, data });
};

export const internalServerError = (res, message, data) => {
  res.status(INTERNAL_SERVER_ERROR).send({ status: 'FAILURE', message, data });
};

export const methodNotAllowed = (res, message, data) => {
  res.status(METHOD_NOT_ALLOWED).send({ status: 'FAILURE', message, data });
};

export const userRolesNotLoadedToApp = (res, message, data) => {
  res.status(PRECONDITION_REQUIRED).send({ status: 'UNAUTHORIZED', message, data });
};

export const noRoute = (res, message, data) => {
  res.status(NOTFOUND).send({ status: 'FAILURE', message, data });
};
