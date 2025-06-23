import React, { useEffect, useContext, useRef, useState, useCallback } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutMe from '../components/aboutMe';
import GlassyValuesSection from '../components/GlassyValuesSection';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale } = useLocalization();
  const pageId = 'about-lndesign';
  const dataKey = `${pageId}-${currentLocale}`;
  const titleRef = useRef(null); 
  const rightColumnRef = useRef(null);
  const imageRef = useRef(null);
  const sectionRef = useRef(null);
  const [openIdx, setOpenIdx] = useState(null);
  const aboutMeRef = useRef(null);
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const contentRef = useRef(null);
  const subjectRef = useRef(null);
  const paragraphRef = useRef(null);
  const textLinesRef = useRef([]);
  const paragraphLinesRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchPageData(pageId, currentLocale);
  }, [fetchPageData, pageId, currentLocale]);

  const pageData = data[dataKey] || data[pageId];

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }

    if (paragraphRef.current && aboutCard?.fields?.paragraph) {
      const text = aboutCard.fields.paragraph;
      const words = text.split(' ');
      // Reduced line breaks for mobile - more words per line
      const wordsPerLine = isMobile ? 10 : 11;
      const lines = [];
      for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(' '));
      }
      paragraphRef.current.innerHTML = lines.map((line, index) =>
        `<p class="text-sm sm:text-base md:text-xl lg:text-2xl font-headings text-midnight leading-relaxed opacity-0 transform translate-y-4" data-line="${index}">${line}</p>`
      ).join('');
      paragraphLinesRef.current = paragraphRef.current.querySelectorAll('[data-line]');
    }

    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0 });
    }

    // Mobile scroll animations
    if (isMobile && sectionRef.current && titleRef.current && rightColumnRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400vh", // Extended scroll distance for mobile
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Title fade out and content fade in - matching desktop timing
            if (progress <= 0.3) {
              const titleProgress = progress / 0.3;
              gsap.set(titleRef.current, {
                opacity: 1 - titleProgress,
                y: -(titleProgress * 50),
                scale: 1 - (titleProgress * 0.1)
              });
              gsap.set(contentRef.current, { opacity: 0 });
            } else {
              gsap.set(titleRef.current, { opacity: 0, y: -50, scale: 0.9 });
              const contentProgress = (progress - 0.3) / 0.7;
              gsap.set(contentRef.current, { opacity: 1 });
              
              // Animate paragraph lines over the full remaining scroll
              if (paragraphLinesRef.current.length > 0) {
                const totalLines = paragraphLinesRef.current.length;
                paragraphLinesRef.current.forEach((line, index) => {
                  const lineStart = index / totalLines;
                  const lineEnd = (index + 1) / totalLines;
                  if (contentProgress >= lineStart) {
                    const lineProgress = Math.min(1, (contentProgress - lineStart) / Math.max(0.05, lineEnd - lineStart));
                    gsap.set(line, {
                      opacity: lineProgress,
                      y: 16 - (lineProgress * 16),
                      scale: 0.95 + (lineProgress * 0.05)
                    });
                  } else {
                    gsap.set(line, { opacity: 0, y: 16, scale: 0.95 });
                  }
                });
              }
            }
          }
        }
      });

      // Mobile image scaling animation
      tl.to(imageRef.current, {
        height: "40vh",
        duration: 1,
        ease: "power2.inOut"
      }, 0.3);

    } 
    // Desktop animations
    else if (!isMobile && sectionRef.current && titleRef.current && rightColumnRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress <= 0.4) {
              const titleProgress = progress / 0.4;
              gsap.set(titleRef.current, {
                opacity: 1 - titleProgress,
                y: -(titleProgress * 100),
                scale: 1 - (titleProgress * 0.2)
              });
              gsap.set(contentRef.current, { opacity: 0 });
            } else {
              gsap.set(titleRef.current, { opacity: 0, y: -100, scale: 0.8 });
              const contentProgress = (progress - 0.4) / 0.6;
              gsap.set(contentRef.current, { opacity: 1 });
              if (paragraphLinesRef.current.length > 0) {
                const totalLines = paragraphLinesRef.current.length;
                paragraphLinesRef.current.forEach((line, index) => {
                  const lineStart = index / totalLines;
                  const lineEnd = (index + 1) / totalLines;
                  if (contentProgress >= lineStart) {
                    const lineProgress = Math.min(1, (contentProgress - lineStart) / (lineEnd - lineStart));
                    gsap.set(line, {
                      opacity: lineProgress,
                      y: 16 - (lineProgress * 16),
                      scale: 0.95 + (lineProgress * 0.05)
                    });
                  } else {
                    gsap.set(line, { opacity: 0, y: 16, scale: 0.95 });
                  }
                });
              }
            }
          }
        }
      });

      tl.to(rightColumnRef.current, {
        width: "100%",
        duration: 0.6,
        ease: "power2.inOut"
      }, 0.4).to(imageRef.current, {
        height: "100vh",
        duration: 0.6,
        ease: "power2.inOut"
      }, 0.4);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [pageData, isMobile]);

  const aboutCard = pageData?.page?.fields?.components?.find(
    (component) => component.fields?.internalName === 'about'
  );

  const serviceItemCollection = pageData?.content?.itemCollection?.items?.find(
    (item) => item.fields?.internalName === 'About Me'
  )?.fields?.components?.find(
    (comp) => comp.sys?.contentType?.sys?.id === 'itemCollection' &&
      comp.fields?.internalName?.toLowerCase().includes('service')
  );

  const services = serviceItemCollection?.fields?.components || [];

  const valuesItemCollection = pageData?.content?.itemCollection?.items?.find(
    (item) => item.fields?.internalName === 'About Me'
  )?.fields?.components?.find(
    (comp) => comp.sys?.contentType?.sys?.id === 'itemCollection' &&
      comp.fields?.internalName?.toLowerCase().includes('values')
  );

  const handleServiceClick = useCallback((idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  }, [openIdx]);

  const handleKeyDown = useCallback((e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenIdx(openIdx === idx ? null : idx);
    }
  }, [openIdx]);

  const title = currentLocale === 'nl' ? 'Over Mij' : 'About Me';
  const contactText = currentLocale === 'nl' ? 'Contact' : 'Contact';

  return (
    <div className="relative">
      <section ref={sectionRef} className="relative min-h-screen bg-daylight overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className={`flex ${isMobile ? 'flex-col' : 'h-screen'} items-center ${isMobile ? 'gap-4' : ''}`}>
            <div ref={titleRef} className={`${isMobile ? 'w-full text-center' : 'w-4/5 pr-16'}`}>
              <h1 className={`${isMobile ? 'text-[15vw] sm:text-[12vw]' : 'text-[12vw]'} font-headings text-midnight leading-none`}>
                {aboutCard?.fields?.title || title}
              </h1>
            </div>

            {isMobile && (
              <div ref={rightColumnRef} className="w-full flex flex-col">
                <div ref={imageRef} className="relative h-[50vh] sm:h-[60vh] mb-8 overflow-hidden rounded-2xl shadow-2xl">
                  {aboutCard?.fields?.image?.fields?.file?.url && (
                    <>
                      <img
                        src={`https:${aboutCard.fields.image.fields.file.url}`}
                        alt={aboutCard.fields.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  )}
                </div>
                {/* Mobile paragraph content positioned below image */}
                <div ref={contentRef} className="w-full">
                  {aboutCard?.fields?.paragraph && (
                    <div ref={paragraphRef} className="space-y-3 px-2"></div>
                  )}
                </div>
              </div>
            )}

            {!isMobile && (
              <div ref={rightColumnRef} className="w-1/5 flex flex-col">
                <div ref={imageRef} className="relative h-[40vh] mb-8 overflow-hidden rounded-2xl shadow-2xl">
                  {aboutCard?.fields?.image?.fields?.file?.url && (
                    <>
                      <img
                        src={`https:${aboutCard.fields.image.fields.file.url}`}
                        alt={aboutCard.fields.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop paragraph content - keep original positioning */}
        {!isMobile && (
          <div ref={contentRef} className="fixed inset-0 pointer-events-none">
            <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
              <div className="flex h-screen items-center">
                <div className="w-1/2 pr-8">
                  {aboutCard?.fields?.paragraph && (
                    <div ref={paragraphRef} className="space-y-3"></div>
                  )}
                </div>
                <div className="w-1/2" />
              </div>
            </div>
          </div>
        )}
      </section>

      <GlassyValuesSection 
        pageData={pageData} 
        currentLocale={currentLocale}
      />

      {/* Services Section - Only show expandable cards without header */}
      <section className="bg-daylight">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-0">
            {services.map((service, idx) => (
              <div
                key={service.sys.id}
                className="border-b border-midnight/10 last:border-b-0"
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 items-center cursor-pointer py-4 md:py-6 group"
                  onClick={() => handleServiceClick(idx)}
                  onMouseEnter={() => setOpenIdx(idx)}
                  onMouseLeave={() => setOpenIdx(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  aria-expanded={openIdx === idx}
                  aria-controls={`service-content-${idx}`}
                >
                  <div className="flex items-center h-full pl-4 sm:pl-12 justify-start sm:justify-start">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col items-start justify-center h-full pr-4 sm:pr-12 mt-4 sm:mt-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-headings text-midnight font-bold text-left transition-colors duration-200 group-hover:text-midnight/80">
                      {service.fields?.title}
                    </h3>
                    <div
                      id={`service-content-${idx}`}
                      className={`transition-all duration-300 ease-in-out w-full ${
                        openIdx === idx ? 'mt-2 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm md:text-base lg:text-lg text-midnight">
                        {service.fields?.textParagraph}
                      </p>
                      {openIdx === idx && (
                        <a
                          href="mailto:l.n.design@hotmail.com"
                          className="inline-block mt-4 px-4 md:px-6 py-2 bg-midnight text-daylight rounded-lg font-bold shadow hover:bg-midnight/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-midnight focus:ring-offset-2"
                          aria-label={currentLocale === 'nl' ? 'Contact opnemen' : 'Get in touch'}
                        >
                          {contactText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={aboutMeRef} 
        className="relative bg-white"
        style={{
          transition: 'background-color 1000ms ease-in-out'
        }}
      >
        <style jsx>{`
          .hide-about-header .text-center {
            display: none;
          }
        `}</style>
        <div className="hide-about-header">
          <AboutMe />
        </div>
      </section>
    </div>
  );
};

export default About;