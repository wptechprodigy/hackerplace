const { gql } = require('apollo-server');

// Type defintions
module.exports = gql`
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
