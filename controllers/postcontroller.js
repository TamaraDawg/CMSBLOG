const { Post, Comment, User } = require('../models');

const postController = {
  async getSinglePostPage(req, res) {
    try {
      const post = await Post.findByPk(req.params.id, {
        include: [
          { model: User, attributes: ['username'] },
          { model: Comment, attributes: ['content', 'createdAt'], include: [{ model: User, attributes: ['username'] }] },
        ],
      });

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      res.render('single-post', { post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  async createPost(req, res) {
    try {
      const { title, content } = req.body;

      const post = await Post.create({
        title,
        content,
        user_id: req.session.user_id,
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  async updatePost(req, res) {
    try {
      const { title, content } = req.body;

      await Post.update(
        { title, content },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );

      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  async deletePost(req, res) {
    try {
      await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = postController;
