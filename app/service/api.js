const axios = require('axios')
const baseURL = 'http://localhost:3333' 

module.exports = axios.create({baseURL})