import { useRef, useState } from 'react';
import './App.css';

function App() {

  const [output, setOutput] = useState('');
  const isSelecting = useRef<boolean>(false);

  chrome.storage.local.get([ 'selectedHTML', 'selectedCSS' ], (res) => {
    if (res) {
      setOutput(`HTML:\n${ res.selectedHTML }\n\nCSS:\n${ res.selectedCSS }`);
    }
  });

  const selectElement = () => {
    isSelecting.current = true;

    chrome.runtime.sendMessage({ action: 'startSelection' }, (res) => {
      if (res.status === 'error') {
        console.error('Error: ', res.message);

        alert('[CodeSnap] An error occurred. Please try again.');
      }
    });
  };
  
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

      <textarea className='p-2'>
        { output }
      </textarea>
    </>
  )
}

export default App;
