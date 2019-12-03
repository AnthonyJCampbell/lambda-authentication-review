const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./users-model.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12)

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

router.get('/hash', (req, res) => {
  const password = req.headers.authorization;

  const hash = bcrypt.hashSync(password, 12)

  res.status(200).json({hash})
})

function restricted(req, res, next) {
  let {username, password} = req.headers

  if (username && password) {
    next()
  } else {
    res.status(400).json({"message": "Please provide valid credentials"})
  }
}

module.exports = router;
