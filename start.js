const mongoose = require('mongoose');
const app = require("./app");
require("dotenv").config();

//Connect to website database by linking .env file
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Log the success or fail of database connection
mongoose.connection
    .on('open', () => {
    console.log("Mongoose connection open");
    })
    .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
    });

//Start listening to server
const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
})