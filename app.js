const form = document.getElementById('form');
const addButton = document.getElementById('addButton');
const inputField = document.getElementById('inputField');
const taskList = document.getElementById('taskList');
const clearAllButton = document.getElementById('clearAllButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');


const deleteTask = (event) => {
    const idToDelete = event.target.parentElement.id;
    
    let itemsArr = JSON.parse(localStorage.getItem("items"));
  
    // filter items to remove the one with the id we want to delete
    itemsArr = itemsArr.filter(algo => algo.id != idToDelete); // filter devuelve un nuevo array con los elementos que cumplen la condicion

    // items contiene todos los elementos menos el que queremos borrar

    // save the remaining items to local storage
    localStorage.setItem("items", JSON.stringify(itemsArr));

    // remove the task from the list
    const taskItem = document.getElementById(idToDelete);
    taskItem.remove();
    console.log(itemsArr);
}

const completeTask = (event) => {
    console.log(event.target)
    const idToComplete = event.target.parentElement.id; // tomamos el id del padre del img, que es un li

    document.getElementById(idToComplete).classList.toggle('checked');


    let items = JSON.parse(localStorage.getItem("items"));
    // find the index of the item we want to update
    const index = items.findIndex(item => item.id == idToComplete);
    // update the item
    items[index].checked = !items[index].checked; // if it's true, make it false, if it's false, make it true\
    // if (items[index].checked === true) {
    //     items[index].checked = false;
    // } else {
    //     items[index].checked = true;
    // }

    // save the updated items to local storage
    localStorage.setItem("items", JSON.stringify(items));

    console.log(items);

    // toggle completed class to the task item - esto es para darle el tachado
    const taskItem = document.getElementById(idToComplete).querySelector('.task-text');
    taskItem.classList.toggle('completed');
    // toggle checked image
    const checkbox = document.getElementById(idToComplete).querySelector('.checkbox');

    checkbox.src = checkbox.src.includes('unchecked') ? 'images/checked.png' : 'images/unchecked.png';

    // if (checkbox.src.includes('unchecked')) {
    //     checkbox.src = 'images/checked.png';
    // } else {
    //     checkbox.src = 'images/unchecked.png';
    // }

    // document.getElementById(idToComplete).classList.toggle('checked');
}


const addTaskToList = (task) => {
    const taskItem = document.createElement('li'); // <li class='taskItem'></li>
    taskItem.classList.add('taskItem');
    taskItem.setAttribute('id', task.id); // <li class='taskItem' id='123'></li>
    taskItem.innerHTML = `
        <img src='images/unchecked.png' class="checkbox"></img>
        <span class="task-text">${task.text}</span>
        <img src='images/trashcan.png' class="trashcan"></img>
    `;
    taskList.appendChild(taskItem);
    
    const checkbox = taskItem.querySelector('.checkbox');
    checkbox.addEventListener('click', completeTask);

    const trashcan = taskItem.querySelector('.trashcan');
    trashcan.addEventListener('click', deleteTask);

    if (task.checked) {
        taskItem.classList.add('checked');
        checkbox.src = 'images/checked.png';
        const taskText = taskItem.querySelector('.task-text');
        taskText.classList.add('completed');
    }
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
        id: id,
        checked: false,
        important: false
    };

    let itemsArr = [];
    if (localStorage.getItem("items")) {
        itemsArr = JSON.parse(localStorage.getItem("items"));
    }
    
    itemsArr.push(task);
    localStorage.setItem("items", JSON.stringify(itemsArr)); // 
    inputField.value = '';

    addTaskToList(task);

    // console.log(itemsArr);
}

if (localStorage.getItem("items")) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.forEach(cosa => {
        addTaskToList(cosa);
    });
}


addButton.addEventListener('click', addTask);

clearAllButton.addEventListener('click', () => {
    localStorage.clear();
    taskList.innerHTML = '';
})

//here comes the clear all completed tasks button and its functions

const clearCompletedTasks = () => { 
    const checkedTasks = document.querySelectorAll('.checked'); 
    checkedTasks.forEach(task => { 
        task.remove();
    })
}


clearCompletedButton.addEventListener('click', clearCompletedTasks); 

