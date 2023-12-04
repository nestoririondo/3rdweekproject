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
    console.log(event.target)
    const idToComplete = event.target.parentElement.id;
    // toggle completed class to the task item
    const taskItem = document.getElementById(idToComplete).querySelector('span');
    taskItem.classList.toggle('completed');
    // toggle checked image
    const checkbox = document.getElementById(idToComplete).querySelector('img');
    checkbox.src = checkbox.src.includes('unchecked') ? 'images/checked.svg' : 'images/unchecked.svg';
}


const addTaskToList = (task) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('taskItem');
    taskItem.setAttribute('id', task.id);
    taskItem.innerHTML = `
        <img src='images/unchecked.svg' class="checkbox"></img>
        <span>${task.text}</span>
        <img src='images/trashcan.svg' class="trashcan"></img>
    `;
    taskList.appendChild(taskItem);
    
    const checkbox = taskItem.querySelector('.checkbox');
    checkbox.addEventListener('click', completeTask);

    const trashcan = taskItem.querySelector('.trashcan');
    trashcan.addEventListener('click', deleteTask);
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