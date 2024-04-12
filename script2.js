document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.form');
    const select = document.querySelector('.select');
    const taskList = document.querySelector('.task-list');
    const completedList = document.querySelector('.completed-list');
    
    // Load tasks from local storage when the page loads
    loadTasks();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const titleInput = document.querySelector('.small');
        const descriptionInput = document.querySelector('.big');

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const date = new Date().toLocaleString();

        if (title !== '' && description !== '') {
            const listItem = document.createElement('tr');
            listItem.innerHTML = `
                <td>${title}</td>
                <td>${description}</td>
                <td><input type="checkbox" class="complete-checkbox"></td>
                <td><button class="delete-btn">Delete</button></td>
            `;

            taskList.appendChild(listItem);

            titleInput.value = '';
            descriptionInput.value = '';

            // Save tasks to local storage
            saveTasks();
        } else {
            alert('Please fill in both title and description.');
        }
    });

    select.addEventListener('change', function() {
        const selectedValue = select.value;
        const allTasks = document.querySelectorAll('.task-list tr');
        const completedTasks = document.querySelectorAll('.completed-list tr');

        switch(selectedValue) {
            case 'all':
                allTasks.forEach(task => task.style.display = 'table-row');
                completedTasks.forEach(task => task.style.display = 'table-row');
                break;
            case 'completed':
                allTasks.forEach(task => {
                    if (task.querySelector('.complete-checkbox').checked) {
                        task.style.display = 'table-row';
                    } else {
                        task.style.display = 'none';
                    }
                });
                completedTasks.forEach(task => task.style.display = 'table-row');
                break;
            case 'incompleted':
                allTasks.forEach(task => {
                    if (!task.querySelector('.complete-checkbox').checked) {
                        task.style.display = 'table-row';
                    } else {
                        task.style.display = 'none';
                    }
                });
                completedTasks.forEach(task => task.style.display = 'none');
                break;
            default:
                allTasks.forEach(task => task.style.display = 'table-row');
                completedTasks.forEach(task => task.style.display = 'none');
                break;
        }
    });

    taskList.addEventListener('change', function(event) {
        if (event.target.classList.contains('complete-checkbox')) {
            const row = event.target.parentElement.parentElement;
            const newRow = document.createElement('tr');
            newRow.innerHTML = row.innerHTML;
            newRow.querySelector('.complete-checkbox').setAttribute('disabled', true);
            newRow.querySelector('.delete-btn').remove();
            completedList.appendChild(newRow);
            row.remove();

            // Save tasks to local storage
            saveTasks();
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            event.target.parentElement.parentElement.remove();

            // Save tasks to local storage
            saveTasks();
        }
    });

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('tr').forEach(task => {
            const title = task.querySelector('td:nth-child(1)').textContent;
            const description = task.querySelector('td:nth-child(2)').textContent;
            const completed = task.querySelector('.complete-checkbox').checked;
            tasks.push({ title, description, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                const listItem = document.createElement('tr');
                listItem.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td><input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} ${task.completed ? 'disabled' : ''}></td>
                    <td><button class="delete-btn">Delete</button></td>
                `;
                if (task.completed) {
                    completedList.appendChild(listItem);
                } else {
                    taskList.appendChild(listItem);
                }
            });
        }
    }
});
