const form = document.getElementById('form');
const addButton = document.getElementById('addButton');
const inputField = document.getElementById('inputField');
const taskList = document.getElementById('taskList');
const clearAllButton = document.getElementById('clearAllButton');


const deleteTask = (event) => {
    const idToDelete = event.target.parentElement.id;
    let items = JSON.parse(localStorage.getItem("items"));
    console.log
    // filter items to remove the one with the id we want to delete
    items = items.filter(item => item.id != idToDelete);
    // save the remaining items to local storage
    localStorage.setItem("items", JSON.stringify(items));
    // remove the task from the list
    const taskItem = document.getElementById(idToDelete);
    taskItem.remove();
    console.log(items);
}

completeTask = (event) => {
    const idToComplete = event.target.parentElement.id;
    let items = JSON.parse(localStorage.getItem("items"));
    // toggle completed class to the task item
    const taskItem = document.getElementById(idToComplete).querySelector('span');
    taskItem.classList.toggle('completed');
}


const addTaskToList = (task) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('taskItem');
    taskItem.setAttribute('id', task.id);
    taskItem.innerHTML = `
        <input type="checkbox" class="checkbox">
        <span>${task.text}</span>
        <button class="deleteButton">Delete</button>
    `;
    taskList.appendChild(taskItem);
    const deleteButton = taskItem.querySelector('.deleteButton');
    deleteButton.addEventListener('click', deleteTask);
    const checkbox = taskItem.querySelector('.checkbox');
    checkbox.addEventListener('change', completeTask);
}

const addTask = (event) => {
    event.preventDefault();
    const taskText = inputField.value;
    if (taskText.trim() === '') {
        return;
    }
    const id = Math.floor(Math.random() * Date.now());

    const task = {
        text: taskText,
        id: id
    };
    let items = [];
    if (localStorage.getItem("items")) {
        items = JSON.parse(localStorage.getItem("items"));
    }
    items.push(task);
    localStorage.setItem("items", JSON.stringify(items));
    inputField.value = '';

    addTaskToList(task);

    console.log(items);
}

if (localStorage.getItem("items")) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.forEach(item => {
        addTaskToList(item);
    });
}


addButton.addEventListener('click', addTask);
clearAllButton.addEventListener('click', () => {
    localStorage.clear();
    taskList.innerHTML = '';
})