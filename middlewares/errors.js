// Если убрать next летят ошибки
// eslint-disable-next-line no-unused-vars
module.exports.centralErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};
