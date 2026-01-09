#  To-Do List Pro (Gestor de Tareas)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Una aplicación web interactiva y moderna para gestionar tareas diarias. Este proyecto fue desarrollado utilizando **JavaScript Vanilla (sin frameworks)** para demostrar el dominio de la manipulación del DOM, lógica de programación y persistencia de datos.

---

##  Características Principales

Esta aplicación no es solo una lista estática, incluye funcionalidades avanzadas de interfaz y experiencia de usuario (UI/UX):

###  Funcionalidades
- **Gestión CRUD:** Crear, Leer, Actualizar (marcar como completada) y Eliminar tareas.
- **Persistencia de Datos:** Uso de `localStorage` para que las tareas no se pierdan al recargar la página.
- **Filtros Dinámicos:** Visualiza tus tareas por estado: *Todas*, *Completadas* o *Pendientes*.
- **Validación Inteligente:** Detecta intentos de tareas vacías y avisa al usuario con una animación visual.
- **Seguridad:** Confirmación antes de eliminar permanentemente una tarea.

###  Diseño y Experiencia (UI/UX)
- **Feedback Visual:** Colores semánticos (Amarillo para pendientes, Verde para completadas).
- **Animaciones CSS:**
  - Entrada suave de tareas (`slideIn`).
  - Efecto "Pop" al completar una tarea.
  - Efecto "Shake" (temblor) al intentar agregar una tarea vacía.
  - Salida animada al eliminar (`slideOut`).
- **Estado Vacío:** Muestra un diseño amigable cuando no hay tareas pendientes.
- **Responsive:** Adaptable a dispositivos móviles y escritorio.

---

##  Estructura del Proyecto

El código está organizado siguiendo buenas prácticas de separación de responsabilidades:

```text
todo-list/
│
├── index.html        # Estructura semántica y maquetación
├── css/
│   └── styles.css    # Estilos, variables CSS y animaciones
├── js/
│   └── app.js        # Lógica de negocio, DOM y LocalStorage
└── README.md         # Documentación del proyecto
