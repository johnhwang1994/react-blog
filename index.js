const express = require('express');
const app = express();
const mongoose = require('mongoose'); 

mongoose.connect('mongodb+srv://JohnWang:1234@react-blog-v8zvp.mongodb.net/test?retryWrites=true&w=majority', 
	{useNewUrlParser: true }).then(() => console.log('DB conncected'))   // 'useNewurlParser: true' removes deprecation warning that we get from mongoose
							 .catch(err => console.error(err));

app.get('/', (req,res) => {
	res.send('hello world');
});



app.listen(5000);