const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const PassportLocal = require('passport-local').Strategy

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('misecreto'))
app.use(
  session({
    secret: 'misecreto',
    resave: true,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new PassportLocal(function(username, password, done) {
    if (username === 'ivo' && password === '123')
      return done(null, { id: 1, name: 'Ivo' })
    done(null, false)
  })
)
passport.serializeUser(function(user, done) {
  done(null, user.id)
})
passport.deserializeUser(function(id, done) {
  done(null, { id: 1, name: 'Ivo' })
})

app.set('view engine', 'ejs')

app.get(
  '/',
  (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
  },
  (req, res) => {
    res.send('hola')
    // si ya iniciamos mostrar bienvenida
    // si no hemos iniciado redireccionar a /login
  }
)

app.get('/login', (req, res) => {
  res.render('login')
})

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

app.listen(3000, () => {
  console.log('server started')
})
