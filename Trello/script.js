const addTaskModal = document.getElementById("addTaskModal");

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Setting up event litseners.");
    renderLists();

    const addColumnButton = document.getElementById("addColumn");
    if(addColumnButton){
        addColumnButton.addEventListener('click', addNewColumn)
    } else{
        console.error("Add Column button not found");
    }

    const saveTaskButton = document.getElementById('saveTask');
    if(saveTaskButton){
        saveTaskButton.addEventListener('click', saveTask);
    } else{
        console.error('Save Task Button not found');
    }

    const closeButton = document.querySelector('.close');
    if(closeButton){
        closeButton.addEventListener('click', function() {
            addTaskModal.style.display = 'none';
        });
    } else{
        console.error("Close button was not found");
    }
});

function saveTask(){
    let taskText = taskInput.value;
    if(currentEditingList !== null){
        editTask(currentEditingList, currentEditingIndex,taskText);
    } else{
        addNewTask(currentEditingIndex, taskText);
    }
    if(addTaskModal){
        addTaskModal.style.display = "none";
    }
    taskInput.value = "";
    currentEditingList = null;
    currentEditingIndex = null;
}

function editTask(listName, index, newText){
    lists[listName][index]["text"] = newText;
    renderLists();
}

let lists = {
    'To Do' : [{text:'Sample Task 1', isCompleted:true}, {text:'Sample Task 2', isCompleted:false}],
    'In Progress' : [],
    'Done' : []
}


function addNewColumn(){
    let columnName = prompt("Enter the name of the new column");
    if(columnName){
    if(!lists[columnName]){
        lists[columnName] = [];
        renderLists();
    }else{

    }
    }else{

    }
}

function renderLists(){
    board.innerHTML = '';
    for(let listName in lists){
        let listDiv = document.createElement('div');
        listDiv.className = 'list';
        listDiv.id = listName;

        let listTitle = document.createElement('div');
        listTitle.textContent = listName;
        listDiv.appendChild(listTitle);

        let addCardButton = document.createElement('button');
        addCardButton.textContent = "Add Card";
        addCardButton.addEventListener('click', () => addNewTask(listName));
        listDiv.appendChild(addCardButton);

        lists[listName].forEach((entry, index) => {
            let cardText = entry.text;
            let isCompleted = entry.isCompleted;
            let card = createCard(cardText, isCompleted, listName, index);
            if(entry.isCompleted){
                card.style.setProperty("text-decoration", "line-through");
            }
            listDiv.appendChild(card);
        });

        listDiv.ondragover = function(event){
            allowDrop(event);
        };

        listDiv.ondrop = function(event){
            drop(event);
        };

        board.appendChild(listDiv);
    }
}

function createCard(text, isCompleted, listName, index){
    let card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('isCompleted',isCompleted);
    card.draggable = true;
    card.id = 'card-' + listName + '-' + index;
    card.ondragstart = function(event)  {
        drag(event);
    };

    let cardText = document.createElement('span');
    cardText.textContent = text;
    card.appendChild(cardText);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = '';
    deleteButton.className = 'delete-task';
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTask(listName, index);
    });
    card.appendChild(deleteButton);

    let doneButton = document.createElement('button');
    doneButton.textContent = '';
    doneButton.className = 'close-task';
    doneButton.addEventListener('click', (event) => {
        event.stopPropagation();
        completeTask(listName, index);
    });
    card.appendChild(doneButton);
    

    card.addEventListener('click', () => {
        currentEditingList = listName;
        currentEditingIndex = index;
        taskInput.value = text;
        addTaskModal.style.display = "block";
    });

    if(isCompleted){
        card.style.textDecoration = "line-through";
    }
    return card;
}

function deleteTask(listName, index){
    lists[listName].splice(index, 1);
    renderLists();
}

function completeTask(listName, index){
    if(lists[listName][index].isCompleted === false){
        lists[listName][index].isCompleted = true;
        lists["Done"].push(lists[listName][index]);
        lists[listName].splice(index, 1)
    } else{
        lists[listName][index].isCompleted = false;
    }
    renderLists();
}

function addNewTask(listName){
    let taskText =  prompt("What is the new task?");
    if(taskText){
        lists[listName].push({text: taskText, isCompleted: false});
        renderLists();
    }
}
function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text/plain", [ev.target.id,ev.target.getAttribute('isCompleted')]);
}
  
function drop(ev) {
    ev.preventDefault();
    let [draggedCardId, isCompleted] = ev.dataTransfer.getData("text/plain").split(",");
    isCompleted = isCompleted == "true";
    const draggedCard = document.getElementById(draggedCardId);
    const dropZone = ev.target.closest('.list');

    if(dropZone && draggedCardId){
        const listName = dropZone.id;
        const cardText = draggedCard.textContent.trim();
        removeTaskFromCurrentList(draggedCardId);
        lists[listName].push({text: cardText, isCompleted: isCompleted});

        renderLists();
    }
}



function removeTaskFromCurrentList(cardId) {
    for (let listName in lists) {
        lists[listName] = lists[listName].filter((_, index) => 'card-' + listName + '-' + index !== cardId);
    }
    return 
}

