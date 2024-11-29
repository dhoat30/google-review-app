const User = require('../models/users')

// register page 
exports.getRegister = (req, res, next)=> {
    res.status(200).json({message: 'register page'})
} 

// create a new user 
exports.postAddUser= (req, res, next)=> {
            const firstName = req.body.firstName
            const lastName = req.body.lastName
            const email = req.body.email
            const password = req.body.password
            const phone = req.body.phone
            const companyName = req.body.companyName
            const userData = {firstName: firstName, lastName: lastName, email: email, password: password, phone: phone, companyName: companyName} 
            const user = new User(userData)
console.log(userData)
            user.save().then(result=> {
                res.status(200).json({message: 'user added'})
            }   
            ).catch(err=> {
                console.log(err)
            })
}   