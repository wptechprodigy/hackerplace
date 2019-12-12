const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

// Relative imports
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

// Setup a new server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Be sure to connect to DB before server starts
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successful.');
    return server.listen({ port: 8005 })
  })
  .then(res => console.log(`Server is running on ${res.url}`))
  .catch(error => {
    console.log(`Error: ${error.message} occurs.`)
  });
