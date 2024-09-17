import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const [output, setOutput] = useState('');
  const isSelecting = useRef(false);

  // Function to load data from chrome storage and update the output
  const loadStoredData = () => {
    chrome.storage.local.get(['selectedHTML', 'selectedCSS'], (res) => {
      if (res.selectedHTML || res.selectedCSS) {
        setOutput(`HTML:\n${res.selectedHTML || ''}\n\nCSS:\n${res.selectedCSS || ''}`);
      }
    });
  };

  // Trigger selection of an element
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

  // Add an event listener to listen for changes in chrome storage
  useEffect(() => {
    const handleStorageChange = (changes: any, area: any) => {
      if (area === 'local' && (changes.selectedHTML || changes.selectedCSS)) {
        loadStoredData();
      }
    };

    // Listen for storage changes
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Load initial data
    loadStoredData();

    // Cleanup the listener when the component is unmounted
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className='header p-2 mb-3 flex items-center gap-4'>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>

      <button onClick={selectElement}>
        CLICK ME
      </button>

      <textarea className='p-2' value={output} readOnly />
    </>
  );
}

export default App;
