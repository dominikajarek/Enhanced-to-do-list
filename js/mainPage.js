let taskNumber = 0;

(() => {
    document.getElementById("add-task").addEventListener('click', function () {
        addNewTask();
    });
})();

function addNewTask() {
    const addNewTask = function () {
        taskNumber++;
        let taskId = "task_" + taskNumber;

        const template = document.querySelector('#task-template');
        const clonedTemplate = document.importNode(template.content, true);

        clonedTemplate.querySelector('.task').setAttribute('id', taskId);

        clonedTemplate.getElementById("remove-task").addEventListener('click', function () {
            this.parentElement.remove();
        })

        return clonedTemplate;
    }

    const newTask = addNewTask();
    document.getElementById("tasks").appendChild(newTask);
}