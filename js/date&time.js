const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const startYear = 1990;
const endYear = 2030;
let month = 0;
let year = 0;
let selectedDays = [];
let mousedown = false;
let mousemove = false;

window.addEventListener('load', function () {
    let date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    document.getElementById("currentMonth").innerHTML = months[month];
    document.getElementById("currentYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();
});

function daysInMonth(month, year) {
    let d = new Date(year, month+1, 0);
    return d.getDate();
}


function loadCalendarMonths() {
    for (let i = 0; i < months.length; i++) {
        let loadedMonth = document.createElement("div");
        loadedMonth.innerHTML = months[i];
        loadedMonth.onclick = (function () {
            let selectedMonth = i;
            return function () {
                month = selectedMonth;
                document.getElementById("currentMonth").innerHTML = months[month];
                loadCalendarDays();
                return month;
            }
        })();
        document.getElementById("months").appendChild(loadedMonth);
    }
}

// function loadCaledar(range = 'months', start = 0, end = 12) {
//     for (let i = start; i < end; i++) {
//         let loaded = document.createElement("div");
//         loaded.innerHTML = range === "months" ? months[i] : i;
//         loaded.onclick = (function () {
//             return function () {
//                 document.getElementById(range === "months" ? "currentMonth" : "currentYear").innerHTML = i.toString();
//                 loadCalendarDays();
//                 return i;
//             }
//         })();
//         document.getElementById(range).appendChild(loaded);
//     }
// }

function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (let i = startYear; i <= endYear; i++) {
        let loadedYear = document.createElement("div");
        loadedYear.innerHTML = i;
        loadedYear.onclick = (function () {
            return function () {
                document.getElementById("currentYear").innerHTML = i;
                loadCalendarDays();
                return year;
            }
        })();
        document.getElementById("years").appendChild(loadedYear);
    }
}


function loadCalendarDays() {
    document.getElementById("calendarDays").innerHTML = "";
    let tempDate = new Date(year, month, 0);
    let numberOfDays = daysInMonth(month, year);
    let dayOfWeek = tempDate.getDay();

    for (let i = 1; i <= dayOfWeek; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.classList.add("blank");
        document.getElementById("calendarDays").appendChild(day);
    }

    for (let i = 0; i < numberOfDays; i++) {
        let temp = i + 1;
        let day = document.createElement("div");
        day.id = "calendarDay_" + temp;
        day.className = "day";
        day.innerHTML = temp;
        day.dataset.day = temp;
        let dayDate = new Date(year, month, temp);

        day.addEventListener('click', function () {
            const dayDateStr = normalizeDate(dayDate);
            if (!!getTasksFromLS().find(task => task.date === dayDateStr)) {
                const dayTasks = getTasksFromLSByDate(dayDateStr);
                document.querySelector('.header').innerHTML = dayDateStr;
                injectTasksToHtml(dayTasks);
            } else {
                injectTasksToHtml([]);
                document.querySelector('.header').innerHTML = dayDateStr;
            }
        });

        day.addEventListener('mousemove', function (e) {
            e.preventDefault();
            if (mousedown) {
                this.classList.add('selected');
            }
            if (!selectedDays.includes(this.dataset.day)) {
                selectedDays.push(this.dataset.day);
            }
        });
        document.getElementById("calendarDays").appendChild(day);
    }
    let clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}

function normalizeDate(date) {
    return date.getFullYear() + '-'
    + ('0' + (date.getMonth()+1)).slice(-2) + '-'
    + ('0' + date.getDate()).slice(-2)
}

function injectTasksToHtml(tasks) {
    let tasksHtml = '';
    tasks.forEach(task => {
        const taskHtml = `
            <div class="task">
                <p>${task.title}</p>
                <p>${task.description}</p>
                <p>${task.time}</p>
            </div>`;
        tasksHtml += taskHtml;
    });
    document.querySelector('.tasks-list').innerHTML = tasksHtml;
}

function getTasksFromLS() {
    const tasks = [];
    //TODO foreach
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        tasks.push(JSON.parse(localStorage.getItem(key)));
    }
    return tasks;
}

function getTasksFromLSByDate(dayDate) {
    const tasks = [];
    //TODO foreach
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        const taskCandidate = JSON.parse(localStorage.getItem(key));
        if (taskCandidate.date === dayDate) {
            tasks.push(taskCandidate);
        }
    }
    return tasks;
}
