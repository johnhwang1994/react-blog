const express = require('express');
const app = express();

const mongoose = require('mongoose'); 
mongoose.set('useCreateIndex', true);  // https://github.com/nodkz/mongoose-plugin-autoinc/issues/26

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./models/user');



mongoose.connect('mongodb+srv://JohnWang:1234@react-blog-v8zvp.mongodb.net/test?retryWrites=true&w=majority', 
	{useNewUrlParser: true }).then(() => console.log('DB conncected'))   // 'useNewurlParser: true' removes deprecation warning that we get from mongoose
							 .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req,res) => {
	res.json({"hello ~": "Hi ~~fdfdsfsdf"});
})


app.post('/api/users/register', (req,res) => {

	const user = new User(req.body) // what client provides

	user.save((err, userData) => {
		if(err) return res.json({ success: false, err })
	})

	return res.status(200).json({
		success: true
	})
})

/*
app.get('/', (req,res) => {
	res.send('hello world');
});
*/


app.listen(5000);