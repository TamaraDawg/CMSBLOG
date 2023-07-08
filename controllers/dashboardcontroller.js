const { Post } = require('../models');

const dashboardController = {
  async getDashboardPage(req, res) {
    try {
      const posts = await Post.findAll({ where: { user_id: req.session.user_id } });

      res.render('dashboard', { posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = dashboardController;
