import React from 'react';
import './App.css';
import MasonryGrid from './components/MasonryGrid/MasonryGrid';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <MasonryGrid>
        <Link to="/photo-details/1">Photo 1</Link>
      </MasonryGrid>
    </div>
  );
}

export default App;
