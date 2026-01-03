import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScroll } from "./ScrollManager";

const WhatWeDo = () => {
  const { currentSection, whatWeDoIndex } = useScroll();
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const techCardRef = useRef(null);
  const peopleCardRef = useRef(null);
  const mediaCardRef = useRef(null);

  useEffect(() => {
    if (currentSection === 'whatwedo' && sectionRef.current) {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      const subtitle = subtitleRef.current;
      const description = descriptionRef.current;

      // Fade in animation
      gsap.fromTo(
        section,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Stagger text animations
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
        );
      }

      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
        );
      }

      if (description) {
        gsap.fromTo(
          description,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
        );
      }
    }
  }, [currentSection]);

  // Background text opacity is handled via inline styles for smooth transitions

  // Animate cards based on scroll index - Cards stick once shown
  useEffect(() => {
    if (currentSection !== 'whatwedo') return;

    const techCard = techCardRef.current;
    const peopleCard = peopleCardRef.current;
    const mediaCard = mediaCardRef.current;

    // Tech Card (Left) - Index 1 - Animation from bottom
    if (techCard) {
      const currentOpacity = gsap.getProperty(techCard, "opacity") || 0;
      
      if (whatWeDoIndex >= 1) {
        // Only animate if card is not already visible
        if (currentOpacity < 0.5) {
          gsap.fromTo(
            techCard,
            { 
              opacity: 0, 
              y: 400,
              scale: 0.95
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 1.2,
              ease: "power3.out"
            }
          );
        }
        // Keep card visible (stick) - don't hide it
      } else {
        // Only hide if scrolling back to index 0
        gsap.to(techCard, {
          opacity: 0,
          y: 400,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.in"
        });
      }
    }

    // People Card (Middle) - Index 2 - Animation from bottom
    if (peopleCard) {
      const currentOpacity = gsap.getProperty(peopleCard, "opacity") || 0;
      
      if (whatWeDoIndex >= 2) {
        // Only animate if card is not already visible
        if (currentOpacity < 0.5) {
          gsap.fromTo(
            peopleCard,
            { 
              opacity: 0, 
              y: 400,
              scale: 0.95
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 1.2,
              ease: "power3.out"
            }
          );
        }
        // Keep card visible (stick) - don't hide it
      } else {
        // Hide only if scrolling back below index 2
        gsap.to(peopleCard, {
          opacity: 0,
          y: 400,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.in"
        });
      }
    }

    // Media Card (Right) - Index 3 - Animation from bottom
    if (mediaCard) {
      const currentOpacity = gsap.getProperty(mediaCard, "opacity") || 0;
      
      if (whatWeDoIndex >= 3) {
        // Only animate if card is not already visible
        if (currentOpacity < 0.5) {
          gsap.fromTo(
            mediaCard,
            { 
              opacity: 0, 
              y: 400,
              scale: 0.95
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 1.2,
              ease: "power3.out"
            }
          );
        }
        // Keep card visible (stick) - don't hide it
      } else {
        // Hide only if scrolling back below index 3
        gsap.to(mediaCard, {
          opacity: 0,
          y: 400,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.in"
        });
      }
    }
  }, [currentSection, whatWeDoIndex]);

  if (currentSection !== 'whatwedo') return null;

  return (
    <section
      id="whatwedo"
      ref={sectionRef}
      className={`fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center text-white overflow-hidden ${
        currentSection === 'whatwedo' ? 'z-30 opacity-100 visible' : 'z-0 opacity-0 pointer-events-none invisible'
      }`}
      style={{
        display: currentSection === 'whatwedo' ? 'flex' : 'none',
        backgroundColor: whatWeDoIndex === 0 ? '#000000' : 'transparent'
      }}
    >
      {/* Main Content - Background placeholder "THE WORLD WE PLAY IN" - Always visible */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center max-w-6xl mx-auto z-0 pointer-events-none"
        style={{
          opacity: whatWeDoIndex === 0 ? 1 : 0.9
        }}
      >
        {/* Main Headline - "The World We Play In" - Background Placeholder */}
        <h1
          ref={headlineRef}
          className="text-[clamp(4rem,12vw,10rem)] md:text-[clamp(5rem,10vw,12rem)] font-black leading-[0.9] tracking-[-0.02em]"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <span className="text-white/80">THE WORLD</span>
          <br />
          <span className="text-white/80">WE PLAY</span>
          <br />
          <span className="text-white/50">IN</span>
        </h1>

        {/* Subtitle - "What's buzzing right now?" */}
        <h2
          ref={subtitleRef}
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal text-white/50 mb-6 tracking-tight"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          What's buzzing right now?
        </h2>
      </div>

      {/* Bottom text - Always visible at bottom */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-20">
        <p ref={descriptionRef} className="text-[clamp(0.9rem,1.2vw,1.1rem)] text-white/60 max-w-4xl mx-auto leading-relaxed px-6">
          We stay plugged in so you don't have to. Tap into our brains and ride the wave.
        </p>
      </div>

      {/* Three Equal Vertical Sections - Beautiful Cards with Theme */}
      <div className="absolute top-20 left-0 right-0 bottom-0 flex w-full z-10">
        {/* Tech Card - Left (Red Theme) */}
        <div
          ref={techCardRef}
          className="w-1/3 h-full opacity-0"
          style={{ 
            display: whatWeDoIndex >= 1 ? 'block' : 'none',
            pointerEvents: whatWeDoIndex >= 1 ? 'auto' : 'none'
          }}
        >
          <div className="relative w-full h-full bg-[#6B1F1F] overflow-hidden">
            {/* Content */}
            <div className=" top-20 relative z-10 w-full h-full p-8 md:p-12 lg:p-16 flex flex-col justify-start pt-12 md:pt-16">
              <h3 className="text-[clamp(3rem,8vw,4rem)] md:text-[clamp(4rem,8vw,4rem)] font-black text-white leading-[0.9] tracking-tight mb-8 uppercase text-center" style={{ fontFamily: 'system-ui, sans-serif' }}>
                TECH
              </h3>
            
              <p className="text-white text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed max-w-md font-normal" style={{ fontFamily: 'system-ui, sans-serif' }}>
                AI-powered content, immersive AR, and smart automations we're already on what's next to deliver efficiency, convenience, and impact.
              </p>
            </div>
          </div>
        </div>

        {/* People Card - Middle (Blue Theme) */}
        <div
          ref={peopleCardRef}
          className="w-1/3 h-full opacity-0"
          style={{ 
            display: whatWeDoIndex >= 2 ? 'block' : 'none',
            pointerEvents: whatWeDoIndex >= 2 ? 'auto' : 'none'
          }}
        >
          <div className="relative w-full h-full bg-[#1A2A4A] overflow-hidden">
            {/* Content */}
            <div className=" top-20 relative z-10 w-full h-full p-8 md:p-12 lg:p-16 flex flex-col justify-start pt-12 md:pt-16 overflow-hidden">
              <h3 className="  text-[clamp(3rem,8vw,4rem)] md:text-[clamp(4rem,8vw,4rem)] font-black text-white leading-[0.9] tracking-tight mb-8 uppercase break-words" style={{ fontFamily: 'system-ui, sans-serif', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                PEOPLE
              </h3>
              
              <div className="space-y-4">
                <p className="text-white text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed max-w-md font-normal" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  Communities over consumers. Authenticity over ads. Diversity over sameness.
                </p>
               
              </div>
            </div>
          </div>
        </div>

        {/* Media Card - Right (Violet Theme) */}
        <div
          ref={mediaCardRef}
          className="w-1/3 h-full opacity-0"
          style={{ 
            display: whatWeDoIndex >= 3 ? 'block' : 'none',
            pointerEvents: whatWeDoIndex >= 3 ? 'auto' : 'none'
          }}
        >
          <div className="relative w-full h-full bg-[#3D1F4A] overflow-hidden">
            {/* Content */}
            <div className=" top-20 relative z-10 w-full h-full p-8 md:p-12 lg:p-16 flex flex-col justify-start pt-12 md:pt-16 overflow-hidden">
              <h3 className="  text-[clamp(3rem,8vw,4rem)] md:text-[clamp(4rem,8vw,4rem)] font-black text-white leading-[0.9] tracking-tight mb-8 uppercase break-words" style={{ fontFamily: 'system-ui, sans-serif', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                MEDIA
              </h3>
              
              <p className="text-white text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed max-w-md font-normal" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Live streams, shoppable reels, creator collabs—media is the new marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;

