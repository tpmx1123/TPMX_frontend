import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useScroll } from './ScrollManager';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const { navigateToSection } = useScroll();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in animation on load
  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(navbarRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "easeOut"
        }
      );
    }
  }, []);

  const menuItems = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PORTFOLIO', href: '#portfolio' },
    { label: 'SERVICES', href: '#services' }
  ];

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 w-full z-[999] px-6 md:px-20 py-4 md:py-6 transition-all duration-300 ease-in-out ${
        scrolled
          ? 'backdrop-blur-[8px] bg-[rgba(10,10,10,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-[0.5px] text-white">
          TPM<span className="text-red-500">X</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="relative text-[0.95rem] font-medium text-white opacity-85 hover:opacity-100 transition-all duration-300 hover:-translate-y-0.5 nav-link cursor-pointer"
              onClick={(e) => {
                if (item.href === '#home') {
                  e.preventDefault();
                  navigateToSection('hero');
                }
              }}
            >
              {item.label}
            </a>
          ))}
          {/* Contact Button */}
          <a
            href="#contact"
            className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 group"
          >
            CONTACT
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[rgba(10,10,10,0.98)] backdrop-blur-lg z-40 md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-2xl font-medium text-white opacity-85 hover:opacity-100 transition-all duration-300 cursor-pointer"
              onClick={(e) => {
                if (item.href === '#home') {
                  e.preventDefault();
                  navigateToSection('hero');
                }
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-white text-black px-8 py-3 rounded-full font-medium text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            CONTACT
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

