const Post = require('../../models/Post');

module.exports = {
  Query: {
    async getPost () {
      try {
        const allPosts = await Post.find();
        return allPosts;
      } catch (error) {
        throw new Error(error);
      }
    },
  }
}
