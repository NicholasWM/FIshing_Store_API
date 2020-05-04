const axios = require('axios')
const TerracoBaseURL = 'http://terraco.local'
const QuiosqueBaseURL = 'http://localhost:3333'

module.exports = {
	terraco: axios.create({baseURL:TerracoBaseURL}),
	quiosque: axios.create({baseURL:QuiosqueBaseURL}),
}