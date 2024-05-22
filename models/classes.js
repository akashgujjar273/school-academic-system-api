const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: String,
    section: String,
    classTeacher: String,
    numberOfStudents: Number,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
});

module.exports = mongoose.model('Class', classSchema);
