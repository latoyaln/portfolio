import React, { useEffect, useContext, useRef, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocalization } from '../contexts/LocalizationContext';
import ReactMarkdown from 'react-markdown';
import CTA from '../components/cta';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale, switchLanguage, isEnglish } = useLocalization();
  const pageId = 'home';
  const dataKey = `${pageId}-${currentLocale}`;
  const [selectedProject, setSelectedProject] = useState(null);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);
  const projectsRef = useRef([]);
  const introRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!data[dataKey] && !data[pageId]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale, dataKey]);

  useEffect(() => {
    if (introRef.current) {
      gsap.fromTo(introRef.current.children, 
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }

    if (projectsRef.current.length > 0) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      projectsRef.current.forEach((project, index) => {
        if (project) {
          const imageElement = project.querySelector('.project-image');
          const contentElement = project.querySelector('.project-content');
          
          // Set initial state
          gsap.set([imageElement, contentElement], {
            opacity: 0,
            y: 100
          });

          // Animate on scroll
          gsap.to([imageElement, contentElement], {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top bottom-=200",
              end: "top center",
              toggleActions: "play none none reverse"
            }
          });
        }
      });

      if (progressBarRef.current && containerRef.current) {
        const projectsContainer = containerRef.current.querySelector('.bg-daylight');
        const lastProject = projectsRef.current[projectsRef.current.length - 1];
        
        ScrollTrigger.create({
          trigger: projectsContainer,
          start: "top top",
          end: () => `bottom bottom`,
          endTrigger: lastProject,
          pin: false,
          onUpdate: (self) => {
            gsap.to(progressBarRef.current, {
              width: `${self.progress * 100}%`,
              duration: 0.1,
              ease: "none"
            });
          }
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [projectsRef.current.length]);

  useEffect(() => {
    if (selectedProject && modalRef.current) {
      gsap.fromTo(modalRef.current,
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out"
        }
      );
    }
  }, [selectedProject]);

  const pageData = data[dataKey] || data[pageId];
  const itemCollection = pageData?.content?.itemCollection?.items || pageData?.content?.itemCollection || [];
  const projectsSection = itemCollection.find(
    (item) => item.fields?.internalName === 'SelectedProjects'
  );

  const projects = Array.isArray(projectsSection?.fields?.components)
    ? projectsSection.fields.components.filter(
        (project) => project.fields?.coverImage?.fields?.file?.url
      )
    : [];

  const title = currentLocale === 'nl' ? 'Projecten' : 'Projects';
  const subtitle = currentLocale === 'nl' 
    ? 'Een collectie van mijn werk, die ontwerpdenken, technische expertise en creatief probleemoplossen laat zien in verschillende digitale ervaringen.'
    : 'A collection of my work, showcasing design thinking, technical expertise, and creative problem-solving across various digital experiences.';
  const viewProject = currentLocale === 'nl' ? 'Bekijk Project' : 'View Project';
  const projectOverview = currentLocale === 'nl' ? 'Project Overzicht' : 'Project Overview';
  const projectDetails = currentLocale === 'nl' ? 'Project Details' : 'Project Details';

  const getLocalizedContent = (project) => {
    const localizedFields = project.fields[currentLocale === 'nl' ? 'nl' : 'en'] || {};
    return {
      intro: localizedFields.intro || project.fields.intro || subtitle,
      paragraph: localizedFields.paragraph || project.fields.paragraph || "No detailed description available.",
      title: localizedFields.title || project.fields.internalName,
      slug: localizedFields.slug || project.fields.slug
    };
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={() => switchLanguage(isEnglish ? 'nl' : 'en-US')}
          className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          {isEnglish ? 'NL' : 'EN'}
        </button>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gray-200 z-10">
        <div 
          ref={progressBarRef}
          className="h-full bg-black"
          style={{ width: '0%' }}
        />
      </div>

      <div className="bg-daylight">
        <div ref={introRef} className="container mx-auto px-6 pb-5 pt-16">
          <div className="text-center space-y-8">
            <h2 className="text-h2 font-headings text-midnight mb-2">
              {title}
            </h2>
            <p className="text-body text-midnight max-w-3xl mx-auto">
              {subtitle}
            </p>
            <div className="w-24 h-1 bg-midnight mx-auto"></div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={project.sys.id}
                ref={(el) => (projectsRef.current[index] = el)}
                className="min-h-screen flex items-center py-20"
              >
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full ${!isEven ? 'md:direction-reverse' : ''}`}>
                  <div 
                    className={`project-image relative group cursor-pointer ${!isEven ? 'md:order-2' : 'md:order-1'}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      {project.fields.coverImage?.fields?.file?.url && (
                        <img
                          src={project.fields.coverImage.fields.file.url}
                          alt={project.fields.internalName}
                          className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500" />
                    </div>
                    <div className="absolute bottom-4 left-4 p-4 bg-white bg-opacity-90 rounded-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h2 className="text-2xl font-bold text-midnight">
                        {getLocalizedContent(project).title}
                      </h2>
                    </div>
                  </div>

                  <div className={`project-content space-y-6 ${!isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-midnight/60 uppercase tracking-wider">
                        {currentLocale === 'nl' ? 'Project' : 'Project'} {String(index + 1).padStart(2, '0')}
                      </h3>
                      <h2 className="text-h2 font-headings text-midnight leading-tight">
                        {getLocalizedContent(project).title}
                      </h2>
                    </div>
                    
                    <div className="w-16 h-1 bg-midnight"></div>
                    
                    <p className="text-body text-midnight/80 leading-relaxed">
                      {getLocalizedContent(project).intro}
                    </p>
                    
                    <div className="pt-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="group text-midnight text-lg font-medium border-b-2 border-midnight pb-1 hover:border-midnight/60 transition-all duration-300"
                      >
                        <span className="mr-2">{viewProject}</span>
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-xl w-full h-full max-w-[2000px] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-full">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 z-20 text-midnight hover:text-midnight/60 transition-colors duration-300"
              >
                <span className="text-4xl">×</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="relative h-[50vh] md:h-full">
                  {selectedProject.fields?.coverImage?.fields?.file?.url && (
                    <img
                      src={selectedProject.fields.coverImage.fields.file.url}
                      alt={selectedProject.fields?.internalName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-8 md:p-16 overflow-y-auto">
                  <div className="max-w-2xl mx-auto space-y-12">
                      <h2 className="text-h2 font-headings text-midnight mb-4">
                        {getLocalizedContent(selectedProject).title}
                      </h2>
                    
                    <div className="w-16 h-1 bg-midnight"></div>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-headings text-midnight mb-4">{projectOverview}</h3>
                        <p className="text-body text-midnight/80">
                          {getLocalizedContent(selectedProject).intro}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-headings text-midnight mb-4">{projectDetails}</h3>
                        <div className="text-body text-midnight/80 prose prose-lg max-w-none">
                          <ReactMarkdown>
                            {getLocalizedContent(selectedProject).paragraph}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative z-0">
        <CTA />
      </section>
    </div>
  );
};

export default Projects;