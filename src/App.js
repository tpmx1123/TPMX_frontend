import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import { ScrollProvider } from './components/ScrollManager';
import './App.css';

function App() {
  return (
    <ScrollProvider>
      <div className="App">
        <Navbar />
        <Hero />
        <WhatWeDo />
       
      </div>
    </ScrollProvider>
  );
}

export default App;
