const fs = require('fs');
const UserModel = require('./models/User');

async function insertFakeUsers() {
  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      profilePicture:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      firstName: 'Sara',
      lastName: 'Doe',
      profilePicture:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      firstName: 'Ilias',
      lastName: 'Haddad',
      profilePicture:
                'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  try {
    const data = await UserModel.insertMany(users);
    fs.writeFileSync('user.json', JSON.stringify(data));
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
  }
}
module.exports = { insertFakeUsers };
