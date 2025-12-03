const STORAGE_KEY = "notes";

export default function NoteService() {
  // Get all notes
  const getNotes = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  };

  // Create a new note
  const createNote = ({ title, content, projectId }) => {
    const notes = getNotes();
    const note = {
      id: crypto.randomUUID(),
      title,
      content,
      projectId,
    };
    notes.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return note;
  };

  // Update a note by id
  const updateNote = (id, updates) => {
    const notes = getNotes();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) return null;
    notes[index] = { ...notes[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return notes[index];
  };

  // Delete a note by id
  const deleteNote = (id) => {
    const notes = getNotes().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return notes;
  };

  return {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}
