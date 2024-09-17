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
