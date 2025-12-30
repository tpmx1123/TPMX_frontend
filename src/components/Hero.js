import { useEffect, useRef } from "react";
import gsap from "gsap";
import Carousel3D from "./Carousel3D";
import { useScroll } from "./ScrollManager";

const Hero = () => {
  const { currentSection } = useScroll();
  const heroRef = useRef(null);
  const marqueeTopRef = useRef(null);
  const marqueeMiddleRef = useRef(null);
  const marqueeBottomRef = useRef(null);

  useEffect(() => {
    // Top row marquee - TECH - Right to Left
    if (marqueeTopRef.current) {
      const container = marqueeTopRef.current;
      const width = container.scrollWidth / 2;
      gsap.fromTo(
        container,
        { x: -width },
        {
          x: 0,
          duration: 35,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => {
              const val = parseFloat(x);
              return `${val < 0 ? val + width : val}px`;
            },
          },
        }
      );
    }

    // Middle row marquee - PEOPLE - Left to Right
    if (marqueeMiddleRef.current) {
      const container = marqueeMiddleRef.current;
      const width = container.scrollWidth / 2;
      gsap.to(container, {
        x: -width,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => `${parseFloat(x) % width}px`,
        },
      });
    }

    // Bottom row marquee - MEDIA - Right to Left
    if (marqueeBottomRef.current) {
      const container = marqueeBottomRef.current;
      const width = container.scrollWidth / 2;
      gsap.fromTo(
        container,
        { x: -width },
        {
          x: 0,
          duration: 40,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => {
              const val = parseFloat(x);
              return `${val < 0 ? val + width : val}px`;
            },
          },
        }
      );
    }
  }, []);

  // Hero visibility animation
  useEffect(() => {
    if (currentSection === 'hero' && heroRef.current) {
      const hero = heroRef.current;
      gsap.to(hero, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [currentSection]);

  return (
    <section
      id="home"
      ref={heroRef}
      className={`fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black text-white overflow-hidden ${
        currentSection === 'hero' ? 'z-20 opacity-100 visible' : 'z-0 opacity-0 pointer-events-none invisible'
      }`}
      style={{
        display: currentSection === 'hero' ? 'flex' : 'none'
      }}
    >
      {/* Marquee Text Row 1 - TECH (Top Row) - Right to Left */}
      <div className="absolute top-[8%] right-0 pointer-events-none overflow-hidden z-0 w-full h-[35vh]">
        <div
          ref={marqueeTopRef}
          className="reverse-marquee-component flex whitespace-nowrap will-change-transform justify-end items-center h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={`tech-${index}`}
              className="reverse-marquee-text text-[10rem] md:text-[16rem] lg:text-[12rem] font-black text-gray-500/50 uppercase tracking-[0.15em] select-none inline-block leading-none mb-20"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              TECH&nbsp; {" "}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Text Row 2 - PEOPLE (Middle Row) - Left to Right */}
      <div className="absolute top-[55%] -translate-y-1/2 left-0 pointer-events-none overflow-hidden z-0 w-full h-[45vh]">
        <div
          ref={marqueeMiddleRef}
          className="marquee-text-component flex whitespace-nowrap will-change-transform items-center h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={`people-${index}`}
              className="reverse-marquee-text text-[10rem] md:text-[16rem] lg:text-[12rem] font-black text-gray-500/50 uppercase tracking-[0.15em] select-none inline-block leading-none mb-20"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              PEOPLE&nbsp; {" "}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Text Row 3 - MEDIA (Bottom Row) - Right to Left */}
      <div className="absolute bottom-[8%] right-0 pointer-events-none overflow-hidden z-0 w-full h-[30vh]">
        <div
          ref={marqueeBottomRef}
          className="reverse-marquee-component flex whitespace-nowrap will-change-transform justify-end items-center h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {[...Array(8)].map((_, index) => (
            <div
              key={`media-${index}`}
              className="reverse-marquee-text text-[10rem] md:text-[16rem] lg:text-[12rem] font-black text-gray-500/50 uppercase tracking-[0.15em] select-none inline-block leading-none"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              MEDIA &nbsp; {" "}
            </div>
          ))}
        </div>
      </div>

      {/* 3D Carousel - Only show when in Hero section */}
      {currentSection === 'hero' && (
        <div className="relative z-10 w-full h-screen">
          <Carousel3D />
        </div>
      )}
      
    </section>
  );
};

export default Hero;