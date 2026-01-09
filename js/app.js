// --- SELECTORES ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const countSpan = document.getElementById('count');
const filterOption = document.querySelector('.filter-todo');
const emptyState = document.getElementById('empty-state');

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', getTodos);
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', manageTask);
filterOption.addEventListener('change', filterTodo);

// --- FUNCIONES ---

function addTask(e) {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText === '') {
        todoInput.classList.add('shake');
        setTimeout(() => {
            todoInput.classList.remove('shake');
        }, 500);
        return;
    }

    createTaskElement(taskText, false);
    saveLocalTodos(taskText, false);

    todoInput.value = '';
    updateUI();
}

function manageTask(e) {
    const item = e.target;
    // Detectar clicks
    const btnDelete = item.closest('.btn-delete');
    const btnCheck = item.closest('.btn-check');
    const todoElement = item.closest('.todo-item');

    if (!todoElement) return;

    // A. ELIMINAR
    if (btnDelete) {
        if (confirm("¿Borrar esta misión?")) {
            todoElement.classList.add('fall');
            
            // ELIMINAR DEL LOCALSTORAGE (Antes de borrar del HTML)
            removeLocalTodos(todoElement);
            
            todoElement.addEventListener('animationend', function() {
                todoElement.remove();
                updateUI();
                const event = { target: filterOption };
                filterTodo(event);
            });
        }
    }

    // B. COMPLETAR
    // Cambiamos item.tagName === 'SPAN' a verificar la clase especifica
    if (btnCheck || item.classList.contains('todo-text')) {
        todoElement.classList.toggle('completed');
        updateLocalTodoState(todoElement);
        updateUI();
        const event = { target: filterOption };
        filterTodo(event);
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    const filterValue = e.target ? e.target.value : filterOption.value;

    todos.forEach(function(todo) {
        if (todo.nodeType === 1) {
            switch (filterValue) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains('completed')) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (!todo.classList.contains('completed')) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        }
    });
}

function updateUI() {
    const totalTasks = todoList.children.length;
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    countSpan.innerText = pendingTasks;

    if (totalTasks === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (isCompleted) li.classList.add('completed');

    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '<span class="material-icons-round">check</span>';
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    const span = document.createElement('span');
    span.innerText = text;
    // AGREGAMOS ESTA CLASE PARA IDENTIFICAR EL TEXTO CORRECTAMENTE
    span.classList.add('todo-text'); 
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<span class="material-icons-round">delete</span>';
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    todoList.insertBefore(li, todoList.firstChild); 
}

// --- LOCAL STORAGE CORREGIDO ---

function checkLocalStorage() {
    return localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
}

function saveLocalTodos(todoText, isCompleted) {
    let todos = checkLocalStorage();
    todos.push({ text: todoText, completed: isCompleted });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = checkLocalStorage();
    todos.slice().reverse().forEach(function(todoObj) {
        createTaskElement(todoObj.text, todoObj.completed);
    });
    updateUI();
}

function removeLocalTodos(todoElement) {
    let todos = checkLocalStorage();
    
    // CORRECCIÓN CRÍTICA: Buscar el elemento por la clase .todo-text
    // Antes buscaba 'span' y encontraba el icono del check primero
    const todoText = todoElement.querySelector('.todo-text').innerText;
    
    // Filtrar la tarea correcta
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function updateLocalTodoState(todoElement) {
    let todos = checkLocalStorage();
    
    // CORRECCIÓN: Usar .todo-text aquí también
    const todoText = todoElement.querySelector('.todo-text').innerText;
    const isCompleted = todoElement.classList.contains('completed');
    
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex > -1) {
        todos[todoIndex].completed = isCompleted;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}