// ==========================================
// FACEATTEND
// Smart Attendance System
// ==========================================


// ==========================================
// DATA
// ==========================================

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || [];


let stream = null;


// ==========================================
// ELEMENTS
// ==========================================

const video =
    document.getElementById("video");

const startCamera =
    document.getElementById("startCamera");

const stopCamera =
    document.getElementById("stopCamera");

const cameraMessage =
    document.getElementById("cameraMessage");

const markAttendance =
    document.getElementById("markAttendance");

const attendanceTable =
    document.getElementById("attendanceTable");

const fullAttendanceTable =
    document.getElementById(
        "fullAttendanceTable"
    );

const studentGrid =
    document.getElementById("studentGrid");


// ==========================================
// DATE
// ==========================================

function getToday() {

    return new Date()
        .toLocaleDateString("en-IN");

}


function getTime() {

    return new Date()
        .toLocaleTimeString("en-IN");

}


document.getElementById(
    "currentDate"
).textContent = getToday();


// ==========================================
// CAMERA
// ==========================================

startCamera.addEventListener(
    "click",
    async function () {

        try {

            stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {
                            width: 1280,
                            height: 720
                        },

                        audio: false

                    });


            video.srcObject =
                stream;


            cameraMessage.textContent =
                "Camera active — look at the camera";


        }

        catch (error) {

            console.error(error);

            cameraMessage.textContent =
                "Camera permission denied";

            alert(
                "Please allow camera permission in Chrome."
            );

        }

    }
);


// ==========================================
// STOP CAMERA
// ==========================================

stopCamera.addEventListener(
    "click",
    function () {

        stopCameraFunction();

    }
);


function stopCameraFunction() {

    if (stream) {

        stream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        stream = null;

        video.srcObject = null;

        cameraMessage.textContent =
            "Camera stopped";

    }

}


// ==========================================
// NAVIGATION
// ==========================================

const menuButtons =
    document.querySelectorAll(
        ".nav-item"
    );


const sections = {

    dashboard:
        document.getElementById(
            "dashboardSection"
        ),

    attendance:
        document.getElementById(
            "attendanceSection"
        ),

    students:
        document.getElementById(
            "studentsSection"
        ),

    reports:
        document.getElementById(
            "reportsSection"
        ),

    settings:
        document.getElementById(
            "settingsSection"
        )

};


menuButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                menuButtons.forEach(
                    btn =>
                        btn.classList
                           .remove("active")
                );


                this.classList.add(
                    "active"
                );


                const section =
                    this.dataset.section;


                Object.values(sections)
                    .forEach(
                        item =>
                            item.classList
                                .add("hidden")
                    );


                sections[section]
                    .classList
                    .remove("hidden");


                updatePageTitle(
                    section
                );


                if (
                    section ===
                    "attendance"
                ) {

                    renderFullAttendance();

                }


                if (
                    section ===
                    "students"
                ) {

                    renderStudents();

                }


                if (
                    section ===
                    "reports"
                ) {

                    updateReports();

                }

            }

        );

    }
);


// ==========================================
// PAGE TITLES
// ==========================================

function updatePageTitle(
    section
) {

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    if (section === "dashboard") {

        title.textContent =
            "Attendance Dashboard";

        subtitle.textContent =
            "Real-time face recognition attendance";

    }


    else if (
        section ===
        "attendance"
    ) {

        title.textContent =
            "Attendance Records";

        subtitle.textContent =
            "View and search attendance";

    }


    else if (
        section ===
        "students"
    ) {

        title.textContent =
            "Student Management";

        subtitle.textContent =
            "Register and manage students";

    }


    else if (
        section ===
        "reports"
    ) {

        title.textContent =
            "Attendance Reports";

        subtitle.textContent =
            "Attendance statistics";

    }


    else if (
        section ===
        "settings"
    ) {

        title.textContent =
            "Settings";

        subtitle.textContent =
            "Manage system settings";

    }

}


// ==========================================
// ADD STUDENT
// ==========================================

const addStudentButton =
    document.getElementById(
        "addStudent"
    );


addStudentButton.addEventListener(
    "click",
    function () {

        const name =
            document.getElementById(
                "studentNameInput"
            ).value.trim();


        const id =
            document.getElementById(
                "studentIdInput"
            ).value.trim();


        const course =
            document.getElementById(
                "studentCourseInput"
            ).value.trim();


        const message =
            document.getElementById(
                "studentMessage"
            );


        if (
            name === "" ||
            id === "" ||
            course === ""
        ) {

            message.textContent =
                "⚠️ Please fill all fields.";

            message.style.color =
                "#d62845";

            return;

        }


        const existing =
            students.find(
                student =>
                    student.id.toLowerCase()
                    === id.toLowerCase()
            );


        if (existing) {

            message.textContent =
                "⚠️ Student ID already exists.";

            message.style.color =
                "#d62845";

            return;

        }


        const student = {

            name: name,

            id: id,

            course: course

        };


        students.push(student);


        saveStudents();


        document.getElementById(
            "studentNameInput"
        ).value = "";


        document.getElementById(
            "studentIdInput"
        ).value = "";


        document.getElementById(
            "studentCourseInput"
        ).value = "";


        message.textContent =
            "✅ Student added successfully.";

        message.style.color =
            "#15965b";


        renderStudents();

        updateStatistics();

    }
);


// ==========================================
// SAVE STUDENTS
// ==========================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// ==========================================
// RENDER STUDENTS
// ==========================================

function renderStudents() {

    studentGrid.innerHTML = "";


    if (students.length === 0) {

        studentGrid.innerHTML = `

            <div class="student-card">

                <h3>
                    No students registered
                </h3>

                <p>
                    Add your first student above.
                </p>

            </div>

        `;

        return;

    }


    students.forEach(
        student => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "student-card";


            card.innerHTML = `

                <div class="student-avatar">
                    👤
                </div>

                <h3>
                    ${student.name}
                </h3>

                <p>
                    ID: ${student.id}
                </p>

                <p>
                    Course: ${student.course}
                </p>

                <button
                    class="delete-student"
                    onclick="deleteStudent('${student.id}')">

                    🗑️ Delete

                </button>

            `;


            studentGrid.appendChild(
                card
            );

        }
    );

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    if (
        !confirm(
            "Delete this student?"
        )
    ) {

        return;

    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    saveStudents();

    renderStudents();

    updateStatistics();

}


// ==========================================
// MARK ATTENDANCE
// ==========================================

markAttendance.addEventListener(
    "click",
    function () {

        if (
            students.length === 0
        ) {

            alert(
                "Please register at least one student first."
            );

            return;

        }


        /*
            TEMPORARY DEMO RECOGNITION

            Later this section will be connected
            to the actual face-recognition model.
        */


        const student =
            students[0];


        const today =
            getToday();


        const alreadyMarked =
            attendance.some(
                record =>

                    record.studentId
                    === student.id &&

                    record.date
                    === today
            );


        if (alreadyMarked) {

            showStatus(
                "⚠️ Attendance already marked today.",
                false
            );

            return;

        }


        const record = {

            studentName:
                student.name,

            studentId:
                student.id,

            date:
                today,

            time:
                getTime(),

            status:
                "Present"

        };


        attendance.push(
            record
        );


        localStorage.setItem(
            "attendance",
            JSON.stringify(
                attendance
            )
        );


        // Recognition result

        document.getElementById(
            "studentName"
        ).textContent =
            student.name;


        document.getElementById(
            "studentId"
        ).textContent =
            student.id;


        document.getElementById(
            "confidenceValue"
        ).textContent =
            "96%";


        document.getElementById(
            "confidenceBar"
        ).style.width =
            "96%";


        document.getElementById(
            "recognitionIcon"
        ).textContent =
            "✅";


        showStatus(
            "✓ Attendance Marked Successfully",
            true
        );


        updateTable();

        updateStatistics();

        renderFullAttendance();

        updateReports();

    }
);


// ==========================================
// STATUS
// ==========================================

function showStatus(
    message,
    success
) {

    const status =
        document.getElementById(
            "attendanceStatus"
        );


    status.textContent =
        message;


    status.className =
        success
            ? "status success"
            : "status waiting";

}


// ==========================================
// TODAY TABLE
// ==========================================

function updateTable() {

    attendanceTable.innerHTML = "";


    const today =
        getToday();


    const todayRecords =
        attendance.filter(
            record =>
                record.date === today
        );


    if (
        todayRecords.length === 0
    ) {

        attendanceTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center">

                    No attendance marked yet.

                </td>

            </tr>

        `;

        return;

    }


    todayRecords.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    👤 ${record.studentName}
                </td>

                <td>
                    ${record.studentId}
                </td>

                <td>
                    ${record.time}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>

                    <span class="present">

                        ✓ ${record.status}

                    </span>

                </td>

            `;


            attendanceTable.appendChild(
                row
            );

        }
    );

}


// ==========================================
// FULL ATTENDANCE TABLE
// ==========================================

function renderFullAttendance(
    search = ""
) {

    fullAttendanceTable.innerHTML =
        "";


    let records =
        [...attendance];


    if (search !== "") {

        records =
            records.filter(
                record =>

                    record.studentName
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

                    ||

                    record.studentId
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

            );

    }


    if (records.length === 0) {

        fullAttendanceTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center">

                    No attendance records found.

                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    👤 ${record.studentName}
                </td>

                <td>
                    ${record.studentId}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>
                    ${record.time}
                </td>

                <td>

                    <span class="present">

                        ✓ ${record.status}

                    </span>

                </td>

            `;


            fullAttendanceTable.appendChild(
                row
            );

        }
    );

}


// ==========================================
// SEARCH ATTENDANCE
// ==========================================

document.getElementById(
    "attendanceSearch"
).addEventListener(
    "input",
    function () {

        renderFullAttendance(
            this.value
        );

    }
);


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        students.length;


    const today =
        getToday();


    const presentIds =
        new Set(

            attendance

                .filter(
                    record =>
                        record.date
                        === today
                )

                .map(
                    record =>
                        record.studentId
                )

        );


    const present =
        presentIds.size;


    const absent =
        Math.max(
            total - present,
            0
        );


    const percentage =
        total > 0
            ? (
                present /
                total *
                100
            ).toFixed(1)
            : 0;


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    document.getElementById(
        "presentStudents"
    ).textContent =
        present;


    document.getElementById(
        "absentStudents"
    ).textContent =
        absent;


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        percentage + "%";

}


// ==========================================
// REPORTS
// ==========================================

function updateReports() {

    const total =
        students.length;


    const today =
        getToday();


    const present =
        new Set(

            attendance

                .filter(
                    record =>
                        record.date === today
                )

                .map(
                    record =>
                        record.studentId
                )

        ).size;


    const absent =
        Math.max(
            total - present,
            0
        );


    const percentage =
        total > 0
            ? (
                present /
                total *
                100
            ).toFixed(1)
            : 0;


    document.getElementById(
        "reportStudents"
    ).textContent =
        total;


    document.getElementById(
        "reportPresent"
    ).textContent =
        present;


    document.getElementById(
        "reportAbsent"
    ).textContent =
        absent;


    document.getElementById(
        "reportPercentage"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "reportProgress"
    ).style.width =
        percentage + "%";

}


// ==========================================
// CLEAR TODAY'S ATTENDANCE
// ==========================================

document.getElementById(
    "clearAttendance"
).addEventListener(
    "click",
    function () {

        if (
            !confirm(
                "Clear today's attendance?"
            )
        ) {

            return;

        }


        const today =
            getToday();


        attendance =
            attendance.filter(
                record =>
                    record.date !== today
            );


        localStorage.setItem(
            "attendance",
            JSON.stringify(
                attendance
            )
        );