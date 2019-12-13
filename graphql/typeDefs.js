const { gql } = require('apollo-server');

// Type defintions
module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }

  input UserRegistrationDetails {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Query{
    getPosts: [Post]
  }

  type Mutation {
    register(userRegistrationDetails: UserRegistrationDetails) : User!
    login(username: String!, password: String!) : User!
  }
`;
