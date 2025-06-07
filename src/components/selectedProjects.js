import React, { useEffect, useContext, useRef, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SelectedProjects = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';
  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection =
    data?.[pageId]?.content?.itemCollection?.items ||
    data?.[pageId]?.content?.itemCollection ||
    [];

  const selectedProjects = itemCollection.find(
    (item) => item.fields?.internalName === 'SelectedProjects'
  );

  const projects = Array.isArray(selectedProjects?.fields?.components)
    ? selectedProjects.fields.components.filter(
        (project, idx) => idx !== 0 && project.fields?.coverImage?.fields?.file?.url
      )
    : [];

  const visibleProjects = projects.slice(0, 3);

  // Manual navigation function
  const handleNavClick = (targetIndex) => {
    setActiveIndex(targetIndex);
    
    // Scroll to the appropriate position
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const cardHeight = window.innerHeight * 0.8; // Approximate card scroll distance
    const targetScrollY = sectionTop + (targetIndex * cardHeight);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!visibleProjects.length || !containerRef.current || !sectionRef.current) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    // Kill existing ScrollTriggers for this component
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars?.id?.includes('card-stack')) {
        trigger.kill();
      }
    });

    // Set initial styles for all cards
    cards.forEach((card, index) => {
      // Add random rotation for more natural look
      const rotation = gsap.utils.random(-3, 3);
      
      gsap.set(card, {
        rotation: rotation,
        transformOrigin: "center center"
      });

      // Add subtle floating animation
      gsap.to(card, {
        y: '+=3',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: gsap.utils.random(2, 3),
        delay: index * 0.2
      });
    });

    // Create ScrollTrigger for each card
    cards.forEach((card, index) => {
      const isLastCard = index === cards.length - 1;
      
      ScrollTrigger.create({
        id: `card-stack-${index}`,
        trigger: card,
        start: 'top 90%',
        end: 'top 15%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Scale animation - cards get smaller as they move up
          const scale = gsap.utils.interpolate(1.05, 0.85, progress);
          
          gsap.to(card, {
            scale: scale,
            duration: 0.1,
            overwrite: 'auto'
          });
        },
        onEnter: () => {
          setActiveIndex(index);
        },
        onEnterBack: () => {
          setActiveIndex(index);
        }
      });
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.id?.includes('card-stack')) {
          trigger.kill();
        }
      });
    };
  }, [visibleProjects.length]);

  if (!visibleProjects.length) {
    return <div className="text-center text-midnight">No projects found.</div>;
  }

  return (
    <>
      {/* Section Header - Fixed position */}
      <div className="bg-daylight py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-h2 font-headings text-midnight mb-2">
            {selectedProjects?.fields?.components?.[0]?.fields?.title || 'Selected Projects'}
          </h2>
          <p className="text-lg text-midnight max-w-2xl mx-auto mb-8">
            {selectedProjects?.fields?.components?.[0]?.fields?.textParagraph || ''}
          </p>
          

        </div>
      </div>

      {/* Cards Section */}
      <section 
        ref={sectionRef}
        className="relative bg-daylight"
        style={{ height: `${visibleProjects.length * 80}vh` }}
      >
        {/* Navigation Buttons - Vertical on the left */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
          {visibleProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? 'bg-midnight shadow-lg scale-125' 
                  : 'bg-midnight/30 hover:bg-midnight/60'
              }`}
              title={`Project ${idx + 1}`}
            />
          ))}
        </div>
        <div 
          ref={containerRef}
          className="relative w-full"
        >
          {visibleProjects.map((project, idx) => (
            <div
              key={`${project.fields.title}-${idx}`}
              ref={el => (cardRefs.current[idx] = el)}
              className="sticky w-full max-w-4xl mx-auto px-4"
              style={{
                top: '15vh',
                height: '70vh',
                zIndex: idx + 1
              }}
            >
              <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow duration-300">
                <div className="relative w-full h-full">
                  <img
                    src={project.fields.coverImage.fields.file.url}
                    alt={project.fields.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                      {project.fields.title}
                    </h3>
                    {project.fields.description && (
                      <p className="text-white/90 text-base leading-relaxed">
                        {project.fields.description}
                      </p>
                    )}
                  </div>
              
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SelectedProjects;