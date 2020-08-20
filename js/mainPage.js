let taskNumber = 0;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

(() => {
    loadData();
    checkAdditionalWindows();
    document.getElementById("add-task").addEventListener('click', function () {
        addNewTask();
    });
    document.getElementById("search-task").addEventListener('click', function () {
        searchForTask();
    });
    document.addEventListener('click', saveData);
})();

function addNewTask(title='Title', date='', time='', description='', isDone='') {
    const addNewTask = function () {
        taskNumber++;

        //make clone of task template
        const template = document.querySelector('#task-template');
        const clonedTemplate = document.importNode(template.content, true);

        //set main task div 'id'
        clonedTemplate.querySelector('.task').setAttribute('id', "task_" + taskNumber);

        //set title value
        clonedTemplate.querySelector('.title').innerHTML = title;

        //date div settings (add div 'id', description 'id', label 'for' and date value)
        clonedTemplate.querySelector('.date').setAttribute('id', "date_task_" + taskNumber);
        clonedTemplate.querySelector('.dateLabel').setAttribute('for', "date_task_" + taskNumber);
        if (date !== ''){
            clonedTemplate.querySelector('.date').value = date;
        }

        //time div settings (add div 'id', description 'id', label 'for' and time value)
        clonedTemplate.querySelector('.task-time').setAttribute('id', "time_div_task_" + taskNumber);
        clonedTemplate.querySelector('.time').setAttribute('id', "time_task_" + taskNumber);
        clonedTemplate.querySelector('.timeLabel').setAttribute('for', "time_task_" + taskNumber);
        if (time !== ''){
            clonedTemplate.querySelector('.time').value = time;
        }

        //description div settings (add div 'id', description 'id', label 'for' and description value)
        clonedTemplate.querySelector('.task-description').setAttribute('id', "description_div_task_" + taskNumber);
        clonedTemplate.querySelector('.description').setAttribute('id', "description_task_" + taskNumber);
        clonedTemplate.querySelector('.descriptionLabel').setAttribute('for', "description_task_" + taskNumber);
        clonedTemplate.querySelector('.mic-button').setAttribute('button', 'button_' + taskNumber);
        clonedTemplate.querySelector('.description').value = description;

        //set checkbox 'id', it's label 'for' and checked value
        clonedTemplate.querySelector('.checkbox').setAttribute('id', "checkbox_task_" + taskNumber);
        clonedTemplate.querySelector('.checkboxLabel').setAttribute('for', "checkbox_task_" + taskNumber);
        clonedTemplate.querySelector('.checkbox').checked = isDone;

        //add eventListener to button removing task
        clonedTemplate.querySelector('.remove-task-button').addEventListener('click', function () {
            localStorage.removeItem(this.parentElement.id);
            this.parentElement.remove();
        })

        enableSpeechRecognition(clonedTemplate);

        return clonedTemplate;
    }

    const newTask = addNewTask();
    document.getElementById("tasks").appendChild(newTask);
}

function saveData() {
    //make list of tasks
    let taskList = document.getElementsByClassName('task');
    for (let index = 0; index < taskList.length; index++){
        let task = taskList[index];
        let key = task.id;

        //set description value
        let descriptionValue;
        // (when description is empty, it changes to button so then it's undefined)
        if (task.getElementsByClassName('description')[0] === undefined) {
            descriptionValue = '';
        } else {
            descriptionValue = task.getElementsByClassName('description')[0].value;
        }

        //set time value
        let timeValue;
        // (when time is empty, it changes to button so then it's undefined)
        if (task.getElementsByClassName('time')[0] === undefined) {
            timeValue = '';
        } else {
            timeValue = task.getElementsByClassName('time')[0].value;
        }

        //set rest of values (title, date, isDone status)
        let titleValue = task.getElementsByClassName('title')[0].textContent;
        let dateValue = task.getElementsByClassName('date')[0].value;
        let isDoneValue = task.getElementsByClassName('checkbox')[0].checked;

        let taskToSave = {'title': titleValue,
                          'description': descriptionValue,
                          'date': dateValue,
                          'time': timeValue,
                          'isDone': isDoneValue};

        localStorage.setItem(key, JSON.stringify(taskToSave));
    }
}

function loadData() {
    for (let index = 0; index < localStorage.length; index++) {
        let key = localStorage.key(index);
        if (key.includes('task')) {
            let taskInfo = JSON.parse(localStorage.getItem(key));
            let title = taskInfo.title;
            let date = taskInfo.date;
            let time = taskInfo.time;
            let description = taskInfo.description;
            let isDone = taskInfo.isDone;

            addNewTask(title, date, time, description, isDone);
        }
    }
}

function checkAdditionalWindows() {
    //set list of tasks
    let taskList = document.getElementsByClassName('task');
    for (let index = 0; index < taskList.length; index++) {
        let task = taskList[index];

        //set field for normal display of time box
        task.normalTime = task.querySelector('.task-time');
        //set field for hidden time box button
        task.hiddenTime = document.createElement('BUTTON');
        task.hiddenTime.setAttribute('id', "hidden_" + task.normalTime.id);
        task.hiddenTime.innerText = '-';
        task.hiddenTime.addEventListener('click', function () {
            //while click on button, it will display normal form of time box
            // ("hidden_" added for compare possibility)
            if (task.hiddenTime.id === "hidden_" + task.normalTime.id){
                task.hiddenTime.replaceWith(task.normalTime);
            }
        });

        //if time box is empty it changes to button
        if (task.normalTime.querySelector('.time').value === ''){
            task.normalTime.replaceWith(task.hiddenTime);
        }

        //set field for normal display of description box
        task.normalDescription = task.querySelector('.task-description');
        //set field for hidden description box button
        task.hiddenDescription = document.createElement('BUTTON');
        task.hiddenDescription.setAttribute('id', "hidden_" + task.normalDescription.id);
        task.hiddenDescription.innerText = '-';
        task.hiddenDescription.addEventListener('click', function () {
            //while click on button, it will display normal form of description box
            // ("hidden_" added for compare possibility)
            if (task.hiddenDescription.id === "hidden_" + task.normalDescription.id){
                task.hiddenDescription.replaceWith(task.normalDescription);
            }
        });

        //if description box is empty it changes to button
        if (task.normalDescription.querySelector('.description').value === '') {
            task.normalDescription.replaceWith(task.hiddenDescription);
        }
    }
}

function enableSpeechRecognition(clonedTemplate) {
    let content;

    if (SpeechRecognition) {
        console.log('Your browser supports speech recognition');

        const microphoneButton = clonedTemplate.querySelector('.mic-button');
        const microphoneIcon = clonedTemplate.querySelector('i');
        const recognition = new SpeechRecognition();

        microphoneButton.addEventListener('click', microphoneActivation, true);

        function microphoneActivation() {
            content = this.parentElement.querySelector('.description');
            microphoneIcon.classList.contains('fa-microphone') ? recognition.start() : recognition.stop();
        }

        recognition.addEventListener('start', startRecognition);
        function startRecognition() {
            microphoneIcon.classList.remove('fa-microphone');
            microphoneIcon.classList.add('fa-microphone-slash');
            console.log('Speech recognition active');
        }

        recognition.addEventListener('end', endRecognition);
        function endRecognition() {
            microphoneIcon.classList.remove('fa-microphone-slash');
            microphoneIcon.classList.add('fa-microphone');
            console.log('Speech recognition inactive');
        }

        recognition.addEventListener('result', resultOfSpeechRecognition)
        function resultOfSpeechRecognition(event) {
            const transcript = event.results[event.resultIndex][0].transcript;
            if (!!content) {
                content.value = transcript;
            }
        }
    } else {
        console.log('Unfortunately, your browser doesn\'t support speech recognition');
    }
}

function searchForTask() {
    let searchBox = document.createElement("INPUT");
    searchBox.setAttribute('id', 'search-box');
    searchBox.setAttribute('type', 'text');
    searchBox.setAttribute('placeholder', 'title/yyyy-mm-dd');

    let searchOffButton = document.getElementById("search-task-off");

    searchOffButton.addEventListener('click', function () {
        document.getElementById("buttons").removeChild(document.getElementById('search-box'));
        searchOffButton.style.display = 'none';
        let tasksToShow = document.getElementById("tasks").childNodes;
        for (let index = 0; index < tasks.length; index++) {
            let taskToShow = tasksToShow[index];
            if (taskToShow.tagName === "DIV") {
                taskToShow.style.display = 'block';
            }
        }
    })

    let tasks = document.getElementById("tasks").childNodes;
    for (let index = 0; index < tasks.length; index++) {
        let taskToHide = tasks[index];
        if (taskToHide.tagName === "DIV") {
            taskToHide.style.display = 'none';
        }
    }

    if (!document.getElementById('search-box')) {
        document.getElementById("buttons").appendChild(searchBox);
        searchOffButton.style.display = 'block';
    }

    let searchPhrase = document.getElementById('search-box').value;

    let taskList = document.getElementsByClassName('task');
    for (let index = 0; index < taskList.length; index++) {
        let task = taskList[index];
        if (task.querySelector('.title').textContent.includes(searchPhrase)){
            task.style.display = 'block';
        }
        console.log(task.querySelector('.date').value);
        if (task.querySelector('.date').value.includes(searchPhrase)){
            task.style.display = 'block';
        }
    }
}
