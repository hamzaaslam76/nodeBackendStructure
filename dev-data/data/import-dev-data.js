const dotenv = require('dotenv');
dotenv.config({ path: '/config.env' });
 const fs = require('fs');
// const app = require('./app');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const User = require('./../../Models/userModel.js')
const Review = require('./../../Models/reviewModel.js')
 

mongoose.connect('mongodb+srv://hamza:ttZrPGkbyH87PPBa@cluster0.o1zk1.mongodb.net/natours?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

}).then(con => {
    console.log("connaction is successfuly");
});
// require('./../../dev-data/data/import-dev-data')
// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
  importData()
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
   // await User.deleteMany();
   // await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
 // deleteData()
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}