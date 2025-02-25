export const firstFunction = function (input, parameter) {
  console.log(parameter);
  return input.toString() === parameter.validationExample.toString();
};

export const secondFunction = function (input, parameter) {
  return input.toString() === "2";
};

export const thirdFunction = function (input, parameter) {
  return input.toString() === "1";
};

export const fourthFunction = function (input, parameter) {
  return input.length === 2;
};

export const fifthFunction = function (input, parameter) {
  return input.toString() === "3";
};