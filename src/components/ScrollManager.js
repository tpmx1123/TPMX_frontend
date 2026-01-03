import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [whatWeDoIndex, setWhatWeDoIndex] = useState(0);
  const animatingRef = useRef(false);

  // Expose navigation function
  const navigateToSection = (section) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    
    if (section === 'hero') {
      setCurrentSection('hero');
      setWhatWeDoIndex(0);
    } else if (section === 'whatwedo') {
      setCurrentSection('whatwedo');
      setWhatWeDoIndex(0);
    } else if (section === 'whywe') {
      setCurrentSection('whywe');
    }
    
    setTimeout(() => { animatingRef.current = false; }, 800);
  };

  const handleScroll = useCallback((direction) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    if (currentSection === 'hero') {
      if (direction === 1) {
        // Scroll down from Hero to WhatWeDo
        setCurrentSection('whatwedo');
        setTimeout(() => { animatingRef.current = false; }, 1200);
      } else {
        // Scroll up in Hero - stay at hero
        setTimeout(() => { animatingRef.current = false; }, 800);
      }
    } else if (currentSection === 'whatwedo') {
      if (direction === 1) {
        // Scroll down in WhatWeDo - show cards sequentially
        if (whatWeDoIndex < 3) {
          setWhatWeDoIndex(whatWeDoIndex + 1);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        } else {
          // After all cards shown, go to WhyWe
          setCurrentSection('whywe');
          setTimeout(() => { animatingRef.current = false; }, 1200);
        }
      } else {
        // Scroll up in WhatWeDo - hide cards or go back to Hero
        if (whatWeDoIndex > 0) {
          setWhatWeDoIndex(whatWeDoIndex - 1);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        } else {
          // Go back to Hero
          setCurrentSection('hero');
          setTimeout(() => { animatingRef.current = false; }, 1200);
        }
      }
    } else if (currentSection === 'whywe') {
      if (direction === 1) {
        // Scroll down in WhyWe - stay at WhyWe (or go to next section if added)
        setTimeout(() => { animatingRef.current = false; }, 800);
      } else {
        // Scroll up in WhyWe - go back to WhatWeDo
        setCurrentSection('whatwedo');
        setWhatWeDoIndex(3); // Keep cards visible
        setTimeout(() => { animatingRef.current = false; }, 1200);
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
        whatWeDoIndex,
        navigateToSection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

