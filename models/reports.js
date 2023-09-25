const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchemaful = new Schema({
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    date_from: {
        type: Date,
        required: true,
    },
    date_to: {
        type: Date,
        required: true
    },
    avg_education: {
        type: Number,
        required: true,
    },
    avg_shopping: {
        type: Number,
        required: true
    },
    avg_searchbrowsing: {
        type: Number,
        required: true
    },
    avg_socialmedia: {
        type: Number,
        required: true
    },
    total_education: {
        type: Number,
        required: true
    },
    total_shopping: {
        type: Number,
        required: true
    },
    total_searchbrowsing: {
        type: Number,
        required: true
    },
    total_socialmedia: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

var reports = mongoose.model('report', reportSchemaful);

module.exports = reports;