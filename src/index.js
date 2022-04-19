require('dotenv').config({});
const mongoose = require('mongoose');
const app = require('./app');
const UserModel = require('./models/User');
const { insertFakeUsers } = require('./utils');

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ghiho.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    },
    async (err) => {
      /* eslint-disable no-console */
      console.log(err);
      console.log('MongoDB connected');
      /* eslint-enable no-console */

      const users = await UserModel.countDocuments({});
      if (users === 0) {
        insertFakeUsers();
      }
    }
  );
});
