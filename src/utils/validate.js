import Validator from 'validatorjs';

export const validate = (data, rules, customMessages = {}) => {
  const validation = new Validator(data, rules, customMessages);
  if (validation.fails()) {
    const errors = validation.errors.all();
    const msg = Object.keys(errors)
      .map((k) => `${k}: ${errors[k].join(', ')}`)
      .join(' | ');
    const err = new Error(msg);
    err.status = 422;
    throw err;
  }
};
