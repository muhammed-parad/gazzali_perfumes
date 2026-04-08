"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Citrus, Flower, Trees, Instagram, Phone, ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reviews = [
    {
      name: "Zayid",
      text: "This is one of the best perfumes I’ve tried recently. Long-lasting and very elegant.",
      tags: ["Long-lasting", "Elegant"]
    },
    {
      name: "Muhammed Ali",
      text: "رائحة العطر قوية ولكنها غير مزعجة. فيها توازن مثالي.",
      tags: ["Strong", "Balanced"]
    },
    {
      name: "Najhad",
      text: "Packagingum fragranceum onnum kuravilla, full luxury feel aanu.",
      tags: ["Luxury", "Great Packaging"]
    },
    {
      name: "Fathima",
      text: "Gazzali perfumes have such a unique scent. I’ve received compliments every time I wear it.",
      tags: ["Unique", "Compliment getter"]
    }
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewIsAnimating, setReviewIsAnimating] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextReview();
    }
    if (isRightSwipe) {
      prevReview();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const scentNotes = [
    {
      title: "Top Notes",
      subtitle: "Bergamot, Grapefruit",
      description: "A crisp, luminous opening that awakens the senses instantly."
    },
    {
      title: "Heart Notes",
      subtitle: "Jasmine, Rose",
      description: "A sophisticated floral core revealing true elegance."
    },
    {
      title: "Base Notes",
      subtitle: "Oud, Amber, Musk",
      description: "A deep, resonating finish that lingers for hours."
    }
  ];

  const nextReview = () => {
    if (reviewIsAnimating) return;
    setReviewIsAnimating(true);
    gsap.to('.review-anim-item', {
      opacity: 0, x: -30, duration: 0.3, stagger: 0.05, ease: "power2.in",
      onComplete: () => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        gsap.fromTo('.review-anim-item',
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", onComplete: () => setReviewIsAnimating(false) }
        );
      }
    });
  };

  const prevReview = () => {
    if (reviewIsAnimating) return;
    setReviewIsAnimating(true);
    gsap.to('.review-anim-item', {
      opacity: 0, x: 30, duration: 0.3, stagger: 0.05, ease: "power2.in",
      onComplete: () => {
        setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        gsap.fromTo('.review-anim-item',
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", onComplete: () => setReviewIsAnimating(false) }
        );
      }
    });
  };

  const desc = "Gazzali Perfumes is a celebration of timeless luxury and refined craftsmanship. Each fragrance is carefully composed using the finest ingredients, blending tradition with modern sophistication. Designed for those who appreciate elegance in its purest form.";

  // Image sequence setup
  const frameCount = 240;
  const pcImages = useRef<HTMLImageElement[]>([]);
  const mobileImages = useRef<HTMLImageElement[]>([]);
  const seq = useRef({ frame: 0 });

  useEffect(() => {
    // Preload PC frames
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/images/pc-herosection/ezgif-frame-${paddedIndex}.png`;
      pcImages.current.push(img);
    }

    // Preload Mobile frames
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/images/herosection/ezgif-frame-${paddedIndex}.png`;
      mobileImages.current.push(img);
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let handleResize = () => { };

    // --- CANVAS SCRUBBING LOGIC ---
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const render = () => {
          const isDesktop = window.innerWidth >= 768;
          const currentImages = isDesktop ? pcImages.current : mobileImages.current;
          const img = currentImages[seq.current.frame];
          if (img && img.complete) {
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            // For PC (Desktop), center the image (0.5). For Mobile, keep original shift (0.5).
            // Actually, mobile was also 0.5. So we use 0.5 for both now to "fit screen".
            const shiftXRatio = 0.5;
            const centerShift_x = canvas.width * shiftXRatio - (img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, img.width, img.height,
              centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
          }
        };

        if (pcImages.current[0]) {
          pcImages.current[0].onload = render;
        }
        if (mobileImages.current[0]) {
          mobileImages.current[0].onload = render;
        }

        gsap.to(seq.current, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-container",
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
          },
          onUpdate: render
        });

        handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          render();
        };
        window.addEventListener('resize', handleResize);
      }
    }

    let handleMouseMoveGlobal: ((e: MouseEvent) => void) | null = null;

    // --- CANVAS PARALLAX & PULSE (3D Bottle) ---
    const canvasWrapper = document.querySelector('.hero-canvas-wrapper');
    if (canvasWrapper) {
      gsap.to(canvasWrapper, {
        scale: 1.01,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      const xTo = gsap.quickTo(canvasWrapper, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(canvasWrapper, "y", { duration: 0.5, ease: "power3" });

      const onMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        xTo(x * 15);
        yTo(y * 15);
      };
      window.addEventListener("mousemove", onMouseMove);
      handleMouseMoveGlobal = onMouseMove;
    }

    // --- HERO TEXT ENTRANCE ---
    const heroTl = gsap.timeline();

    heroTl.to('.hero-logo', { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0.5);

    // Desktop
    heroTl.fromTo('.hero-char-desktop',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.03, duration: 1.5, ease: "power4.out" },
      0.6
    );

    heroTl.fromTo('.hero-desc-word-desktop',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.015, duration: 1.5, ease: "power2.out" },
      "-=1.0"
    );

    // Mobile
    heroTl.fromTo('.hero-char-mobile',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.03, duration: 1.5, ease: "power4.out" },
      0.6
    );

    heroTl.fromTo('.hero-desc-word-mobile',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.015, duration: 1.5, ease: "power2.out" },
      "-=1.0"
    );

    heroTl.fromTo('.hero-btn-mobile',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
      "-=0.5"
    );

    heroTl.to('.hero-scroll-indicator', { opacity: 1, duration: 1 }, "-=1");
    gsap.fromTo('.scroll-line',
      { y: "-100%" },
      { y: "100%", duration: 1.5, repeat: -1, ease: "power2.inOut" }
    );

    // --- SCROLL-SYNC OPACITY & BLUR ---
    gsap.to('.hero-text-container-desktop, .hero-text-container-mobile', {
      opacity: 0,
      filter: "blur(12px)",
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top top",
        end: "+=1200",
        scrub: true
      }
    });

    let mm = gsap.matchMedia();

    // --- NOTES ANIMATIONS ---
    const notes = gsap.utils.toArray('.note-item');
    notes.forEach((note: any) => {
      gsap.fromTo(note,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: note,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // --- REVIEWS ANIMATIONS ---
    gsap.fromTo('.review-content',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.reviews-section',
          start: "top 60%",
        }
      }
    );

    // --- OFFER SECTION ---
    gsap.fromTo('.offer-content',
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.offer-section',
          start: "top 75%",
        }
      }
    );

    // --- GENERIC SCROLL REVEAL ---
    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // --- MAGNETIC CTA BUTTON ---
    const btn = document.querySelector('.magnetic-btn');
    let moveBtn: any;
    let leaveBtn: any;
    if (btn) {
      moveBtn = (e: any) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
      };
      leaveBtn = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      };
      btn.addEventListener('mousemove', moveBtn);
      btn.addEventListener('mouseleave', leaveBtn);
    }

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', handleResize);
      if (handleMouseMoveGlobal) {
        window.removeEventListener('mousemove', handleMouseMoveGlobal);
      }
      if (btn) {
        btn.removeEventListener('mousemove', moveBtn);
        btn.removeEventListener('mouseleave', leaveBtn);
      }
    };
  }, []);

  return (
    <main ref={containerRef} className="relative w-full overflow-hidden selection:bg-gold-accent-1/30">

      {/* SECTION 1: HERO CANVAS & OVERLAY */}
      <section className="hero-container relative z-10 w-full h-screen overflow-hidden bg-matte-black">

        <div className="hero-canvas-wrapper absolute inset-0 z-0 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full object-cover"></canvas>
        </div>

        {/* DESKTOP HERO TEXT */}
        <div className="hero-text-container-desktop hidden md:flex absolute inset-0 z-10 flex-col items-start justify-center pointer-events-none px-[8%] lg:px-[12%] py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>

          <div className="hero-logo absolute top-10 left-[8%] lg:left-[12%] opacity-0 font-sans tracking-[0.4em] text-gold-accent-2 text-sm uppercase">
            Gazzali
          </div>

          <div className="relative z-20 flex flex-col items-start max-w-5xl mt-12">
            <h1 className="hero-title-desktop font-['Giomori',_serif] font-medium tracking-wide text-left leading-[1.1] text-[#D4AF37] drop-shadow-lg flex flex-col items-start">
              <div className="overflow-hidden py-2 px-4 -ml-4 whitespace-nowrap">
                {"Luxury".split("").map((char, i) => (
                  <span key={'d1-' + i} className="hero-char-desktop inline-block opacity-0 text-[5.5rem] lg:text-[6.75rem] xl:text-[8rem]">
                    {char}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden py-2 px-6 ml-[calc(8%-1.5rem)] lg:ml-[calc(10%-1.5rem)] whitespace-nowrap">
                {"In Every".split("").map((char, i) => (
                  <span key={'d2-' + i} className="hero-char-desktop inline-block opacity-0 italic text-white/90 text-[4.5rem] lg:text-[5.25rem] xl:text-[6.5rem]">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden py-2 px-4 ml-[calc(12%-1rem)] lg:ml-[calc(18%-1rem)] whitespace-nowrap">
                {"Breath".split("").map((char, i) => (
                  <span key={'d3-' + i} className="hero-char-desktop inline-block opacity-0 text-[6rem] lg:text-[7.25rem] xl:text-[8.5rem]">
                    {char}
                  </span>
                ))}
              </div>
            </h1>

            <p className="hero-desc-desktop text-misty-grey/80 font-sans text-base lg:text-lg leading-relaxed mt-10 ml-[15%] lg:ml-[20%] drop-shadow-md max-w-xl text-left border-l border-[#D4AF37]/30 pl-8">
              {desc.split(" ").map((word, i) => (
                <span key={'desc-d-' + i} className="hero-desc-word-desktop inline-block opacity-0 mr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* MOBILE HERO TEXT */}
        <div className="hero-text-container-mobile flex md:hidden absolute inset-0 z-10 flex-col items-center justify-center pointer-events-none px-6">
          {/* Light blur overlay dedicated only to mobile so the bottle remains highly visible */}
          <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-black/80 via-black/30 to-black/80 z-0"></div>

          <div className="hero-logo absolute top-10 left-1/2 -translate-x-1/2 opacity-0 font-sans tracking-[0.4em] text-[#D4AF37] text-sm uppercase z-20 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] hidden md:block">
            Gazzali
          </div>

          <div className="relative z-20 flex flex-col mb-16 items-center drop-shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <h1 className="hero-title-mobile font-['Giomori',_serif] font-medium tracking-wide text-center text-[#D4AF37] leading-[1] flex flex-col items-center">
              <div className="overflow-hidden pt-2 pb-0 px-4 -mx-4 whitespace-nowrap z-20 relative">
                {"Luxury".split("").map((char, i) => (
                  <span key={'m1-' + i} className="hero-char-mobile inline-block opacity-0 text-[4rem] sm:text-[4.75rem]">
                    {char}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden px-8 -mx-8 border-t border-b border-white/10 my-1 whitespace-nowrap z-10 relative">
                {"In Every".split("").map((char, i) => (
                  <span key={'m2-' + i} className="hero-char-mobile inline-block opacity-0 italic text-white/90 text-[3rem] sm:text-[3.75rem] py-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden pt-0 pb-2 px-4 -mx-4 whitespace-nowrap z-0 relative">
                {"Breath".split("").map((char, i) => (
                  <span key={'m3-' + i} className="hero-char-mobile inline-block opacity-0 text-[4.5rem] sm:text-[5.25rem]">
                    {char}
                  </span>
                ))}
              </div>
            </h1>

            <p className="hero-desc-mobile text-misty-grey/90 font-sans text-sm leading-relaxed mt-8 text-center drop-shadow-md max-w-xs">
              {desc.split(" ").map((word, i) => (
                <span key={'desc-m-' + i} className="hero-desc-word-mobile inline-block opacity-0 mr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>

            <Link href="/shop" className="hero-btn-mobile opacity-0 pointer-events-auto mt-8 bg-[#C9A646] text-black font-sans font-semibold py-3.5 px-10 rounded-full text-[15px] tracking-wide hover:bg-[#D4AF37] transition-colors duration-300 shadow-[0_4px_20px_0_rgba(201,166,70,0.3)] flex items-center justify-center">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Universal Scroll Indicator */}
        <div className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 z-20 pointer-events-none">
          <div className="w-[1px] h-16 bg-white/20 overflow-hidden relative">
            <div className="scroll-line w-full h-full bg-[#D4AF37] absolute top-0 -translate-y-full"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCT INFO (NOTES) */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center bg-matte-black">
        {/* Desktop View */}
        <div className="hidden md:flex flex-col justify-center px-16 lg:px-24 py-24 w-full">
          <div className="w-full flex justify-center mb-16 md:mb-24">
            <h2 className="scroll-reveal text-4xl md:text-5xl lg:text-6xl font-['Giomori',_serif] text-[#D4AF37] tracking-wider text-center drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              Unveiling the Scent
            </h2>
          </div>

          <div className="flex flex-row items-center justify-between w-full max-w-7xl mx-auto gap-16">
            <div className="w-1/2 flex justify-center">
              <img
                src="/images/others/bottles.png"
                alt="Unveiling the Scent"
                className="scroll-reveal object-contain max-h-[70vh] drop-shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              />
            </div>

            <div className="w-1/2 flex justify-end">
              <div className="max-w-lg space-y-12 w-full">
                <div className="note-item flex items-start space-x-6">
                  <div className="mt-1 p-3 rounded-full bg-gold-accent-1/10 text-gold-accent-1 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Citrus className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-gold-accent-2 font-serif text-2xl mb-2">Top Notes</h3>
                    <p className="text-misty-grey font-sans text-lg tracking-wide">Bergamot, Grapefruit</p>
                    <p className="text-misty-grey/60 text-sm mt-2">A crisp, luminous opening that awakens the senses instantly.</p>
                  </div>
                </div>

                <div className="note-item flex items-start space-x-6">
                  <div className="mt-1 p-3 rounded-full bg-gold-accent-1/10 text-gold-accent-1 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Flower className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-gold-accent-2 font-serif text-2xl mb-2">Heart Notes</h3>
                    <p className="text-misty-grey font-sans text-lg tracking-wide">Jasmine, Rose</p>
                    <p className="text-misty-grey/60 text-sm mt-2">The sophisticated floral core revealing true elegance.</p>
                  </div>
                </div>

                <div className="note-item flex items-start space-x-6">
                  <div className="mt-1 p-3 rounded-full bg-gold-accent-1/10 text-gold-accent-1 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Trees className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-gold-accent-2 font-serif text-2xl mb-2">Base Notes</h3>
                    <p className="text-misty-grey font-sans text-lg tracking-wide">Oud, Amber, Musk</p>
                    <p className="text-misty-grey/60 text-sm mt-2">A deep, resonating finish that lingers for hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View with Accordion */}
        <div className="md:hidden flex flex-col px-6 py-20 bg-[#0B0B0B] min-h-[80vh]">
          <div className="scroll-reveal mb-12">
            <h2 className="text-3xl font-['Giomori',_serif] text-[#D4AF37] text-center tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Unveiling the Scent
            </h2>
          </div>

          <div className="space-y-4 w-full">
            {scentNotes.map((note, index) => (
              <div
                key={index}
                className={`scroll-reveal border-b border-white/10 transition-all duration-300 ${activeAccordion === index ? 'bg-white/[0.02]' : ''}`}
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  className="w-full flex items-center justify-between py-6 text-left focus:outline-none touch-manipulation"
                >
                  <span className={`text-xl font-['Giomori',_serif] tracking-wide transition-colors duration-300 ${activeAccordion === index ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70'}`}>
                    {note.title}
                  </span>
                  <span className={`text-[#D4AF37] text-xs transition-transform duration-300 ${activeAccordion === index ? 'rotate-0' : 'rotate-0'}`}>
                    {activeAccordion === index ? '▼' : '▶'}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === index ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                >
                  <div className="space-y-2">
                    <p className="text-white font-sans text-base tracking-wide">
                      {note.subtitle}
                    </p>
                    <p className="text-misty-grey/70 font-sans text-sm leading-relaxed">
                      {note.description}
                    </p>
                  </div>
                </div>
                {activeAccordion === index && (
                  <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -bottom-[1px]"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center scroll-reveal">
            <img
              src="/images/others/bottles.png"
              alt="Gazzali Bottles"
              className="w-48 h-auto object-contain drop-shadow-[0_40px_60px_rgba(212,175,55,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: REVIEWS (Redesigned) */}
      <section className="reviews-section relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-matte-black">

        {/* --- DESKTOP REVIEW SECTION --- */}
        <div className="hidden md:flex flex-col items-center w-full">
          {/* Top Center */}
          <div className="flex flex-col items-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-sans font-bold text-white mb-6 tracking-wider">
              <span className="text-gold-accent-1 mr-2 text-3xl font-normal">/</span> Reviews
            </h2>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-[#D4AF37] text-xl">⭐</span>
              <span className="font-bold text-xl text-white">4.9</span>
              <span className="text-misty-grey/80 text-sm tracking-widest uppercase ml-2">(120+ reviews)</span>
            </div>
            <p className="text-misty-grey/60 text-sm tracking-widest uppercase">Trusted by 500+ customers</p>
          </div>

          {/* Middle: 3 review cards */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-6xl px-8 mb-16 scroll-reveal">
            {reviews.slice(0, 3).map((review, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:border-gold-accent-1/50 transition-colors duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-[2px] border-white/10 group-hover:border-[#D4AF37]/50 p-1 mb-5 transition-colors duration-500">
                  <div className="w-full h-full rounded-full bg-[#D4AF37]/20 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=D4AF37&color=000&size=150`} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* Name */}
                <h4 className="text-[#D4AF37] font-sans font-medium tracking-[0.2em] text-sm uppercase mb-3">
                  {review.name}
                </h4>
                {/* Stars */}
                <div className="flex justify-center mb-5 text-[#D4AF37] text-xs">
                  ⭐⭐⭐⭐⭐
                </div>
                {/* Review Text */}
                <p className="text-misty-grey/90 font-serif text-[15px] leading-relaxed mb-8 flex-1 italic relative min-h-[80px] flex items-center justify-center">
                  "{review.text}"
                </p>
                {/* Small Tags */}
                <div className="flex space-x-2 mt-auto flex-wrap justify-center gap-2">
                  {review.tags?.map((tag, tIdx) => (
                    <span key={tIdx} className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] tracking-widest text-[#D4AF37]/80 border border-white/10 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 scroll-reveal">
            <button
              onClick={() => setIsReviewsModalOpen(true)}
              className="px-10 py-4 rounded-full border border-white/20 text-white font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors group flex items-center">
              <span>View All Reviews</span>
            </button>
            <button className="px-10 py-4 rounded-full bg-[#D4AF37] text-black font-sans font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_4px_20px_0_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_0_rgba(212,175,55,0.5)] hover:scale-105">
              Shop This Fragrance
            </button>
          </div>
        </div>

        {/* --- MOBILE REVIEW SECTION --- */}
        <div className="flex md:hidden flex-col items-center w-full max-w-sm mx-auto">
          {/* Top Header */}
          <div className="scroll-reveal flex flex-col items-center mb-8">
            <h2 className="text-2xl font-sans font-bold text-white tracking-[0.2em] mb-2 uppercase">
              <span className="text-gold-accent-1 mr-1 font-normal">/</span> Reviews
            </h2>
            <div className="flex items-center text-xs font-sans text-misty-grey/60 tracking-wider">
              <span className="text-gold-accent-2 mr-1">⭐</span> 4.9 <span className="mx-2 text-white/10">|</span> (120+ reviews)
            </div>
          </div>

          {/* Swipeable Single Card */}
          <div
            className="review-container relative w-full px-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="review-content glass-morphism rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              {/* Decorative Gradient Background */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold-accent-1/5 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Avatar Center Image */}
              <div className="relative mb-6 review-anim-item">
                <div className="w-20 h-20 rounded-full border-2 border-gold-accent-1/30 p-1 bg-black/40">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=D4AF37&color=000&size=150`} alt={reviews[currentReviewIndex].name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* User Identity */}
              <h4 className="review-anim-item text-gold-accent-2 font-sans font-bold tracking-[0.2em] text-xs uppercase mb-1">
                {reviews[currentReviewIndex].name}
              </h4>

              {/* Star Rating in Card */}
              <div className="review-anim-item flex items-center justify-center space-x-1 mb-6 mt-1 text-gold-accent-1 text-[10px]">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>

              {/* Text Paragraph */}
              <p className="review-anim-item text-misty-grey/90 text-base font-serif leading-relaxed italic mb-8 min-h-[100px] flex justify-center items-center px-2">
                "{reviews[currentReviewIndex].text}"
              </p>

              {/* Tags */}
              <div className="review-anim-item flex items-center justify-center flex-wrap gap-2 mb-2">
                {reviews[currentReviewIndex].tags?.map((tag, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-misty-grey/50 text-[9px] px-3 py-1 rounded-full uppercase tracking-widest font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-3 mt-8 mb-10">
            {reviews.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentReviewIndex ? 'w-6 bg-gold-accent-1' : 'w-1.5 bg-white/20'}`}
              ></div>
            ))}
          </div>

          {/* Bottom Buttons */}
          <div className="flex flex-col items-center space-y-3.5 w-full px-6">
            <button
              onClick={() => setIsReviewsModalOpen(true)}
              className="w-full bg-white/5 border border-white/10 text-white tracking-[0.2em] hover:bg-white/10 py-4 rounded-full font-sans text-[10px] transition-all uppercase font-bold backdrop-blur-sm active:scale-[0.98]"
            >
              View All Reviews
            </button>
            <button
              className="w-full bg-gold-gradient text-black tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.3)] py-4 rounded-full font-sans font-bold text-[10px] transition-all uppercase active:scale-[0.98]"
              onClick={() => {
                document.querySelector('.offer-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING + OFFER */}
      <section className="offer-section relative z-10 min-h-screen flex items-center justify-center bg-matte-black overflow-hidden py-24 px-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">

          {/* Image Side */}
          <div className="w-full md:w-1/2 relative group flex justify-center">
            <div className="absolute inset-0 bg-gold-accent-1/10 blur-[100px] rounded-full group-hover:bg-gold-accent-1/20 transition-all duration-700"></div>
            <img
              src="/images/offer/Layer 1.png"
              alt="Gazzali 3 Pcs Combo"
              className="offer-img relative z-10 w-full max-w-lg h-auto object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)] animate-float"
            />
          </div>

          {/* Content Side */}
          <div className="offer-content w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8">
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-sans text-sm tracking-[0.4em] uppercase block mb-4">Exclusive Deal</span>
              <h2 className="text-5xl md:text-7xl font-['Giomori',_serif] text-white leading-tight">
                3 PCS <br className="hidden md:block" /> <span className="text-gold-accent-2">COMBO</span>
              </h2>
            </div>

            <p className="text-misty-grey/80 text-lg max-w-md leading-relaxed hidden md:block">
              Indulge in our most exquisite fragrances. A curated trio of our signature scents, now available at an exclusive price.
            </p>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline space-x-4">
                <span className="text-7xl md:text-9xl font-serif font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">119</span>
                <span className="text-2xl md:text-3xl font-sans font-medium text-gold-accent-1 tracking-widest uppercase">QTR</span>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37] to-transparent mt-2 rounded-full"></div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 py-3 px-8 rounded-full border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <p className="text-misty-grey/60 font-sans text-xs tracking-widest uppercase">Limited stock available</p>
            </div>

            <Link href="/shop" className="group relative px-10 py-5 bg-gold-gradient rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.3)] inline-flex items-center justify-center">
              <span className="relative z-10 font-sans font-bold text-matte-black text-sm tracking-widest uppercase">Grab the Deal</span>
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="scroll-reveal text-4xl md:text-6xl font-serif text-white mb-16 text-center leading-snug">
          Get your signature <br /> <span className="text-gold-accent-2">scent today.</span>
        </h2>

        <Link href="/shop" className="magnetic-btn scroll-reveal group relative px-12 py-6 bg-white rounded-full overflow-hidden cursor-pointer shadow-2xl inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
          <span className="relative z-10 font-bold font-sans text-matte-black text-xl tracking-[0.2em] group-hover:text-white transition-colors duration-300 uppercase">
            buy now
          </span>
        </Link>
      </section>

      {/* SECTION 6: CONTACT FOOTER */}
      <footer className="scroll-reveal relative z-20 w-full p-6 flex justify-between items-center border-t border-white/10 bg-matte-black/90 backdrop-blur-md">
        <a
          href="https://www.instagram.com/gazzali_perfumes/"
          target="_blank"
          rel="noreferrer"
          className="p-3 text-misty-grey hover:text-white transition-colors"
        >
          <Instagram className="w-6 h-6" />
        </a>

        <p className="text-misty-grey/50 text-xs font-sans tracking-widest uppercase hidden md:block">
          © 2026 Gazzali Perfumes
        </p>

        <a
          href="https://wa.me/97431697979"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center space-x-3 p-3 text-misty-grey hover:text-green-400 transition-colors"
        >
          <span className="font-sans text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
            Chat on WhatsApp
          </span>
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
            <Phone className="w-6 h-6 relative z-10" />
          </div>
        </a>
      </footer>

      {/* REVIEWS MODAL */}
      {isReviewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-modal-backdrop">
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl p-8 overflow-y-auto flex flex-col animate-modal-enter">
            <button
              onClick={() => setIsReviewsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-misty-grey hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-sans font-bold text-white mb-8 tracking-wider text-center">
              All <span className="text-[#D4AF37]">Reviews</span>
            </h2>

            <div className="flex flex-col gap-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-16 h-16 rounded-full border-[2px] border-white/10 shrink-0 p-0.5">
                    <div className="w-full h-full rounded-full bg-[#D4AF37]/20 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=D4AF37&color=000&size=100`} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#D4AF37] font-sans font-medium tracking-[0.1em] text-sm uppercase mb-1">
                      {review.name}
                    </h4>
                    <div className="flex space-x-1 mb-2 text-[#D4AF37] text-[10px]">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <p className="text-misty-grey/90 font-serif text-sm leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
