const express = require('express'); 
const app = express();

const mongoose = require('mongoose'); 
mongoose.set('useCreateIndex', true);  // https://github.com/nodkz/mongoose-plugin-autoinc/issues/26

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require("./config/key"); 	// import our config key

const { User } = require("./models/user"); // import our User schema/model

const { auth } = require("./middleware/auth"); 

mongoose.connect(config.mongoURI,  
	{useNewUrlParser: true }).then(() => console.log('DB conncected'))   // 'useNewurlParser: true' removes deprecation warning that we get from mongoose
							 .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: true })); // import body Parser to parse the client request
app.use(bodyParser.json()); // import bodyParser to be able to read-json
app.use(cookieParser());    // import cookieParser

app.get("/", (req,res) => {
	res.json({ "hello": "I am happy to deploy our application" })
})


console.log('hello');

app.get("/api/users/auth", auth, (req,res) => {
	res.status(200).json({
		_id: req._id,
		isAuth: true, 
		email: req.user.email, 
		name: req.user.name,
		lastname: req.user.lastname, 
		role: req.user.role
	})
})


// Register a User (need to access database)
app.post('/api/users/register', (req,res) => {

	const user = new User(req.body);

	user.save((err, doc) => {
		if (err) return res.json({ success: false,err });
		res.status(200).json({
			success: true,
			userData: doc 
		})
	})
})

app.post('/api/users/login', (req,res) => {
	// find the email

	User.findOne({ email: req.body.email }, (err, user) => {
		if(!user)
			return res.json({
				loginSuccess: false, 
				message: "Auth failed, email not found"
			});

		// comparePassword
		user.comparePassword(req.body.password, (err,isMatch) => {
			if (!isMatch) {
				return res.json({ loginSuccess: false, message: "wrong password"})
			}

		})

		// generateToken
		user.generateToken((err, user) => {
			if(err) return res.status(400).send(err);
			res.cookie("x_auth", user.token)
			   .status(200)
			   .json({
			   	  loginSuccess: true
			  })
		})

	})

})

app.get('/api/users/logout', auth,(req,res) => {
	User.findOneAndUpdate({ _id: req.user._id}, { token: ""}, (err, doc) => {
		if(err) return res.json({ success: false, err })
		return res.status(200).send({
			success: true
		})
	})
})

// either use Heroku Port or our default port 5000
const port = process.env.PORT || 5000


app.listen(port, () => {
	console.log(`Server Running at ${port}`)
});

