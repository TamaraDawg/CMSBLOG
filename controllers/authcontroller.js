const { User } = require('../models');
const bcrypt = require('bcrypt');

const authController = {
  getSignupPage(req, res) {
    res.render('signup');
  },

  async signup(req, res) {
    try {
      const { username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
      });

      req.session.save(() => {
        req.session.user_id =user.id;
        req.session.logged_in = true;
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getLoginPage(req, res) {
    res.render('login');
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user) {
        res.status(400).json({ message: 'Invalid username or password' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(400).json({ message: 'Invalid username or password' });
        return;
      }

      req.session.save(() => {
        req.session.user_id = user.id;
        req.session.logged_in = true;
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },
};

module.exports = authController;
