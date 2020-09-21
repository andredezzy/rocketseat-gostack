import { ValidationError } from 'yup';
import { UnformErrors } from '@unform/core';

export default function getValidationError(err: ValidationError): UnformErrors {
  const validationErrors: UnformErrors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
