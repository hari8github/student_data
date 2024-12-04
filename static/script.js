document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const addSemesterGpaBtn = document.getElementById('addSemesterGpaBtn');
    const addBacklogBtn = document.getElementById('addBacklogBtn');
    const coursesContainer = document.getElementById('coursesContainer');
    const semesterGpaContainer = document.getElementById('semesterGpaContainer');
    const backlogsContainer = document.getElementById('backlogsContainer');

    // Add dynamic course rows
    addCourseBtn.addEventListener('click', () => {
        const courseRow = document.createElement('div');
        courseRow.classList.add('course-row');
        courseRow.innerHTML = `
            <input type="text" class="courseCode" placeholder="Course Code">
            <input type="text" class="courseName" placeholder="Course Name">
            <input type="text" class="instructor" placeholder="Instructor">
            <input type="number" class="credits" placeholder="Credits">
            <input type="number" class="semester" placeholder="Semester">
        `;
        coursesContainer.appendChild(courseRow);
    });

    // Add dynamic semester GPA rows
    addSemesterGpaBtn.addEventListener('click', () => {
        const semesterGpaRow = document.createElement('div');
        semesterGpaRow.classList.add('semester-gpa-row');
        semesterGpaRow.innerHTML = `
            <input type="number" class="semesterNumber" placeholder="Semester">
            <input type="number" step="0.01" class="gpa" placeholder="GPA">
        `;
        semesterGpaContainer.appendChild(semesterGpaRow);
    });

    // Add dynamic backlog rows
    addBacklogBtn.addEventListener('click', () => {
        const backlogRow = document.createElement('div');
        backlogRow.classList.add('backlog-row');
        backlogRow.innerHTML = `
            <input type="text" class="backlogCourseCode" placeholder="Course Code">
            <input type="number" class="attempts" placeholder="Attempts">
        `;
        backlogsContainer.appendChild(backlogRow);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect courses
        const courses = Array.from(document.querySelectorAll('.course-row')).map(row => ({
            course_code: row.querySelector('.courseCode').value,
            course_name: row.querySelector('.courseName').value,
            instructor: row.querySelector('.instructor').value,
            credits: row.querySelector('.credits').value,
            semester: row.querySelector('.semester').value
        }));

        // Collect semester GPAs
        const semesterWiseGpa = Array.from(document.querySelectorAll('.semester-gpa-row')).map(row => ({
            semester: row.querySelector('.semesterNumber').value,
            gpa: row.querySelector('.gpa').value
        }));

        // Collect backlogs
        const backlogs = Array.from(document.querySelectorAll('.backlog-row')).map(row => ({
            course_code: row.querySelector('.backlogCourseCode').value,
            attempts: row.querySelector('.attempts').value
        }));

        const studentData = {
            name: document.getElementById('studentName').value,
            student_id: document.getElementById('studentId').value,
            admission_year: document.getElementById('admissionYear').value,
            department: document.getElementById('department').value,
            program: document.getElementById('program').value,
            current_semester: document.getElementById('currentSemester').value,
            courses: courses,
            academic_performance: {
                cgpa: document.getElementById('cgpa').value,
                semester_wise_gpa: semesterWiseGpa,
                backlogs: backlogs
            },
            attendance: {
                total_classes: document.getElementById('totalClasses').value,
                attended_classes: document.getElementById('attendedClasses').value,
                percentage: document.getElementById('attendancePercentage').value
            }
        };

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (response.ok) {
                alert('Student registered successfully!');
                form.reset();
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});