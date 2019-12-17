const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new AuthenticationError('Invalid/Expired token.');
    }

    try {
      // authHeader = [Bearer token]
      const user = jwt.verify(token, SECRET_KEY);
      if (!user) {
        throw new AuthenticationError('You must be logged in.');
      }

      return user;
    } catch (error) {
      throw new AuthenticationError('Authentication token must be \'Bearer [token].');
    }
  }
  throw new AuthenticationError('Authorization header must be provided.');
}
