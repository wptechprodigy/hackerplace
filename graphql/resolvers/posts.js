const Post = require('../../models/Post');
const checkAuth = require('../../utils/check_auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const allPosts = await Post.find().sort({ createdAt: -1 });
        return allPosts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found.')
        }

        return post;
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty post', {
          errors: {
            body: 'Post body cannot be empty.'
          }
        })
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new AuthenticationError('Post not found!');
        }

        if (post.username === user.username) {
          await post.delete();
          return 'Post deleted successfully!';
        } else {
          throw new AuthenticationError('Action not allowed!');
        }
      } catch (error) {
        throw new AuthenticationError(error);
      }

    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError('Post not found!');
      }

      if (post.likes.find(like => like.username === username)) {
        // Already liked, then unlike post
        post.likes = post.likes.filter(like => like.username !== username);
      } else {
        // Not liked yet, then like it
        post.likes.push({
          username,
          createdAt: new Date().toISOString()
        })
      }

      await post.save();

      return post;
    }
  }
}
