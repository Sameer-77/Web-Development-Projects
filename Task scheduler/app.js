let tasks = [];
const notificationSound = new Audio('notification.mp3'); // Path to the notification sound file

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (text && deadline) {
        tasks.push({ text: text, completed: false, deadline: new Date(deadline) });
        taskInput.value = ''; // Clear input after adding task
        deadlineInput.value = ''; // Clear deadline input after adding task
        updateTaskList();
    }
};

const updateTaskList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = "taskItem";

        listItem.innerHTML = `
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ''} onchange="toggleTaskComplete(${index})" />
                <p>${task.text}</p>
                <p class="deadline">Deadline: ${task.deadline.toLocaleString()}</p>
            </div>
            <div class="icons">
                <img src="./imgs/edit.png" alt="Edit" onclick="editTask(${index})" />
                <img src="./imgs/delete.png" alt="Delete" onclick="deleteTask(${index})" />
            </div>
        `;

        taskList.appendChild(listItem);
    });

    updateStats();
    checkDeadlines();
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
};

const editTask = (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        updateTaskList();
    }
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
};

const clearAllTasks = () => {
    tasks = [];
    updateTaskList();
};

const updateStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    document.getElementById("num").textContent = `${completedTasks}/${totalTasks}`;
    document.getElementById("progress").style.width = `${progress}%`;

    const boomMessage = document.getElementById("boom");
    if (progress === 100) {
        boomMessage.classList.remove("hidden");
        boomMessage.classList.add("visible");
        setTimeout(() => {
            if (confirm("All tasks completed, do you want to clear all?")) {
                clearAllTasks();
            }
        }, 500); // Delay to let the boom message appear
    } else {
        boomMessage.classList.remove("visible");
        boomMessage.classList.add("hidden");
    }
};

const checkDeadlines = () => {
    const now = new Date();
    tasks.forEach(task => {
        const timeLeft = task.deadline - now;
        if (!task.completed && timeLeft <= 5 * 60 * 1000 && timeLeft > 0) { // 5 minutes before deadline
            notificationSound.play(); // Play notification sound
            alert(`Task "${task.text}" is near its deadline!`);
        }
    });
};

document.getElementById("newTask").addEventListener("click", function(event) {
    event.preventDefault();
    addTask();
});

setInterval(checkDeadlines, 60000); // Check deadlines every minute

updateTaskList();
