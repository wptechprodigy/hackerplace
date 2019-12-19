const { AuthenticationError,UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check_auth');

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      // user = { id, username, email }
      const { username } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body cannot be empty.'
          }
        })
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError('Post not found!');
      }

      post.comments.unshift({
        body,
        username,
        createdAt: new Date().toISOString(),
      });

      await post.save();

      return post;
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError('Post not found!');
      }

      const commentIndex = await post.comments.findIndex(comment => comment.id === commentId);
      if (post.comments[commentIndex].username === username) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } else throw new AuthenticationError('You cannot perform this action.');
    }
  }
}
