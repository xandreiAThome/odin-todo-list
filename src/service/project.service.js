export default function ProjectService() {
  const STORAGE_KEY = "projects";

  const generateId = () => {
    return crypto.randomUUID();
  };

  const getProjects = () => {
    const projects = localStorage.getItem(STORAGE_KEY);
    if (!projects) {
      // Create default project if none exist
      const defaultProject = {
        id: generateId(),
        name: "General",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultProject]));
      return [defaultProject];
    }
    return JSON.parse(projects);
  };

  const addProject = (name) => {
    const projects = getProjects();
    const newProject = {
      id: generateId(),
      name,
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  };

  const deleteProject = (id) => {
    const projects = getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  const updateProject = (id, updates) => {
    const projects = getProjects();
    const project = projects.find((p) => p.id === id);
    if (project) {
      Object.assign(project, updates);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
    return project;
  };

  return {
    getProjects,
    addProject,
    deleteProject,
    updateProject,
  };
}
