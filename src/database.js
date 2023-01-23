require('dotenv').config();

const mongoose = require('mongoose')

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error')
      })
  }
}

module.exports = new Database()