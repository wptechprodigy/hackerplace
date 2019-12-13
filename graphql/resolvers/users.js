const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput } = require('../../utils/validators');

const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(_, { userRegistrationDetails: { username, email, password, confirmPassword } }) {
      // Validate user details - Never trust users
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors } )
      }

      // Verify username is not already taken
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username is already taken', {
          errors: {
            username: 'This username is already taken.',
          }
        });
      }

      // Is the email unique?
      const userEmail = await User.findOne({ email });

      if (userEmail) {
        throw new UserInputError('Email is already taken', {
          errors: {
            username: 'This email is already taken.',
          }
        });
      }

      // hash the password and create a user token
      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password: passwordHash,
        createdAt: new Date().toISOString()
      });

      // save user into the database
      const result = await newUser.save();

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
