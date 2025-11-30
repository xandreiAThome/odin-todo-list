const STORAGE_KEY = "tasks";

export default function TaskService() {
  const getTasks = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  };

  /* Create */
  const addTask = (task) => {
    task.id = crypto.randomUUID();
    task.done = false;
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks;
  };

  /* Update */
  const updateTask = (id, updates) => {
    const tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks[index];
  };

  /* Delete */
  const deleteTask = (id) => {
    const tasks = getTasks().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks;
  };

  return {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}
