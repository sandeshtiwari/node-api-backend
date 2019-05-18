const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require("cors");
dotenv.config();
// DB connection
// MONGO_URI=mongodb://localhost/nodeapi
mongoose.connect(
	process.env.MONGO_URI,
	{ useNewUrlParser: true }
).then(() => {console.log('DB Connected')})


// Error checking
mongoose.connection.on('error', err => {
	// const collection = mongoose.db('mydb');
	console.log(`DB Connection error : ${err.message}`);
});


// Bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
//  apiDocs
app.get("/", (req, res) => {
	fs.readFile('docs/apiDocs.json', (err, data) => {
		if(err){
			res.status(400).json({
				error: err
			});
		}
		const docs = JSON.parse(data);
		res.json(docs);
	});
});

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: "Unauthorized!"});
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`A node JS API is listening on port: ${port}`);
});
