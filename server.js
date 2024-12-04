const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Enhanced error logging function
function logError(error) {
    console.error('Detailed Error Log:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
}

// Mongoose Connection Handler
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        logError(error);
    }
};

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    student_id: String,
    admission_year: Number,
    department: String,
    program: String,
    current_semester: Number,
    courses: [{
        course_code: String,
        course_name: String,
        instructor: String,
        credits: Number,
        semester: Number
    }],
    academic_performance: {
        cgpa: Number,
        semester_wise_gpa: [{
            semester: Number,
            gpa: Number
        }],
        backlogs: [{
            course_code: String,
            attempts: Number
        }]
    },
    attendance: {
        total_classes: Number,
        attended_classes: Number,
        percentage: Number
    }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route for debugging
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Serverless function is working',
        environment: process.env.NODE_ENV
    });
});

// Student Registration Endpoint
app.post('/api/students', async (req, res) => {
    try {
        // Ensure DB connection before processing
        await connectDB();

        const student = new Student(req.body);
        const savedStudent = await student.save();
        
        res.status(201).json({
            message: 'Student registered successfully',
            student: savedStudent
        });
    } catch (error) {
        console.error('Student Registration Error:', error);
        logError(error);
        
        res.status(500).json({
            message: 'Internal Server Error',
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    logError(err);
    res.status(500).json({
        message: 'Unexpected Error',
        error: {
            name: err.name,
            message: err.message
        }
    });
});

// Initialize DB Connection on module load
connectDB();

// Export serverless handler
module.exports.handler = serverless(app);
