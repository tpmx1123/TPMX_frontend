import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import WhyWe from './components/WhyWe';
import SocialSidebar from './components/SocialSidebar';
import { ScrollProvider } from './components/ScrollManager';
import './App.css';

function App() {
  return (
    <ScrollProvider>
      <div className="App">
        <Navbar />
        <Hero />
        <WhatWeDo />
        <WhyWe />
        <SocialSidebar />
      </div>
    </ScrollProvider>
  );
}

export default App;
