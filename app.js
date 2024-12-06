
const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser')
//user routes 
const authRoutes = require('./routes/authRoutes')

// google review routes 
const googleReviewRoutes = require('./routes/googleReviewsRoute')


const sequelize = require('./util/database')
// const csrf = require('csurf')

// const csrfProtection = csrf()

app.use(bodyParser.json())

// add cors headers 
app.use((req,res,next)=> { 
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        next()
})

// auth routes 
app.use(authRoutes)

// google review routes 
app.use(googleReviewRoutes)


// csurf middleware 
// app.use(csrfProtection); 

// default route
app.use("/", (req, res, next)=> { 
        res.send('<h1>hello</h1>'); 
})


// sync with the database 
sequelize.sync().then(result=> {
        app.listen(8080)
} 
).catch(err=> {
    console.log(err)
})

