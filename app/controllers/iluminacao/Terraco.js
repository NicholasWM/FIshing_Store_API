const {terraco} =  require('../../service/apiIluminacao')
const fetch = require("node-fetch");
module.exports = {
	terraco: async (req, res) => {
		const {rele} = req.body
		params = rele.map(element => {
			console.log(`RELE: ${element}`)
			return `rele=${element}&`
		}).join('')
		console.log(params)
		// const response = await terraco.get(`/rele?${params}`)
		// var myHeaders = new Headers();
		var requestOptions = {
			method: 'GET',
			// headers: myHeaders,
			redirect: 'follow'
		};

		return fetch(`http://terraco.local/rele?${params}`, requestOptions)
			.then(response => response.text())
			.then(result => res.send(result))
			.catch(error => console.log('error', error));
		// returnres.send(response)
	}
}