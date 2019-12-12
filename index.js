const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

// Relative imports
const Post = require('./models/Post');
const { MONGODB } = require('./config');

// Type defintions
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Query{
    getPosts: [Post]
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const allPosts = await Post.find();
        return allPosts;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};

// Setup a new server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Be sure to connect to DB before server starts
mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('Database connection successful.');
    return server.listen({ port: 8005 })
  })
  .then(res => console.log(`Server is running on ${res.url}`))
  .catch(error => {
    console.log(`Error: ${error.message} occurs.`)
  });
