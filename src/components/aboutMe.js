import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';

const AboutMe = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale } = useLocalization();
  const pageId = 'home';
  const dataKey = `${pageId}-${currentLocale}`;
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    if (!data[dataKey] && !data[pageId]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale, dataKey]);

  const pageData = data[dataKey] || data[pageId];
  
  const itemCollection = pageData?.content?.itemCollection?.items || pageData?.content?.itemCollection || [];

  const aboutMe = itemCollection.find(
    (item) => item.fields?.internalName === 'About Me'
  );

  const aboutHeader = aboutMe?.fields?.components?.find(
    (comp) => comp.fields?.internalName?.toLowerCase().includes('about')
  );

  const serviceItemCollection = aboutMe?.fields?.components?.find(
    (comp) =>
      comp.sys?.contentType?.sys?.id === 'itemCollection' &&
      comp.fields?.internalName?.toLowerCase().includes('service')
  );

  const services = serviceItemCollection?.fields?.components || [];

  const handleServiceClick = useCallback((idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  }, [openIdx]);

  const handleKeyDown = useCallback((e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServiceClick(idx);
    }
  }, [handleServiceClick]);

  return (
    <section className="container mx-auto my-12 md:my-20 px-4 md:px-6" aria-labelledby="about-title">
      <div className="text-center mb-8 md:mb-12">
        <h2 id="about-title" className="text-2xl md:text-h2 font-headings text-midnight mb-2">
          {aboutHeader?.fields?.title || (currentLocale === 'nl' ? 'Over Mij' : 'About Me')}
        </h2>
        <p className="text-base md:text-body text-midnight max-w-xl mx-auto whitespace-pre-line">
          {aboutHeader?.fields?.textParagraph}
        </p>
      </div>
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
                      {currentLocale === 'nl' ? 'Contact' : 'Contact'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutMe;