const { Post, User, Comment } = require('../models');

const homeController = {
  async getHomePage(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Comment, attributes: ['content', 'createdAt'], include: [{ model: User, attributes: ['username'] }] }
        ],
      });

      res.render('home', { posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = homeController;
