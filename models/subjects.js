const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: String,
    teacher: String,
    chapter: [{
        chapterNumber: Number,
        topics: String
    }]
});

module.exports = mongoose.model('Subject', subjectSchema);
