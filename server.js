const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static'))); // Serve static files

// Serve the HTML file from the templates folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'std.html'));     
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Student Schema (assuming it's declared earlier in your file)
const studentSchema = new mongoose.Schema({
    name: String,
    student_id: String,
    admission_year: Number,
    department: String,
    program: String,
    current_semester: Number,
    courses: [
        {
            course_code: String,
            course_name: String,
            instructor: String,
            credits: Number,
            semester: Number
        }
    ],
    academic_performance: {
        cgpa: Number,
        semester_wise_gpa: [
            {
                semester: Number,
                gpa: Number
            }
        ],
        backlogs: [
            {
                course_code: String,
                attempts: Number
            }
        ]
    },
    attendance: {
        total_classes: Number,
        attended_classes: Number,
        percentage: Number
    }
});
const Student = mongoose.model('student_data', studentSchema);

// API Endpoint
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});