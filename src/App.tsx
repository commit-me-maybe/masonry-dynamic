import React, { useState, useEffect, useMemo, Profiler } from 'react';
import './App.css';
import MasonryGrid from './components/MasonryGrid/MasonryGrid';
import { calculateColumnCount } from './utils/calculateColumnsCount';
import { debounce } from 'lodash';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columnCount = useMemo(
    () => calculateColumnCount(windowWidth),
    [windowWidth]
  );

  return (
    <div className="App">
      {/* TODO: Remove this Profiler after testing */}
      <Profiler
        id="MasonryGrid"
        onRender={(id, phase, actualDuration) => {
          console.log(`${id} - ${phase} - ${actualDuration}`);
        }}
      >
        <MasonryGrid columnCount={columnCount} />
      </Profiler>
    </div>
  );
}

export default App;
