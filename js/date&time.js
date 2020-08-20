const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const startYear = 1990;
const endYear = 2020;
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
    createTasksList();
});

function showTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let session = "AM";

    if (h === 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;

    let time = h + ":" + m + " " + session;
    document.getElementById("clock").textContent = time;
    document.getElementById("clock").textContent = time;

    setTimeout(showTime, 1000);
}
showTime();

function daysInMonth(month, year) {
    let d = new Date(year, month+1, 0);
    return d.getDate();
}


function loadCalendarMonths() {
    for (let i = 0; i < months.length; i++) {
        let loadedMonth = document.createElement("div");
        loadedMonth.innerHTML = months[i];
        loadedMonth.classList.add("dropdown-item");
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


function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (let i = startYear; i <= endYear; i++) {
        let loadedYear = document.createElement("div");
        loadedYear.innerHTML = i;
        loadedYear.classList.add("dropdown-item");
        loadedYear.onclick = (function () {
            let selectedYear = i;
            return function () {
                year = selectedYear;
                document.getElementById("currentYear").innerHTML = year;
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

        day.addEventListener('click', function(){
            this.classList.toggle('selected');
            if (!selectedDays.includes(this.dataset.day)) {
                selectedDays.push(this.dataset.day);
            } else
                selectedDays.splice(selectedDays.indexOf(this.dataset.day), 1);
        });

        day.addEventListener('mousemove', function(e){
            e.preventDefault();
            if (mousedown) {
                this.classList.add('selected');
            }
                if (!selectedDays.includes(this.dataset.day)) {
                    selectedDays.push(this.dataset.day);
            }
        });

        day.addEventListener('mousedown', function(e) {
            e.preventDefault();
            mousedown = true;
        });

        day.addEventListener('mouseup', function(e) {
            e.preventDefault();
            mousedown = false;
        });
        document.getElementById("calendarDays").appendChild(day);
    }
    let clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}


function createTasksList() {
    let numberOfDays = daysInMonth(month, year);
    for (let i = 0; i < numberOfDays; i++) {
        let temp = i + 1;
        let dayTask = document.createElement("div");
        dayTask.classList.add("dropdown");
        dayTask.id = "taskDay_" + temp;
        dayTask.className = "taskDay";
        document.getElementById("daysTask").appendChild(dayTask);
    }
}

function loadTaskList() {
    let list = document.querySelector("[id*='taskDay']");
}
