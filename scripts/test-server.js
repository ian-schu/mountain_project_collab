const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('/', cors());

app.post('/', (req, res) => {
	console.log(req.body);
	res
		.status(200)
		.type('json')
		.send({ message: `OK got it!` });
});

app.listen('8080', () => {
	console.log(`App listening on port 8080`);
});
