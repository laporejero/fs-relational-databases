const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: 'Unknown endpoint'
  })
}

module.exports = unknownEndpoint