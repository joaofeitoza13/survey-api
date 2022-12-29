module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '6.0.3',
      skipMDS: true
    },
    autoStart: false
  }
}
