// --- VARIABLES Y SELECTORES ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const countSpan = document.getElementById('count');

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', getTodos); // Cargar al iniciar
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', manageTask);

// --- FUNCIONES ---

// 1. Agregar Tarea
function addTask(e) {
    e.preventDefault(); // Evitar recarga de página

    const taskText = todoInput.value.trim();

    // Validación de campo vacío
    if (taskText === '') {
        errorMsg.classList.remove('hidden');
        return;
    } else {
        errorMsg.classList.add('hidden');
    }

    // Crear estructura HTML de la tarea
    createTaskElement(taskText, false);

    // Guardar en LocalStorage (PLUS)
    saveLocalTodos(taskText);

    // Limpiar input y actualizar contador
    todoInput.value = '';
    updateCount();
}

// 2. Manejar clicks en la lista (Delegación de eventos)
function manageTask(e) {
    const item = e.target;
    const todoElement = item.parentElement;

    // A. Eliminar tarea
    if (item.classList.contains('btn-delete')) {
        // Confirmación (PLUS)
        if(confirm("¿Seguro que quieres eliminar esta tarea?")) {
            todoElement.classList.add('fall'); // Animación opcional
            removeLocalTodos(todoElement);
            todoElement.remove();
            updateCount();
        }
    }

    // B. Marcar como completada
    if (item.classList.contains('btn-check') || item.tagName === 'SPAN') {
        // Ajuste para clicar en el texto o en el botón
        const parent = item.tagName === 'SPAN' ? item.parentElement : item.parentElement;
        parent.classList.toggle('completed');
        
        // Actualizar estado en LocalStorage sería más complejo, 
        // por simplicidad en este nivel solo guardamos texto, 
        // pero visualmente funciona.
        updateCount();
    }
}

// 3. Función auxiliar para crear el HTML
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (isCompleted) li.classList.add('completed');

    // Botón Check
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '✓';
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    // Texto
    const span = document.createElement('span');
    span.innerText = text;
    li.appendChild(span);

    // Botón Eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'X';
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
}

// 4. Actualizar contador
function updateCount() {
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    countSpan.innerText = pendingTasks;
}

// --- LOCAL STORAGE (Persistencia de datos) ---

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo) {
        createTaskElement(todo, false);
    });
    updateCount();
}

function removeLocalTodos(todoElement) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todoElement.children[1].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}