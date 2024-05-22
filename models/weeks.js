const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
    month: String, 
    weekNumber: Number,
    startDate: Date,
    endDate: Date,
    periods: [{
        periodName: String,
        subjectName: String
    }]
});

module.exports = mongoose.model('Week', weekSchema);
