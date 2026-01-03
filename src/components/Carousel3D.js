import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Carousel3D = () => {
    const carouselRef = useRef(null);
    const imagesRef = useRef([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const modalRef = useRef(null);
    const imageRef = useRef(null);
    const isDraggingRef = useRef(false);
    const clickStartRef = useRef({ x: 0, y: 0, time: 0 });

    useEffect(() => {
        const carousel = carouselRef.current;
        const images = imagesRef.current;
        const radius = 280; // Reduced radius for tighter carousel
        const progress = { value: 0 };
        const autoRotate = { speed: 0.001 }; // 🔁 Auto-rotation speed
        let isDragging = false;
        let startX = 0;

        // Handle wheel events
        const handleWheel = (e) => {
            e.preventDefault();
            gsap.killTweensOf(progress);
            const p = e.deltaY * -0.0005;
            gsap.to(progress, {
                duration: 2,
                ease: "power4.out",
                value: `+=${p}`,
            });
        };

        // Handle pointer/mouse events
        const handlePointerDown = (e) => {
            isDraggingRef.current = false;
            clickStartRef.current = {
                x: e.clientX || e.touches?.[0]?.clientX || 0,
                y: e.clientY || e.touches?.[0]?.clientY || 0,
                time: Date.now()
            };
            isDragging = true;
            startX = e.clientX || e.touches?.[0]?.clientX || 0;
            if (carousel) carousel.style.cursor = "grabbing";
            e.preventDefault();
        };

        const handlePointerMove = (e) => {
            if (!isDragging) return;
            const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
            const currentY = e.clientY || e.touches?.[0]?.clientY || 0;
            const deltaX = currentX - startX;
            const deltaY = currentY - clickStartRef.current.y;
            
            // If user moved more than 5px, consider it a drag
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                isDraggingRef.current = true;
            }
            
            startX = currentX;
            
            gsap.killTweensOf(progress);
            const p = deltaX * 0.05;
            gsap.to(progress, {
                duration: 2,
                ease: "power4.out",
                value: `+=${p}`,
            });
        };

        const handlePointerUp = () => {
            isDragging = false;
            if (carousel) carousel.style.cursor = "grab";
        };

        // Add event listeners
        if (carousel) {
            carousel.addEventListener('wheel', handleWheel, { passive: false });
            carousel.addEventListener('mousedown', handlePointerDown);
            carousel.addEventListener('touchstart', handlePointerDown, { passive: false });
            window.addEventListener('mousemove', handlePointerMove);
            window.addEventListener('touchmove', handlePointerMove, { passive: false });
            window.addEventListener('mouseup', handlePointerUp);
            window.addEventListener('touchend', handlePointerUp);
        }

        const animate = () => {
            // 🔁 continuous auto-rotation
            if (!gsap.isTweening(progress) && !isDragging) {
                progress.value += autoRotate.speed;
            }

            images.forEach((image, index) => {
                if (image) {
                    const theta = index / images.length - progress.value;
                    const x = -Math.sin(theta * Math.PI * 2) * radius;
                    const z = Math.cos(theta * Math.PI * 2) * radius;

                    // All images same size - no scaling based on z-position
                    const scaleFactor = 1.1;

                    // Opacity for depth effect
                    const normalizedZ = (z + radius) / (radius * 2);
                    const opacity = 1 + normalizedZ * 1;

                    image.style.transform = `
                        translate3d(${x}px, 0px, ${z}px)
                        rotateY(${360 * -theta}deg)
                        scale(${scaleFactor})
                    `;

                    image.style.opacity = opacity;
                }
            });
        };

        gsap.ticker.add(animate);

        // Vertical oscillation animation
        const verticalAnimation = gsap.to(carousel, {
            y: 30,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });

        return () => {
            if (carousel) {
                carousel.removeEventListener('wheel', handleWheel);
                carousel.removeEventListener('mousedown', handlePointerDown);
                carousel.removeEventListener('touchstart', handlePointerDown);
                window.removeEventListener('mousemove', handlePointerMove);
                window.removeEventListener('touchmove', handlePointerMove);
                window.removeEventListener('mouseup', handlePointerUp);
                window.removeEventListener('touchend', handlePointerUp);
            }
            gsap.ticker.remove(animate);
            verticalAnimation.kill();
        };
    }, []);

    // Animate modal when image is selected/deselected
    useEffect(() => {
        if (selectedImage && modalRef.current && imageRef.current) {
            // Open animation
            gsap.fromTo(
                modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
            gsap.fromTo(
                imageRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
            );
        } else if (!selectedImage && modalRef.current && imageRef.current) {
            // Close animation
            gsap.to(imageRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
            gsap.to(modalRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                delay: 0.1,
                onComplete: () => {
                    // Modal is already removed from DOM, but we ensure cleanup
                }
            });
        }
    }, [selectedImage]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null);
            }
        };
        
        if (selectedImage) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedImage]);

    return (
        <>
        <div
            ref={carouselRef}
            className="
                w-screen h-[100vh] top-[-50px] right-[50px] relative flex justify-center items-center
                [transform-style:preserve-3d]
                [perspective:1200px]
                select-none cursor-grab
                -translate-y-[70px]
                [transform:rotateX(-20deg)_scale(1.15)]
                max-sm:[transform:rotateX(-10deg)_scale(0.6)_translateY(-60px)]
            "
        >
            {[
                { id: 1, number: "01", label: "BRAND STRATEGY", color: "from-blue-600/20 to-blue-800/20" },
                { id: 2, number: "02", label: "CONTENT MARKETING", color: "from-purple-600/20 to-purple-800/20" },
                { id: 3, number: "03", label: "SOCIAL ADVERTISING", color: "from-pink-600/20 to-pink-800/20" },
                { id: 4, number: "04", label: "EMAIL CAMPAIGNS", color: "from-green-600/20 to-green-800/20" },
                { id: 5, number: "05", label: "SEARCH OPTIMIZATION", color: "from-orange-600/20 to-orange-800/20" },
                { id: 6, number: "06", label: "INFLUENCER MARKETING", color: "from-cyan-600/20 to-cyan-800/20" },
                { id: 7, number: "07", label: "MARKET RESEARCH", color: "from-indigo-600/20 to-indigo-800/20" },
                { id: 8, number: "08", label: "CREATIVE DIRECTION", color: "from-rose-600/20 to-rose-800/20" },
            ].map((item, index) => (
                <div
                    key={item.id}
                    className="
                        carousel-image
                        absolute  
                        w-[210px] h-[260px]
                        -translate-x-1/2 -translate-y-1/2
                        [transform-style:preserve-3d]
                        rounded-lg
                        overflow-hidden
                        shadow-2xl
                        cursor-pointer
                    "
                    style={{
                        background: item.id % 3 === 0 ? '#1e293b' : item.id % 2 === 0 ? '#334155' : '#0f172a',
                    }}
                    ref={(el) => {
                        if (el) {
                            imagesRef.current[index] = el;
                        }
                    }}
                    onClick={(e) => {
                        // Prevent click if user was dragging
                        if (isDraggingRef.current) {
                            e.stopPropagation();
                            return;
                        }
                        
                        // Check if it was a quick click (not a drag)
                        const clickDuration = clickStartRef.current.time 
                            ? Date.now() - clickStartRef.current.time 
                            : 0;
                        
                        // If click duration is reasonable (less than 300ms) or if time wasn't tracked, treat as click
                        if (clickDuration < 300 || clickDuration === 0) {
                            setSelectedImage({
                                id: item.id,
                                number: item.number,
                                label: item.label,
                                imageUrl: `https://picsum.photos/600/800?random=${item.id}`
                            });
                        }
                    }}
                >
                    {/* Image Area with Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/60 via-slate-800/50 to-slate-900/80">
                        {/* Image placeholder - Using Unsplash API with different image IDs */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://picsum.photos/600/800?random=${item.id}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.4,
                            }}
                        />

                        {/* Gradient overlay on top of image */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }} />
                    </div>

                    {/* Number in top-left */}
                    <div className="absolute top-4 left-4 z-20 text-white/80 text-sm font-mono font-bold">
                        {item.number}
                    </div>

                    {/* Sparkle Icon */}
                    <div
                        className="absolute z-20 text-white/50"
                        style={{
                            top: '35%',
                            left: '65%',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z" />
                        </svg>
                    </div>

                    {/* Label at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="text-white text-xs uppercase tracking-wider font-light">
                            {item.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Full Screen Image Modal */}
        {selectedImage && (
            <div
                ref={modalRef}
                className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedImage(null)}
                style={{ display: 'flex' }}
            >
                {/* Close Button */}
                <button
                    className="absolute top-16 right-6 z-[100] text-white hover:text-white/80 transition-colors pointer-events-auto cursor-pointer p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedImage(null);
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="Close"
                    type="button"
                    style={{ zIndex: 10000 }}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Image Container */}
                <div
                    ref={imageRef}
                    className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-8 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={selectedImage.imageUrl}
                        alt={selectedImage.label}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                    
                    {/* Image Info Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
                        <div className="text-white/60 text-sm font-mono font-bold mb-2">
                            {selectedImage.number}
                        </div>
                        <div className="text-white text-lg uppercase tracking-wider font-light">
                            {selectedImage.label}
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Carousel3D;

