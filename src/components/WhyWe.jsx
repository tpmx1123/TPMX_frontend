import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScroll } from "./ScrollManager";

const WhyWe = () => {
  const { currentSection } = useScroll();
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);


  // Entrance animations
  useEffect(() => {
    if (currentSection === 'whywe' && sectionRef.current) {
      const section = sectionRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const description = descriptionRef.current;

      // Fade in section
      gsap.fromTo(
        section,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      );

      // Animate title
      if (title) {
        gsap.fromTo(
          title,
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.2
          }
        );
      }

      // Animate subtitle
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          {
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.6
          }
        );
      }

      // Animate description with stagger
      if (description) {
        const lines = description.querySelectorAll('p');
        gsap.fromTo(
          lines,
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1,
            stagger: 0.2
          }
        );
      }

      // Animate image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            scale: 0.9
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            delay: 1.2
          }
        );
      }
    }
  }, [currentSection]);

  return (
    <section
      id="whywe"
      ref={sectionRef}
      className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white overflow-hidden ${
        currentSection === 'whywe' ? 'z-20 opacity-100 visible' : 'z-0 opacity-0 pointer-events-none invisible'
      }`}
      style={{
        display: currentSection === 'whywe' ? 'block' : 'none'
      }}
    >
      {/* Main content container - starts below navbar */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-20 pt-20 md:pt-24"
      >
        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-8 lg:gap-12">
          {/* Left side - Text content */}
          <div className="flex-1">
            {/* Main Title - "Why We Get Out of Bed" */}
            <h1
              ref={titleRef}
              className="text-[clamp(4rem,12vw,10rem)] md:text-[clamp(5rem,12vw,2rem)] font-black leading-[0.9] tracking-[-0.02em] mb-8 text-white"
              style={{
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              <span className="block">WHY WE</span>
              <span className="block">GET OUT</span>
              <span className="block">OF BED</span>
            </h1>

            {/* Subtitle */}
            <h2
              ref={subtitleRef}
              className="text-[clamp(1.25rem,2.5vw,2rem)] font-normal text-white mb-8 tracking-tight"
              style={{
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              Because the future needs better brands.
            </h2>

            {/* Description */}
            <div
              ref={descriptionRef}
              className="max-w-3xl space-y-4"
            >
              <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-white leading-relaxed font-normal">
                We're building tomorrow's brands to be responsible, inclusive, fearless.
              </p>
              <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-white leading-relaxed font-normal">
                From eco‑friendly packaging to accessible digital products, we're here for big impact and long‑term love not throwaway trends.
              </p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <img
              ref={imageRef}
              src="/CREATIVE_HOME.svg"
              alt="Creative Home"
              className="w-full max-w-lg lg:max-w-xl h-auto opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWe;

