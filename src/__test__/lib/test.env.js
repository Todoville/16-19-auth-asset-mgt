process.env.NODE_ENV = 'development';
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/doop';
process.env.SECRET_KEY = 'Huasdfiwknlasgfnwkeo002222njaksdfsdoclxo89834ht25585552';

// set this to true or false depending on if you want to hit the mock AWS-SDK 
// set to false if you want to make a real API call to your bucket
const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fake';
  process.env.AWS_ACCESSS_KEY_ID = 'fake';
  require('./setup');
} else {
  // remember to set your .env vars and add .env in .gitignore
  require('dotenv').config();
}
