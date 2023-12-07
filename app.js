const form = document.getElementById('form');
const addButton = document.getElementById('addButton');
const inputField = document.getElementById('inputField');
const taskList = document.getElementById('taskList');
const clearAllButton = document.getElementById('clearAllButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');
const toggleButton = document.getElementById('toggle-button');

const clickStar = (event) => {
    const idToStar = event.target.parentElement.id; // tomamos el id del padre del img, que es un li

    let items = JSON.parse(localStorage.getItem("items"));
    // find the index of the item we want to update
    const index = items.findIndex(item => item.id == idToStar);
    // update the item
    items[index].important = !items[index].important; // if it's true, make it false, if it's false, make it true\

    // save the updated items to local storage
    localStorage.setItem("items", JSON.stringify(items));

    // toggle icon
    const star = document.getElementById(idToStar).querySelector('.star');
    star.src = star.src.includes('starEmpty') ? 'images/starFull.png' : 'images/starEmpty.png';

    // toggle class
    star.classList.toggle('important'); // esto es para darle opacity 1 o 0.5
    star.parentElement.classList.toggle('important');

    // put li element with star on top of the list
    const taskItem = document.getElementById(idToStar);
    taskList.prepend(taskItem);

    const icons = star.parentElement.querySelectorAll('.icon');
    icons.forEach(icon => {
        if (!icon.classList.contains('important')) {
        icon.classList.remove('visible')
        }
    });

    // sort list items
    const childrenArray = Array.from(taskList.children);
    childrenArray.sort((a, b) => b.classList.contains('important') - a.classList.contains('important'));
    childrenArray.forEach(item => taskList.appendChild(item));
}


const editTask = (event) => {
    const spanToEdit = event.target.parentElement.children[1];
    const originalText = spanToEdit.innerHTML
    
    // toggle contenteditable
    if (spanToEdit.getAttribute('contenteditable') === 'true') {
        spanToEdit.setAttribute('contenteditable', false);
        event.target.src = event.target.src.includes('OK') ? 'images/edit.png' : 'images/editOK.png';

        // save new task text to local storage
        const newTaskText = spanToEdit.innerText;
        const idToModify = spanToEdit.parentElement.id;
        let itemsArr = JSON.parse(localStorage.getItem("items"));
        const index = itemsArr.findIndex(item => item.id == idToModify);
        itemsArr[index].text = newTaskText;
        localStorage.setItem("items", JSON.stringify(itemsArr));
    } else {
        spanToEdit.setAttribute('contenteditable', true);
        spanToEdit.focus();
        // select all text
        let range = document.createRange();
        range.selectNodeContents(spanToEdit);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        // end select all text

        event.target.src = event.target.src.includes('OK') ? 'images/edit.png' : 'images/editOK.png'; // toggle icon

        //press enter to save
        spanToEdit.addEventListener('keydown', (event) => { 
            if (event.key === 'Enter') {
                event.preventDefault();
                spanToEdit.setAttribute('contenteditable', false);
                event.target.blur();

                // save new task text to local storage
                const newTaskText = spanToEdit.innerText;
                const idToModify = spanToEdit.parentElement.id;
                let itemsArr = JSON.parse(localStorage.getItem("items"));
                const index = itemsArr.findIndex(item => item.id == idToModify);
                itemsArr[index].text = newTaskText;
                localStorage.setItem("items", JSON.stringify(itemsArr));

                editIcon = event.target.parentElement.children[3];
                editIcon.src = 'images/edit.png' // toggle icon

            } else if (event.key === 'Escape') { // Escape brings back the original text, nothing is saved
                spanToEdit.innerText = originalText
                spanToEdit.setAttribute('contenteditable', false);
                event.target.blur();
                editIcon = event.target.parentElement.children[3];
                editIcon.src = 'images/edit.png' // toggle icon
            }
        });
    }
}

const deleteTask = (event) => {
    const idToDelete = event.target.parentElement.id;
    
    let itemsArr = JSON.parse(localStorage.getItem("items"));
  
    // filter items to remove the one with the id we want to delete
    itemsArr = itemsArr.filter(algo => algo.id != idToDelete); // filter devuelve un nuevo array con los elementos que cumplen la condicion

    // itemsArr contiene todos los elementos menos el que queremos borrar

    // save the remaining items to local storage
    localStorage.setItem("items", JSON.stringify(itemsArr));

    // remove the task from the list
    const taskItem = document.getElementById(idToDelete);
    taskItem.remove();
}

const completeTask = (event) => {
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

    // toggle completed class to the task item - esto es para darle el tachado
    const taskItem = document.getElementById(idToComplete).querySelector('.task-text');
    taskItem.classList.toggle('completed');
    // toggle checked image
    const checkbox = document.getElementById(idToComplete).querySelector('.checkbox');

    checkbox.src = checkbox.src.includes('unchecked') ? 'images/checked.png' : 'images/unchecked.png';
}

const addTaskToList = (task) => {
    const taskItem = document.createElement('li'); // <li class='taskItem'></li>
    taskItem.classList.add('taskItem');
    taskItem.setAttribute('id', task.id); // <li class='taskItem' id='123'></li>
    taskItem.innerHTML = `
        <img src='images/unchecked.png' class="checkbox"></img>
        <span class="task-text">${task.text}</span>
        <img src='images/starEmpty.png' class="star icon"></img>
        <img src='images/edit.png' class="edit icon"></img>
        <img src='images/trashcan.png' class="trashcan icon"></img>
    `;
    taskList.appendChild(taskItem);
    
    const checkbox = taskItem.querySelector('.checkbox');
    checkbox.addEventListener('click', completeTask);

    const edit = taskItem.querySelector('.edit');
    edit.addEventListener('click', editTask);

    const star = taskItem.querySelector('.star');
    star.addEventListener('click', clickStar);

    const trashcan = taskItem.querySelector('.trashcan');
    trashcan.addEventListener('click', deleteTask);

    taskItem.addEventListener('mousemove', () => {
        edit.classList.add('visible');
        trashcan.classList.add('visible');
        star.classList.add('visible');
    });
    taskItem.addEventListener('mouseout', () => {
        edit.classList.remove('visible');
        trashcan.classList.remove('visible');
        if (!star.classList.contains('important')) {
            star.classList.remove('visible');
        }
    })

    // render checked and important tasks
    if (task.checked) {
        taskItem.classList.add('checked');
        checkbox.src = 'images/checked.png';
        const taskText = taskItem.querySelector('.task-text');
        taskText.classList.add('completed');
    }

    if (task.important) {
        star.src = 'images/starFull.png';
        star.classList.add('important');
        star.classList.add('visible');
        star.parentElement.classList.add('important');
        taskList.prepend(taskItem); 
    }


}


const addTask = (event) => {
    event.preventDefault();
    inputField.parentElement.children[1].classList.remove('visible');

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

    let itemsArr = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
    
    itemsArr.push(task);
    localStorage.setItem("items", JSON.stringify(itemsArr)); // 
    inputField.value = '';

    addTaskToList(task);
}

const clearCompletedTasks = () => {
    toggleButton.parentElement.children[1].classList.toggle('active');
    const checkedTasks = document.querySelectorAll('.checked');
    //iterate over each selected element: 
    let itemsArr = JSON.parse(localStorage.getItem("items")); //"items" is the key for local storage
    itemsArr = itemsArr.filter(item => item.checked === false); //filter items to remove the one with the id we want to delete
    localStorage.setItem("items", JSON.stringify(itemsArr)); //save the remaining items to local storage
    checkedTasks.forEach(task => task.remove());
};

// render tasks from local storage

if (localStorage.getItem("items")) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.forEach(cosa => {
        addTaskToList(cosa);
    });
}

// event listeners

clearAllButton.addEventListener('click', () => {
    localStorage.clear();
    taskList.innerHTML = '';
    toggleButton.parentElement.children[1].classList.toggle('active');
});

clearCompletedButton.addEventListener('click', () => { 
    clearCompletedTasks();
})

toggleButton.addEventListener('click', () => {
    toggleButton.parentElement.children[1].classList.toggle('active');
});

addButton.addEventListener('click', addTask)

inputField.addEventListener('keydown', () => {
    inputField.parentElement.children[1].classList.add('visible');
})