import React, { useState, useEffect, useContext } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const AboutMe = () => {
     const { data, fetchPageData } = useContext(ContentfulContext);
      const pageId = 'home';
    
        useEffect(() => {
          if (!data[pageId]) {
            fetchPageData(pageId);
          }
        }, [data, fetchPageData, pageId]);
      
        const itemCollection =
          data[pageId].content.itemCollection?.items ||
          data[pageId].content.itemCollection ||
          [];
      
        const aboutMe = itemCollection.find(
          (item) => item.fields.internalName === 'About Me'
        );

        const aboutHeader = aboutMe?.fields.components?.[0];
        return (
            <section className="container mx-auto my-20 px-6">
            <h2 className="text-h2 font-headings text-midnight mb-2">
              {aboutHeader?.fields?.title}
            </h2>
            <p className="text-body text-midnight mb-10">
              {aboutHeader?.fields?.textParagraph}
            </p>
            </section>
          
          );
        };
        
        export default AboutMe;
