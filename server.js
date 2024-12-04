const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB Connected Successfully');
        } catch (error) {
            console.error('MongoDB Connection Error:', error);
            throw error;
        }
    }
};

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    student_id: { type: String, required: true },
    admission_year: { type: Number, required: true },
    department: { type: String, required: true },
    program: { type: String, required: true },
    current_semester: { type: Number, required: true },
    courses: [{
        course_code: { type: String, required: true },
        course_name: { type: String, required: true },
        instructor: { type: String, required: true },
        credits: { type: Number, required: true },
        semester: { type: Number, required: true }
    }],
    academic_performance: {
        cgpa: { type: Number, required: true },
        semester_wise_gpa: [{
            semester: { type: Number, required: true },
            gpa: { type: Number, required: true }
        }],
        backlogs: [{
            course_code: { type: String, required: true },
            attempts: { type: Number, required: true }
        }]
    },
    attendance: {
        total_classes: { type: Number, required: true },
        attended_classes: { type: Number, required: true },
        percentage: { type: Number, required: true }
    }
});

// Prevent model re-compilation
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// API Handler
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Connect to MongoDB
        await connectDB();

        // Handle different HTTP methods
        switch (req.method) {
            case 'POST':
                try {
                    const studentData = req.body;
                    const student = new Student(studentData);
                    const savedStudent = await student.save();

                    res.status(201).json({
                        message: 'Student registered successfully',
                        student: savedStudent
                    });
                } catch (error) {
                    console.error('Registration Error:', error);
                    
                    if (error.name === 'ValidationError') {
                        return res.status(400).json({
                            message: 'Validation Error',
                            errors: Object.values(error.errors).map(err => err.message)
                        });
                    }

                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: error.message
                    });
                }
                break;

            case 'GET':
                res.status(200).json({ message: 'API is running' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({
            message: 'Unexpected Server Error',
            error: error.message
        });
    }
}
