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

    // Validación con animación SHAKE
    if (taskText === '') {
        todoInput.classList.add('shake');
        // Quitamos la clase después de que termine la animación para poder usarla de nuevo
        setTimeout(() => {
            todoInput.classList.remove('shake');
        }, 500);
        return;
    }

    createTaskElement(taskText, false);
    saveLocalTodos(taskText, false);

    todoInput.value = '';
    updateUI(); // Actualiza contador y estado vacío
}

function manageTask(e) {
    const item = e.target;
    // Usamos closest para detectar click en el botón o el icono dentro
    const btnDelete = item.closest('.btn-delete');
    const btnCheck = item.closest('.btn-check');
    const todoElement = item.closest('.todo-item');

    if (!todoElement) return;

    // A. ELIMINAR
    if (btnDelete) {
        if (confirm("¿Borrar esta Tareas?")) {
            todoElement.classList.add('fall');
            removeLocalTodos(todoElement);
            
            todoElement.addEventListener('animationend', function() {
                todoElement.remove();
                updateUI();
                // Forzar actualización del filtro
                const event = { target: filterOption };
                filterTodo(event);
            });
        }
    }

    // B. COMPLETAR
    if (btnCheck || item.tagName === 'SPAN') {
        todoElement.classList.toggle('completed');
        updateLocalTodoState(todoElement);
        updateUI();
        
        // Actualizar filtro dinámicamente
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

// Función centralizada para actualizar la interfaz (Contador + Estado Vacío)
function updateUI() {
    const totalTasks = todoList.children.length;
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    
    countSpan.innerText = pendingTasks;

    // Mostrar/Ocultar imagen de "Lista Vacía"
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

    // Botón Check con icono
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '<span class="material-icons-round">check</span>';
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    const span = document.createElement('span');
    span.innerText = text;
    li.appendChild(span);

    // Botón Delete con icono
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<span class="material-icons-round">delete</span>';
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    // Insertar arriba
    todoList.insertBefore(li, todoList.firstChild); 
}

// --- LOCAL STORAGE ---

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
    const todoText = todoElement.querySelector('span').innerText;
    // Quitamos solo el que coincide
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

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