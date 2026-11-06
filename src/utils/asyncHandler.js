// Envolve controllers assíncronos para que erros sejam enviados ao
// middleware de tratamento de erros do Express.
module.exports = function asyncHandler(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
