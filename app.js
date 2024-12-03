const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser')
//user routes 
const userRoutes = require('./routes/user')

const sequelize = require('./util/database')

app.use(bodyParser.json())

app.use(userRoutes)

app.use("/", (req, res, next)=> { 
        console.log('google credentials', process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)

        res.send('<h1>hello</h1>'); 
})
// sync with the database 
sequelize.sync().then(result=> {
        app.listen(8080)
        console.log("server is running ")
} 
).catch(err=> {
    console.log(err)
})

