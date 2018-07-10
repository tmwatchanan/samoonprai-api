var express = require('express')
var app = express()
var bodyParser = require('body-parser') // handling HTML body
var morgan = require('morgan') // logging
var helmet = require('helmet')

// Lcao environment variables from a .env file -> process.env
require('dotenv').config()

var port = process.env.PORT || 5050 // process.env.PORT lets the port be set by Heroku
app.set('port', port)

// Allow CORS
var cors = require('cors')
app.use(cors({}))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*')
    res.header("Access-Control-Allow-Credentials", true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
    next()
})

// use body parser so we can get info from POST and/or URL params
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use(morgan('dev'))
app.listen(app.get('port'), () => {
    console.log('Listening requests on port ' + port)
})

app.use(helmet())

var request = require('request')
var path = require('path')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/public', express.static(process.cwd() + '/public'))

// use res.render to load up an ejs view file

//--------------------------------------------------------------------------------------------

var submissionController = require('./controllers/submission-controller')

app.get('/', function (req, res) {
    return res.json({
        server: "SamoonprAI"
    })
})

app.post('/herb-image-url', submissionController.SubmitHerbImageUrl)
