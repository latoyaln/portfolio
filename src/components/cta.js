import React, { useEffect, useContext } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const CTA = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection =
    data?.[pageId]?.content?.itemCollection?.items ||
    data?.[pageId]?.content?.itemCollection ||
    [];

  const ctaSection = itemCollection.find(
    (item) => item.fields?.internalName === 'CTA'
  );

  const ctaComponent = ctaSection?.fields?.components?.[0];

  if (!ctaComponent) return null;

  return (
    <section className="relative overflow-hidden bg-midnight py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-daylight/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-daylight/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-daylight mb-6">
            {ctaComponent.fields?.title}
          </h2>
          <p className="text-lg md:text-xl text-daylight/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaComponent.fields?.textParagraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:l.n.design@hotmail.com"
              className="inline-flex items-center px-8 py-4 bg-daylight text-midnight rounded-full font-bold shadow-lg hover:bg-daylight/90 transition-all duration-300 transform hover:scale-105"
            >
              Get in touch
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/latoyanijmeijer"
              className="inline-flex items-center px-8 py-4 border-2 border-daylight text-daylight rounded-full font-bold hover:bg-daylight/10 transition-all duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
