let taskNumber = 0;

(() => {
    loadData();
    document.getElementById("add-task").addEventListener('click', function () {
        addNewTask();
    });
    document.addEventListener('click', saveData);
})();

function addNewTask(title='', date='', time='', description='', isDone='') {
    const addNewTask = function () {
        taskNumber++;
        let taskId = "task_" + taskNumber;

        const template = document.querySelector('#task-template');
        const clonedTemplate = document.importNode(template.content, true);

        clonedTemplate.querySelector('.task').setAttribute('id', taskId);

        clonedTemplate.querySelector('.title').value = title;

        if (date !== ''){
            clonedTemplate.getElementById('date').value = date;
        }
        if (time !== ''){
            clonedTemplate.getElementById('time').value = time;
        }

        clonedTemplate.querySelector('.description').value = description;

        clonedTemplate.querySelector('.check').checked = isDone;

        clonedTemplate.getElementById("remove-task").addEventListener('click', function () {
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

        let taskToSave = {'title': task.getElementsByClassName('title')[0].value,
                          'description': task.getElementsByClassName('description')[0].value,
                          'date': task.getElementsByClassName('date')[0].value,
                          'time': task.getElementsByClassName('time')[0].value,
                          'isDone': task.getElementsByClassName('check')[0].checked};

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