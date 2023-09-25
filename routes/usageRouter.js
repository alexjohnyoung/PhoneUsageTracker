const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usages = require('../models/usages');
const reports = require('../models/reports');

const { response } = require('express');

const usageRouter = express.Router();

// Route /usages/
usageRouter.route('/')
.get((req,res,next) => { // /usages/ GET request
})
.post((req, res, next) => { // /usages/ POST request
})
.put((req, res, next) => { // /usages/ PUT request
})
.delete((req, res, next) => { // /usages/ DELETE request
});

// Route /usages/create
usageRouter.route('/create')
.get((req,res,next) => { // /usages/create GET request

    // Render newusage.ejs page to user, passing title
    res.render('newusage.ejs', { title: 'Create Usage' });   
}, (err) => next(err)) // If there is an error, pass it to the next function to be handled

.post((req, res, next) => { // /usages/create POST request

    // Attempt to create a new Usage document
    usages.create(req.body)

    // If successful, then:
    .then((usagecreated) => {

        // Attempt to find all Usage documents
        usages.find()

        // If successful, then:
         .then((usagesfound) => {

                // Render the Usage List to the user, passing all usages and title
                res.render('currentusage',{'usagelist' : usagesfound, title:'Usage List'} );
        }, (err) => next(err)) // If there is an error, attempt to pass it to the next function
    .catch((err) => next(err)); // If an error is caught, pass it to the next function to be handled
    }, (err) => next(err)) // If there is an error in asynchronous code execution, pass it to the next function to be handled
    .catch((err) => next(err)); 
}, (err) => next(err))

.put((req, res, next) => { // /usages/create PUT request
    res.statusCode = 403;
    res.end('PUT operation not supported on /usages/create');
}, (err) => next(err))

.delete((req, res, next) => { // /usages/create DELETE request
    res.statusCode = 403;
    res.end('Delete operation not  supported on /usages/creste');
    
});

// Route /usages/usagelist 
usageRouter.route('/usagelist')
.get((req,res,next) => { // /usages/usagelist GET request

    // Attempt to find all Usage documents
    usages.find()

    // If successful, then:
    .then((usagesfound) => {

        // Render the Usage List to the user, passing all usages and title
        res.render('usagelist',{'usagelist' : usagesfound, title:'Usage List'} );
    }, (err) => next(err)) // If there is an error, pass it to the next function
    .catch((err) => next(err)); // If there is an error, pass it to the next function
}, (err) => next(err)) // If there is an error, pass it to the next function

// Route /usages/edit/:id
usageRouter.route('/edit/:id')
.get((req, res, next) => { // /usages/edit/:id GET request

    // Attempt to find Usage document by ID (user passed this in parameters)
    usages.findById(req.params.id)

    // If successful, then:
    .then((usagesfound) => {

        // Render the Edit Usage page to the user, passing that particular Usage data and title
        res.render('editusage', {title: 'Edit mobile phone usage', 'usage': usagesfound})
    }, (err) => next(err)) // If there is an error in asynchronous code execution, pass it to the next function
    .catch((err) => next(err)) // If there is an error, catch it and pass it to next function to be handled
}, (err) => next(err)) // If an error occurs during asynchronous code, pass it to the next function to be handled

.post((req, res, next) => { // /usages/edit/:id POST request

    // Create parameters to find in Usages collection
    var findOne = {_id: req.params.id};

    // Attempt to find one Usage document using our previously created array and update it
    usages.findOneAndUpdate(findOne, req.body)
    .then((usageupdated) => { // If it successful:

        // Attempt to find all Usage documents
        usages.find()
        .then((usagesfound) => { // If it is successful

            // Render the Usage List page to the user, passing all the usages and title
            res.render('usagelist',{'usagelist' : usagesfound, title:'Usage List'} );
        }, (err) => next(err)) // If there is an error, pass it to the next function
    .catch((err) => next(err)); // If there is an error, pass it to the next function
    }, (err) => next(err)) // If an error occurs, pass it to the next function to be handled
    .catch((err) => next(err)); // If an error occurs during asynchronous execution, pass it to the next function to be handled
});

// Route /usages/delete/:id
usageRouter.route('/delete/:id')
.get((req, res, next) => { // /usages/delete/:id GET request

    // Attempt to delete Usage document with _id key as req.params.id (passed by user)
    usages.deleteOne({_id: req.params.id})

    // If successful, then:
    .then((usagedeleted) => {

        // Attempt to find all Usage documents
        usages.find()

        // If successful, then:
        .then((usagesfound) => {
            
            // Render the Usage List page to the user, passing all usages and title
            res.render('usagelist',{'usagelist' : usagesfound, title:'Usage List'} );
        }, (err) => next(err)) // If an error occurs, pass it to the next function to be handled
    .catch((err) => next(err)); // If an error presents itself during asynchronous execution, pass it to the next function
    }, (err) => next(err)) // If an error presents itself during asynchronous execution, pass it to the next function
    .catch((err) => next(err)); // If an error presents itself, catch it and send it to the next function
});

// Export this router to be used elsewhere
module.exports = usageRouter;