const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

// Type defintions
const typeDefs = gql`
  type Query{
    sayHello: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    sayHello: () => 'Hello!'
  }
};

// Setup a new server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// On what port would we be listening to the server
server.listen({ port: 8005 })
  .then(res => console.log(`Server is running on ${res.url}`))
