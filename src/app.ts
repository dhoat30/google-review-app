import express from 'express';
import bodyParser from 'body-parser';
import { cleanExpiredTokens } from './util/tokenService';
import sequelize from './util/database'
import schedule from 'node-schedule'

// routes 
import googleReviewsRoute from './routes/googleReviewsRoute'
import authRoutes from './routes/authRoutes'
import businessRoutes from './routes/businessRoutes'

// models 
import User from './models/authModel/User'
import GoogleReview from './models/googleReviewsModel/googleReviewModel'
import Business from './models/businessModel/businessModel';


const app = express(); 


//user routes 

// google review routes 

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
app.use('/reviews',googleReviewsRoute)

// business routes
app.use('/business', businessRoutes)

// csurf middleware 
// app.use(csrfProtection); 

// default route
app.use("/", (req, res)=> { 
        res.send('<h1>helldfsdfo</h1>'); 
})

// Schedule Cleanup Job
schedule.scheduleJob("0 * * * *", async () => { // Run every hour
        await cleanExpiredTokens();
        console.log("Expired tokens cleaned up.");
      });


//  relationships
// google review relation ship 
GoogleReview.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(GoogleReview)


// business relationship
Business.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Business)

// sync with the database 
sequelize.sync().then(()=> {
        app.listen(8080)
} 
).catch((err: Error)=> {
    console.log(err)
})

