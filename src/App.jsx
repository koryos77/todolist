import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [folders, setFolders] = useState(() => JSON.parse(localStorage.getItem('folders')) || []);
  const [newTask, setNewTask] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Sauvegarder dans localStorage à chaque mise à jour
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
            ? { ...folder, tasks: [...folder.tasks, { text: newTask, completed: false }] }
            : folder
        );
        setFolders(updatedFolders);
      } else {
        setTasks([...tasks, { text: newTask, completed: false }]);
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

  // Supprimer une tâche
  const deleteTask = (taskIndex, isFolderTask = false, folderIndex) => {
    if (isFolderTask) {
      const updatedFolders = folders.map((folder, index) =>
        index === folderIndex
          ? { ...folder, tasks: folder.tasks.filter((_, i) => i !== taskIndex) }
          : folder
      );
      setFolders(updatedFolders);
    } else {
      setTasks(tasks.filter((_, index) => index !== taskIndex));
    }
  };

  // Supprimer un dossier
  const deleteFolder = (folderIndex) => {
    setFolders(folders.filter((_, index) => index !== folderIndex));
    if (selectedFolder === folderIndex) {
      setSelectedFolder(null);
    }
  };

  // Marquer une tâche comme effectuée
  const toggleTaskCompletion = (taskIndex, isFolderTask = false, folderIndex) => {
    if (isFolderTask) {
      const updatedFolders = folders.map((folder, index) =>
        index === folderIndex
          ? {
              ...folder,
              tasks: folder.tasks.map((task, i) =>
                i === taskIndex ? { ...task, completed: !task.completed } : task
              ),
            }
          : folder
      );
      setFolders(updatedFolders);
    } else {
      const updatedTasks = tasks.map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="notebook-container">
        <h1 className="text-4xl text-center mb-6 font-bold text-[#8b5e3c]">Ma Todolist</h1>

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
            className="bg-[#8b5e3c] text-white p-2 rounded hover:bg-[#6b4e31]"
          >
            Ajouter
          </button>
        </div>

        {/* Tâches hors dossier */}
        <ul className="mb-6">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b p-2"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                  className="mr-2"
                />
                <span
                  className={`text-lg ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(index)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
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
            className="bg-[#8b5e3c] text-white p-2 rounded hover:bg-[#6b4e31]"
          >
            Ajouter
          </button>
        </div>

        {/* Liste des dossiers */}
        <div>
          <h2 className="text-2xl mb-2 font-bold text-[#8b5e3c]">Dossiers</h2>
          <ul>
            {folders.map((folder, index) => (
              <li key={index} className="border-b p-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedFolder(index)}
                    className="text-left w-full hover:underline text-lg"
                  >
                    {folder.name}
                  </button>
                  <button
                    onClick={() => deleteFolder(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
                {/* Afficher les tâches du dossier sélectionné */}
                {selectedFolder === index && (
                  <ul className="ml-4 mt-2">
                    {folder.tasks.map((task, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between border-b py-1"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              toggleTaskCompletion(idx, true, index)
                            }
                            className="mr-2"
                          />
                          <span
                            className={`text-lg ${
                              task.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(idx, true, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;