import { createContext, useContext, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [heroScrollIndex, setHeroScrollIndex] = useState(0);
  const [whatWeDoIndex, setWhatWeDoIndex] = useState(0);
  const animatingRef = useRef(false);

  const handleScroll = (direction) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    if (currentSection === 'hero') {
      if (direction === 1) {
        // Scroll down in Hero
        if (heroScrollIndex < 2) {
          setHeroScrollIndex(heroScrollIndex + 1);
          setTimeout(() => { animatingRef.current = false; }, 800);
        } else {
          // Move to WhatWeDo
          setCurrentSection('whatwedo');
          setWhatWeDoIndex(0);
          setTimeout(() => { animatingRef.current = false; }, 1200);
        }
      } else {
        // Scroll up in Hero
        if (heroScrollIndex > 0) {
          setHeroScrollIndex(heroScrollIndex - 1);
          setTimeout(() => { animatingRef.current = false; }, 800);
        } else {
          animatingRef.current = false;
        }
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
          setHeroScrollIndex(2);
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
  };

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
  }, [currentSection, heroScrollIndex, whatWeDoIndex]);

  return (
    <ScrollContext.Provider
      value={{
        currentSection,
        heroScrollIndex,
        whatWeDoIndex,
        setCurrentSection,
        setHeroScrollIndex,
        setWhatWeDoIndex,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

