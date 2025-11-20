function errorHandler(err, req, res, next) {
  console.error('Erro:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON malformado'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
}

module.exports = errorHandler;