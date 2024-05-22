const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/academic_plan');

const Class = require('./models/classes');
const Week = require('./models/weeks');
const Subject = require('./models/subjects');


const classesData = [
    { className: 'Class 1', section: 'A', classTeacher: 'Teacher A', numberOfStudents: 20 },
    { className: 'Class 2', section: 'B', classTeacher: 'Teacher B', numberOfStudents: 25 },
    { className: 'Class 3', section: 'C', classTeacher: 'Teacher C', numberOfStudents: 30 }
];

const subjectsData = [
    {
        subjectName: 'Mathematics',
        teacher: 'Teacher M',
        className: 'Class 1',
        chapter: [
            { chapterNumber: 1, topicsCovered: 'Algebra' },
            { chapterNumber: 2, topicsCovered: 'Geometry' },
            { chapterNumber: 3, topicsCovered: 'Trigonometry' },
            { chapterNumber: 4, topicsCovered: 'Calculus' }
        ]
    },
    {
        subjectName: 'Science',
        teacher: 'Teacher S',
        className: 'Class 1',
        chapter: [
            { chapterNumber: 1, topicsCovered: 'Physics' },
            { chapterNumber: 2, topicsCovered: 'Chemistry' },
            { chapterNumber: 3, topicsCovered: 'Biology' },
            { chapterNumber: 4, topicsCovered: 'Environmental Science' }
        ]
    },
    {
        subjectName: 'English',
        teacher: 'Teacher E',
        className: 'Class 1',
        chapter: [
            { chapterNumber: 1, topicsCovered: 'Grammar' },
            { chapterNumber: 2, topicsCovered: 'Literature' },
            { chapterNumber: 3, topicsCovered: 'Writing Skills' },
            { chapterNumber: 4, topicsCovered: 'Comprehension' }
        ]
    }
];

async function seedClassesAndSubjects() {
    try {
        await Class.deleteMany();
        await Subject.deleteMany();
        await Subject.insertMany(subjectsData);

        for (const classData of classesData) {
            const subjects = await Subject.find();
            classData.subjects = subjects.map(subject => subject._id);
            await Class.create(classData);
        }

        console.log('Classes and subjects dummy data created successfully');
    } catch (error) {
        console.error('Error seeding classes:', error);
    }
}

seedClassesAndSubjects();


app.post('/weeks', async (req, res) => {
    try {
        const { year } = req.body;
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Please enter a valid year' });
        }

        // Delete existing weeks
        await Week.deleteMany()
        const createdWeeks = [];
        const subjects = await Subject.find();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthName = monthNames[monthIndex];
            const startDate = new Date(year, monthIndex, 2);
            let currentStartDate = new Date(startDate);
            for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
                const weekStartDate = new Date(currentStartDate);
                const weekEndDate = new Date(currentStartDate);
                weekEndDate.setDate(currentStartDate.getDate() + 6);
                const periods = [];
                for (let day = 1; day <= 7; day++) {
                    for (let periodNumber = 1; periodNumber <= 8; periodNumber++) {
                        const randomSubject = getRandomItem(subjects);
                        const period = {
                            periodName: `Period ${periodNumber} - Day ${day}`,
                            subjectName: randomSubject.subjectName
                        };

                        periods.push(period);
                    }
                }

                const week = new Week({
                    month: monthName,
                    weekNumber,
                    startDate: weekStartDate,
                    endDate: weekEndDate,
                    periods
                });

                await week.save();
                createdWeeks.push(week);
                currentStartDate.setDate(currentStartDate.getDate() + 7)
            }
        }

        res.json({ message: 'Weeks created successfully', weeks: createdWeeks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Please try again later' });
    }
});

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


app.get('/weeks', async (req, res) => {
    try {
        const weeks = await Week.find()
        res.json(weeks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Please try again later' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
