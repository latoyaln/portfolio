import React, { useEffect, useContext, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const AboutMe = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection =
    data?.[pageId]?.content?.itemCollection?.items ||
    data?.[pageId]?.content?.itemCollection ||
    [];

  const aboutMe = itemCollection.find(
    (item) => item.fields?.internalName === 'About Me'
  );

  // Get the intro (first component)
  const aboutHeader = aboutMe?.fields?.components?.find(
    (comp) => comp.fields?.internalName?.toLowerCase().includes('about')
  );

  // Get the service item collection (second component)
  const serviceItemCollection = aboutMe?.fields?.components?.find(
    (comp) =>
      comp.sys?.contentType?.sys?.id === 'itemCollection' &&
      comp.fields?.internalName?.toLowerCase().includes('service')
  );

  // Get the array of service components
  const services = serviceItemCollection?.fields?.components || [];

  return (
    <section className="container mx-auto my-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-h2 font-headings text-midnight mb-2">
          {aboutHeader?.fields?.title || 'About Me'}
        </h2>
        <p className="text-body text-midnight max-w-xl mx-auto whitespace-pre-line">
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
              className="grid grid-cols-1 sm:grid-cols-2 items-center cursor-pointer py-6 group"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              onMouseEnter={() => setOpenIdx(idx)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              {/* Number on the left */}
              <div className="flex items-center h-full pl-4 sm:pl-12 justify-start sm:justify-start">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-midnight/10 select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              {/* Title on the right (left-aligned) */}
              <div className="flex flex-col items-start justify-center h-full pr-4 sm:pr-12 mt-4 sm:mt-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-headings text-midnight font-bold text-left transition-colors duration-200 group-hover:text-midnight/80">
                  {service.fields?.title}
                </h3>
                {/* Expandable paragraph */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full ${
                    openIdx === idx ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'
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
                      Contact 
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