import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [heroScrollIndex, setHeroScrollIndex] = useState(0);
  const [whatWeDoIndex, setWhatWeDoIndex] = useState(0);
  const animatingRef = useRef(false);

  // Expose navigation function
  const navigateToSection = (section, index = 0) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    
    if (section === 'hero') {
      setCurrentSection('hero');
      setHeroScrollIndex(0);
      setWhatWeDoIndex(0);
    } else if (section === 'whatwedo') {
      setCurrentSection('whatwedo');
      setWhatWeDoIndex(index);
    }
    
    setTimeout(() => { animatingRef.current = false; }, 800);
  };

  const handleScroll = useCallback((direction) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    if (currentSection === 'hero') {
      if (direction === 1) {
        // Scroll down in Hero - Move directly to WhatWeDo
        setCurrentSection('whatwedo');
        setWhatWeDoIndex(0);
        setTimeout(() => { animatingRef.current = false; }, 1200);
      } else {
        // Scroll up in Hero - Stay at hero (can't go back from hero)
        animatingRef.current = false;
      }
    } else if (currentSection === 'whatwedo') {
      if (direction === 1) {
        // Scroll down in WhatWeDo
        if (whatWeDoIndex < 3) {
          setWhatWeDoIndex(whatWeDoIndex + 1);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        } else {
          // Move to next section
          setCurrentSection('next');
          setTimeout(() => { animatingRef.current = false; }, 1200);
        }
      } else {
        // Scroll up in WhatWeDo
        if (whatWeDoIndex > 0) {
          setWhatWeDoIndex(whatWeDoIndex - 1);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        } else {
          // Move back to Hero
          setCurrentSection('hero');
          setHeroScrollIndex(0);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        }
      }
    } else if (currentSection === 'next') {
      if (direction === -1) {
        // Scroll up from next section
        setCurrentSection('whatwedo');
        setWhatWeDoIndex(3); // Start at media
        setTimeout(() => { animatingRef.current = false; }, 1200);
      } else {
        animatingRef.current = false;
      }
    }
  }, [currentSection, whatWeDoIndex]);

  useEffect(() => {
    let lastWheelTime = 0;
    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 500) return;
      lastWheelTime = now;

      const direction = e.deltaY > 0 ? 1 : -1;
      handleScroll(direction);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        handleScroll(direction);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScroll]);

  return (
    <ScrollContext.Provider
      value={{
        currentSection,
        heroScrollIndex,
        whatWeDoIndex,
        setCurrentSection,
        setHeroScrollIndex,
        setWhatWeDoIndex,
        navigateToSection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

