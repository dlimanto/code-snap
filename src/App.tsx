import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const [output, setOutput] = useState('');
  const isSelecting = useRef(false);

  const loadStoredData = () => {
    chrome.storage.local.get(['selectedHTML', 'selectedCSS'], (res) => {
      if (res.selectedHTML || res.selectedCSS) {
        setOutput(`HTML:\n${res.selectedHTML || ''}\n\nCSS:\n${res.selectedCSS || ''}`);
      }
    });
  };

  const selectElement = () => {
    isSelecting.current = true;

    chrome.runtime.sendMessage({ action: "startSelection" }, (response) => {
      if (response.status === "error") {
        console.error("Error: ", response.message);
        alert("An error occurred. Please try again.");
      } else {
        console.log("Hover selection mode enabled.");
      }
    });
  };

  useEffect(() => {
    const handleStorageChange = (changes: any, area: any) => {
      if (area === 'local' && (changes.selectedHTML || changes.selectedCSS)) {
        loadStoredData();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    loadStoredData();

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 bg-indigo-600 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Code Snapper</h1>
        <p className="text-center text-sm opacity-80">Snap and view HTML & CSS of elements on the page</p>
      </header>
      <div className="flex justify-center mb-6">
        <button
          onClick={selectElement}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
        >
          Start Element Selection
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        <textarea
          className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono bg-gray-100 text-gray-900 resize-none"
          value={output}
          readOnly
          placeholder="Selected HTML and CSS will appear here..."
        />
      </div>
    </div>
  );
}

export default App;
