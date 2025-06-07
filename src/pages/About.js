import React, { useEffect, useContext, useRef, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  useEffect(() => {
    if (!data[dataKey] && !data[pageId]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale, dataKey]);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out"
        }
      );
    }

    if (sectionRef.current && titleRef.current && rightColumnRef.current && imageRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1
        }
      });

      tl.to(titleRef.current, {
        opacity: 0,
        y: -100,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(rightColumnRef.current, {
        width: "100%",
        duration: 0.6,
        ease: "power2.inOut"
      }, "-=0.2")
      .to(imageRef.current, {
        height: "100vh",
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.3");
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const pageData = data[dataKey] || data[pageId];
  
  const aboutCard = pageData?.page?.fields?.components?.find(
    (component) => component.fields?.internalName === 'about'
  );

  const serviceItemCollection = pageData?.content?.itemCollection?.items?.find(
    (item) => item.fields?.internalName === 'About Me'
  )?.fields?.components?.find(
    (comp) =>
      comp.sys?.contentType?.sys?.id === 'itemCollection' &&
      comp.fields?.internalName?.toLowerCase().includes('service')
  );

  const services = serviceItemCollection?.fields?.components || [];

  const title = currentLocale === 'nl' ? 'Over Mij' : 'About Me';
  const contactText = currentLocale === 'nl' ? 'Contact' : 'Contact';

  return (
    <div className="relative">
      <section ref={sectionRef} className="relative min-h-screen bg-daylight overflow-hidden">
        <div className="container mx-auto px-6 py-32">
          <div className="flex h-screen items-center">
            <div ref={titleRef} className="w-4/5 pr-16">
              <h1 className="text-[12vw] font-headings text-midnight leading-none">
                {aboutCard?.fields?.title || title}
              </h1>
            </div>

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
          </div>
        </div>

        <div className="h-[100vh]"></div>
      </section>

      <section className="min-h-[50vh] bg-white flex items-center justify-center">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-3xl md:text-4xl font-headings text-midnight text-center leading-relaxed italic">
              "{aboutCard?.fields?.paragraph}"
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-daylight py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-0">
            {services.map((service, idx) => (
              <div
                key={service.sys.id}
                className="border-b border-midnight/10 last:border-b-0"
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 items-center cursor-pointer py-6 group"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  onMouseEnter={() => setOpenIdx(idx)}
                  onMouseLeave={() => setOpenIdx(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIdx(openIdx === idx ? null : idx);
                    }
                  }}
                  aria-expanded={openIdx === idx}
                  aria-controls={`service-content-${idx}`}
                >
                  <div className="flex items-center h-full pl-4 sm:pl-12 justify-start sm:justify-start">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col items-start justify-center h-full pr-4 sm:pr-12 mt-4 sm:mt-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-headings text-midnight font-bold text-left transition-colors duration-200 group-hover:text-midnight/80">
                      {service.fields?.title}
                    </h3>
                    <div
                      id={`service-content-${idx}`}
                      className={`transition-all duration-300 ease-in-out w-full ${
                        openIdx === idx ? 'mt-2 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-midnight text-base md:text-lg">
                        {service.fields?.textParagraph}
                      </p>
                      {openIdx === idx && (
                        <a
                          href="mailto:l.n.design@hotmail.com"
                          className="inline-block mt-4 px-6 py-2 bg-midnight text-daylight rounded-lg font-bold shadow hover:bg-midnight/90 transition-colors duration-200"
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
    </div>
  );
};

export default About;