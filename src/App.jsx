import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [tasks, folders]);

  // Ajouter une tâche dans le dossier sélectionné
  const addTask = () => {
    if (newTask.trim()) {
      if (selectedFolder !== null) {
        const updatedFolders = folders.map((folder, index) =>
          index === selectedFolder
            ? { ...folder, tasks: [...folder.tasks, newTask] }
            : folder
        );
        setFolders(updatedFolders);
      } else {
        setTasks([...tasks, { text: newTask, folder: null }]);
      }
      setNewTask('');
    }
  };

  // Ajouter un dossier
  const addFolder = () => {
    if (newFolder.trim()) {
      setFolders([...folders, { name: newFolder, subfolders: [], tasks: [] }]);
      setNewFolder('');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-yellow-50 via-white to-gray-100">
      <h1 className="text-4xl text-center mb-6 font-bold">Ma Todolist</h1>

      {/* Formulaire pour ajouter une tâche */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nouvelle tâche"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Ajouter
        </button>
      </div>

      {/* Tâches hors dossier */}
      <ul className="mb-6">
        {tasks.map((task, index) => (
          <li key={index} className="border-b p-2">
            {task.text}
          </li>
        ))}
      </ul>

      {/* Formulaire pour ajouter un dossier */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="Nouveau dossier"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addFolder}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des dossiers */}
      <div>
        <h2 className="text-2xl mb-2 font-bold">Dossiers</h2>
        <ul>
          {folders.map((folder, index) => (
            <li key={index} className="border-b p-2">
              <button
                onClick={() => setSelectedFolder(index)}
                className="text-left w-full hover:underline"
              >
                {folder.name}
              </button>
              {/* Afficher les tâches du dossier sélectionné */}
              {selectedFolder === index && (
                <ul className="ml-4 mt-2">
                  {folder.tasks.map((task, idx) => (
                    <li key={idx} className="border-b py-1">
                      {task}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
