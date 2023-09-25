const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usages = require('../models/usages');
const reports = require('../models/reports');

const { response, json } = require('express');

const reportRouter = express.Router();

// Route /reports/
reportRouter.route('/')
.get((req,res,next) => {
})
.post((req, res, next) => {
})
.put((req, res, next) => {
})
.delete((req, res, next) => {
});

// Route /reports/create/
reportRouter.route('/create')
.get((req,res,next) => { // /reports/create GET request

    // Attempt to find all Usage documents
    usages.find()

    // If successful:
    .then((usagesfound) => {
        names = [] 
        
        // Begin for-loop
        for (let index=0; index < usagesfound.length; index++)

            // If 'names' array does not have this particular name in array
            if (!names.includes(usagesfound[index].name))

                // Add it to the array
                names.push(usagesfound[index].name)

        // Render Report Usage to the user, passing all Usage documents
        res.render('reportusage',{'usagelist' : names, title:'Report Usage'} );
    }, (err) => next(err)) // If there is an error, send it to the next function to be handled
    .catch((err) => next(err)); // Attempt to catch error and send it to the next function to be handled 
}, (err) => next(err)) // If there is an error in asynchronous code, send it to the next function to be handled

.post((req,res,next) => {

    // Create our Match stage for Aggregation
    var match_stage = {
        "$match": {
            "name": req.body.form_name, 
            "createdAt": { 
                "$gte": new Date(req.body.date_from),
                "$lte": new Date(req.body.date_to)
            }
        }
    }

    // Create our Group stage for Aggregation
    var group_stage = {
        "$group": {
            "_id": null,
            "entries": { "$push": {
                "id": "$_id",
                "name": "$name",
                "duration_education": "$duration_education",
                "duration_shopping": "$duration_shopping",
                "duration_searchbrowsing": "$duration_searchbrowsing",
                "duration_socialmedia": "$duration_socialmedia"
            } },
            "count": { "$sum": 1 },
            "total_education": { "$sum": "$duration_education" },
            "total_shopping": { "$sum": "$duration_shopping"},
            "total_searchbrowsing": { "$sum": "$duration_searchbrowsing" },
            "total_socialmedia": { "$sum": "$duration_socialmedia" },
        },
    }

    // Finally, create our Project stage for Aggregation
    var project_stage = {
        "$project": { 
            "date_from": req.body.date_from,
            "date_to": req.body.date_to,
            "name": req.body.form_name,
            "entries": "$entries",
            "avg_education": {"$divide": ["$total_education", "$count"] },
            "avg_shopping": {"$divide": ["$total_shopping", "$count"] },
            "avg_searchbrowsing": {"$divide": ["$total_searchbrowsing", "$count"] },
            "avg_socialmedia": {"$divide": ["$total_socialmedia", "$count"] },

            "total_education": "$total_education",
            "total_shopping": "$total_shopping",
            "total_searchbrowsing": "$total_searchbrowsing",
            "total_socialmedia": "$total_socialmedia"
        }
    }
    
    // Create var 'pipeline' to hold our stage data
    var pipeline = [match_stage, group_stage, project_stage]

    // Call collection.aggregate, passing our pipeline variable and execute it
    const result = usages.aggregate(pipeline).exec((err, result) => {
        if (err) // If there is an error..
            return res.send(err); // Return execution and send user the error

        // Render the User Report, passing the aggregation results back to the user
        res.render('userreport',{'reportlist' : result, 'userlist': result[0].entries, title:'Report mobile phone usage'} );
    });
    
}, (err) => next(err));

// Handle /reports/write POST method
reportRouter.post("/write", ((req, res, next) => {

    // Attempt to create a Reports document using req.body as parameter
    reports.create(req.body)

    // If successful, then:
    .then((reportscreated) => {

        // Attempt to find all Reports Documents
        reports.find()

        // If successful then:
        .then((reportlist) => {

            // Render the Report List to the user, showing them all reports
            res.render('reportlist',{'reportlist' : reportlist, title:'Report Usage'} );
        }, (err) => next(err)) // If there is an error, pass it to the next function
    })
    // Attempt to catch the error, and pass it to the next function
    .catch((err) => next(err));
}));

// Route /reports/view/
reportRouter.route('/view')
.get((req,res,next) => { // /reports/view/ GET request

    // Attempt to find all Reports documents
    reports.find()

    // If successful, then:
    .then((reportsfound) => {

        // Render the Report List to the user, passing them all reports and title
        res.render('reportlist',{'reportlist' : reportsfound, title:'Report List'} );
    }, (err) => next(err)) // If there is an error, pass it to the next function
    .catch((err) => next(err)); // Attempt to catch errors and pass to next function
});

// Route /reports/delete/:id 
reportRouter.route('/delete/:id') // /reports/delete/:id GET request
.get((req,res,next) => {

    // Create findOne array storing _id key and req.params.id variable (user-entered)
    var findOne = {_id: req.params.id};

    // Attempt to find this Document and delete it
    reports.findOneAndDelete(findOne, req.body)

    // If successful, then:
    .then((reportdeleted) => {

        // Attempt to find all Reports
        reports.find()
        .then((reportsfound) => { // If successful then:

            // Render the Report List to the user, passing them all reports and title 
            res.render('reportlist',{'reportlist' : reportsfound, title:'Report List'} );
        }, (err) => next(err)) // If there is an error, send it to the next function
        .catch((err) => next(err)) // Attempt to catch errors and send to next function
    
    }, (err) => next(err)) // If there is an error, send to next function
    .catch((err) => next(err)); // Attempt to catch error and send to next function 
}, (err) => next(err)) // Attempt to catch errors and send to the next function

// Export this router to be used elsewhere
module.exports = reportRouter;