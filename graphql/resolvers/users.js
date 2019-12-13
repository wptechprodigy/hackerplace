const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLogin } = require('../../utils/validators');

const User = require('../../models/User');

/**
 * A function to generate a token
 *
 * @param  Object user payload
 * @returns Token object
 */
function generateToken(user) {
  return jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email
  }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLogin(username, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Do we have such user?
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }
      console.log(password, user);
      // Does the password match?
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      // User is valid...then generate token for him/her
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },
    async register(_, { userRegistrationDetails: { username, email, password, confirmPassword } }) {
      // Validate user details - Never trust users
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
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
      const savedUser = await newUser.save();

      const token = generateToken(savedUser);

      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      }
    }
  }
}
