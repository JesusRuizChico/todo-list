// --- SELECTORES ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const countSpan = document.getElementById('count');
const filterOption = document.querySelector('.filter-todo');

// --- EVENT LISTENERS ---
// 1. Al cargar la página, recuperamos las tareas del LocalStorage
document.addEventListener('DOMContentLoaded', getTodos);
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', manageTask);
filterOption.addEventListener('change', filterTodo);

// --- FUNCIONES PRINCIPALES ---

function addTask(e) {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    // Validación
    if (taskText === '') {
        errorMsg.classList.remove('hidden');
        todoInput.focus();
        return;
    } else {
        errorMsg.classList.add('hidden');
    }

    // Crear visualmente
    createTaskElement(taskText, false);
    
    // GUARDAR EN LOCALSTORAGE
    saveLocalTodos(taskText, false);

    todoInput.value = '';
    updateCount();
}

function manageTask(e) {
    const item = e.target;
    const todoElement = item.closest('.todo-item'); 
    
    if (!todoElement) return;

    // A. Eliminar tarea con CONFIRMACIÓN
    if (item.classList.contains('btn-delete')) {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        
        if (confirmDelete) {
            todoElement.classList.add('fall');
            
            // BORRAR DEL LOCALSTORAGE
            removeLocalTodos(todoElement);

            todoElement.addEventListener('transitionend', function() {
                todoElement.remove();
                updateCount();
                // Actualizar filtro
                const event = { target: filterOption };
                filterTodo(event); 
            });
        }
    }

    // B. Marcar como completada
    if (item.classList.contains('btn-check') || item.tagName === 'SPAN') {
        todoElement.classList.toggle('completed');
        
        // ACTUALIZAR ESTADO EN LOCALSTORAGE
        updateLocalTodoState(todoElement);
        
        updateCount();
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

// Función auxiliar para crear HTML
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (isCompleted) li.classList.add('completed');

    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '✓';
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    const span = document.createElement('span');
    span.innerText = text;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕';
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    todoList.insertBefore(li, todoList.firstChild); 
}

function updateCount() {
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    countSpan.innerText = pendingTasks;
}

// --- FUNCIONES DE LOCALSTORAGE (PERSISTENCIA) ---

// 1. Revisar si ya hay cosas guardadas
function checkLocalStorage() {
    if (localStorage.getItem('todos') === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem('todos'));
    }
}

// 2. Guardar nueva tarea
function saveLocalTodos(todoText, isCompleted) {
    let todos = checkLocalStorage();
    todos.push({ text: todoText, completed: isCompleted });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 3. Leer tareas al cargar la página
function getTodos() {
    let todos = checkLocalStorage();
    // Invertimos el array para que al insertar se respete el orden visual
    todos.slice().reverse().forEach(function(todoObj) {
        createTaskElement(todoObj.text, todoObj.completed);
    });
    updateCount();
}

// 4. Borrar tarea de memoria
function removeLocalTodos(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    // Filtramos para quitar la que coincida
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

// 5. Actualizar si está completada o no en memoria
function updateLocalTodoState(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    const isCompleted = todoElement.classList.contains('completed');
    
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex > -1) {
        todos[todoIndex].completed = isCompleted;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}