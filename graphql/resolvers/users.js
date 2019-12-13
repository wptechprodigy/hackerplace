const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../../config');

const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(_, { UserRegistrationDetails: { username, email, password, confirmPassword } }) {
      // TODO: validate user details
      // TODO: confirm both password fields have same value
      // TODO: hash the password and create a user token
      // TODO: save user into the database
      const passwordHash = bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password: passwordHash,
        createdAt: new Date().toISOString()
      });

      const result = await newUser;

      const token = jwt.sign({
        id: result.id,
        username: result.username,
        email: result.email
      }, SECRET_KEY, { expiresIn: '1h' });

      return {
        ...result._doc,
        id: result._id,
        token,
      }
    }
  }
}
