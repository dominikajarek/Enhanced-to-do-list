let taskNumber = 0;

(() => {
    loadData();
    //checkAdditionalWindows();
    document.getElementById("add-task").addEventListener('click', function () {
        addNewTask();
    });
    document.addEventListener('click', saveData);
})();

function addNewTask(title='Title', date='', time='', description='', isDone='') {
    const addNewTask = function () {
        taskNumber++;
        let taskId = "task_" + taskNumber;

        const template = document.querySelector('#task-template');
        const clonedTemplate = document.importNode(template.content, true);

        clonedTemplate.querySelector('.task').setAttribute('id', taskId);

        clonedTemplate.querySelector('.title').innerHTML = title;

        clonedTemplate.querySelector('.date').setAttribute('id', "date_task_" + taskNumber);
        clonedTemplate.querySelector('.dateLabel').setAttribute('for', "date_task_" + taskNumber);
        if (date !== ''){
            clonedTemplate.querySelector('.date').value = date;
        }

        clonedTemplate.querySelector('.time').setAttribute('id', "time_task_" + taskNumber);
        clonedTemplate.querySelector('.timeLabel').setAttribute('for', "time_task_" + taskNumber);
        if (time !== ''){
            clonedTemplate.querySelector('.time').value = time;
        }

        clonedTemplate.querySelector('.description').setAttribute('id', "description_task_" + taskNumber);
        clonedTemplate.querySelector('.descriptionLabel').setAttribute('for', "description_task_" + taskNumber);
        clonedTemplate.querySelector('.description').value = description;

        clonedTemplate.querySelector('.checkbox').setAttribute('id', "checkbox_task_" + taskNumber);
        clonedTemplate.querySelector('.checkboxLabel').setAttribute('for', "checkbox_task_" + taskNumber);
        clonedTemplate.querySelector('.checkbox').checked = isDone;

        clonedTemplate.querySelector('.remove-task-button').addEventListener('click', function () {
            localStorage.removeItem(this.parentElement.id);
            this.parentElement.remove();
        })

        return clonedTemplate;
    }

    const newTask = addNewTask();
    document.getElementById("tasks").appendChild(newTask);
}

function saveData() {
    let taskList = document.getElementsByClassName('task');
    for (let index = 0; index < taskList.length; index++){
        let task = taskList[index];
        let key = task.id;

        let taskToSave = {'title': task.getElementsByClassName('title')[0].textContent,
                          'description': task.getElementsByClassName('description')[0].value,
                          'date': task.getElementsByClassName('date')[0].value,
                          'time': task.getElementsByClassName('time')[0].value,
                          'isDone': task.getElementsByClassName('checkbox')[0].checked};

        localStorage.setItem(key, JSON.stringify(taskToSave));
    }
}

function loadData() {
    for (let index = 0; index < localStorage.length; index++){
        let key = localStorage.key(index);
        if (key.includes('task')){
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
    let taskList = document.getElementsByClassName('task');
    for (let index = 0; index < taskList.length; index++) {
        let task = taskList[index];
        let taskNormalTime = task.querySelector('.task-time');
        let hiddenTime = document.createElement('BUTTON');
        console.log("taskTime = " + taskNormalTime.querySelector('.time').value);

        if (taskNormalTime.querySelector('.time').value === ''){
            hiddenTime.innerText = '-';
            hiddenTime.addEventListener('click', function () {
                hiddenTime.replaceWith(taskNormalTime);
            });

            document.querySelector('.task-time').replaceWith(hiddenTime);
        }
    }
}