import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScroll } from "./ScrollManager";

const WhatWeDo = () => {
  const { currentSection, whatWeDoIndex } = useScroll();
  const sectionsRef = useRef([]);
  const imagesRef = useRef([]);
  const headingsRef = useRef([]);
  const outerWrappersRef = useRef([]);
  const innerWrappersRef = useRef([]);

  const sections = [
    {
      id: "intro",
      heading: "The World We Play In",
      subtitle: "What's buzzing right now?",
      description: "We stay plugged in so you don't have to. Tap into our brains and ride the wave.",
      bgImage: "https://picsum.photos/1920/1080?random=1"
    },
    {
      id: "tech",
      heading: "Tech",
      description: "AI-powered content, immersive AR, and smart automations we're already on what's next to deliver efficiency, convenience, and impact.",
      icon: "",
      bgImage: "https://picsum.photos/1920/1080?random=2"
    },
    {
      id: "people",
      heading: "People",
      description: "Communities over consumers. Authenticity over ads. Diversity over sameness.",
      icon: "",
      bgImage: "https://picsum.photos/1920/1080?random=3"
    },
    {
      id: "media",
      heading: "Media",
      description: "Live streams, shoppable reels, creator collabs—media is the new marketplace.",
      icon: "",
      bgImage: "https://picsum.photos/1920/1080?random=4"
    }
  ];

  useEffect(() => {
    if (currentSection !== 'whatwedo') return;

    const sections = sectionsRef.current;
    const images = imagesRef.current;
    const headings = headingsRef.current;
    const outerWrappers = outerWrappersRef.current;
    const innerWrappers = innerWrappersRef.current;

    function gotoSection(index, direction) {
      if (index < 0 || index >= sections.length) return;
      
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" }
      });

      // Hide all sections first
      sections.forEach((section, i) => {
        if (i !== index && gsap.getProperty(section, "autoAlpha") === 1) {
          gsap.set(section, { zIndex: 0 });
          tl.to(images[i], { yPercent: -15 * dFactor })
            .set(section, { autoAlpha: 0 });
        }
      });

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        {
          yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor)
        },
        {
          yPercent: 0
        },
        0
      )
        .fromTo(
          images[index],
          { yPercent: 15 * dFactor },
          { yPercent: 0 },
          0
        )
        .fromTo(
          headings[index],
          {
            autoAlpha: 0,
            yPercent: 150 * dFactor
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random"
            }
          },
          0.2
        );
    }

    // Initialize sections
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    gsap.set(sections, { visibility: "hidden", autoAlpha: 0 });

    // Go to current section
    gotoSection(whatWeDoIndex, 1);
  }, [currentSection, whatWeDoIndex]);

  if (currentSection !== 'whatwedo') return null;

  return (
    <section id="whatwedo" className="fixed top-0 left-0 w-full h-screen overflow-hidden z-30 bg-black">
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => (sectionsRef.current[index] = el)}
          className="fixed top-0 left-0 w-full h-full bg-black"
          style={{ visibility: "hidden" }}
        >
          <div
            ref={(el) => (outerWrappersRef.current[index] = el)}
            className="w-full h-full overflow-y-hidden"
          >
            <div
              ref={(el) => (innerWrappersRef.current[index] = el)}
              className="w-full h-full overflow-y-hidden"
            >
               <div
                 ref={(el) => (imagesRef.current[index] = el)}
                 className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-cover bg-center bg-black"
                 style={{
                   backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.6) 100%), url(${section.bgImage})`,
                   backgroundSize: "cover",
                   backgroundPosition: "center"
                 }}
               >
                <div className="z-[999] text-center px-5 max-w-5xl">
                  {section.icon && (
                    <div className="text-6xl mb-8 opacity-80">{section.icon}</div>
                  )}
                  <div className="clip-text overflow-hidden">
                    <h2
                      ref={(el) => (headingsRef.current[index] = el)}
                      className="text-[clamp(1rem,6vw,10rem)] font-semibold leading-[1.2] text-center text-white mb-8 max-w-[90vw] md:max-w-[1200px] mx-auto"
                      style={{ 
                        textTransform: "none",
                        marginRight: "-0.5em",
                        willChange: "transform"
                      }}
                    >
                      {section.heading}
                    </h2>
                  </div>
                  {section.subtitle && (
                    <p className="text-2xl md:text-3xl text-white/80 mb-6 font-light uppercase tracking-wider">
                      {section.subtitle}
                    </p>
                  )}
                  <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
};

export default WhatWeDo;

