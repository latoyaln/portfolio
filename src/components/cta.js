import React, { useEffect, useContext, useCallback } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';

const CTA = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale } = useLocalization();
  const pageId = 'home';
  const dataKey = `${pageId}-${currentLocale}`;

  useEffect(() => {
    if (!data[dataKey] && !data[pageId]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale, dataKey]);

  const pageData = data[dataKey] || data[pageId];

  const itemCollection = pageData?.content?.itemCollection?.items || pageData?.content?.itemCollection || [];

  const ctaSection = itemCollection.find(
    (item) => item.fields?.internalName === 'CTA'
  );

  const ctaComponent = ctaSection?.fields?.components?.[0];

  const handleEmailClick = useCallback(() => {
    window.location.href = 'mailto:l.n.design@hotmail.com';
  }, []);

  const handleLinkedInClick = useCallback(() => {
    window.open('https://www.linkedin.com/in/latoyanijmeijer', '_blank', 'noopener,noreferrer');
  }, []);

  if (!ctaComponent) return null;

  return (
    <section className="relative overflow-hidden bg-midnight py-16 md:py-24" aria-labelledby="cta-title">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-daylight/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-daylight/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-title" className="text-2xl md:text-h2 font-headings text-daylight mb-2">
            {ctaComponent.fields?.title}
          </h2>
          <p className="text-base md:text-lg text-daylight/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaComponent.fields?.textParagraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleEmailClick}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-daylight text-midnight rounded-full font-bold shadow-lg hover:bg-daylight/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-daylight focus:ring-offset-2 focus:ring-offset-midnight"
              aria-label={currentLocale === 'nl' ? 'Neem contact op via e-mail' : 'Get in touch via email'}
            >
              {currentLocale === 'nl' ? 'Neem contact op' : 'Get in touch'}
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </button>
            <button
              onClick={handleLinkedInClick}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 border-2 border-daylight text-daylight rounded-full font-bold hover:bg-daylight/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-daylight focus:ring-offset-2 focus:ring-offset-midnight"
              aria-label={currentLocale === 'nl' ? 'Bekijk LinkedIn profiel' : 'View LinkedIn profile'}
            >
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;