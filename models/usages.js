const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usageSchemaful = new Schema({
    name: {
        type: String,
        required: true,
    },
    duration_education: {
        type: Number,
        required: true
    },
    duration_shopping: {
        type: Number,
        required: true
    },
    duration_searchbrowsing: {
        type: Number,
        required: true
    },
    duration_socialmedia: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
var usages = mongoose.model('usage', usageSchemaful);

module.exports = usages;