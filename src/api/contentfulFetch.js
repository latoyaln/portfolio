// src/ContentfulContext.js
import React, { createContext, useState, useEffect } from 'react';
import client from './contentful';

export const ContentfulContext = createContext();

export const ContentfulProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContentType = async (contentType) => {
    try {
      const response = await client.getEntries({
        content_type: contentType,
      });
      return response.items;
    } catch (error) {
      console.error(`Error fetching ${contentType} data from Contentful:`, error);
    }
  };

  const fetchPageData = async (pageId) => {
    try {
      const pageResponse = await client.getEntries({
        content_type: 'page',
        'fields.slug': pageId, 
      });

      const page = pageResponse.items[0];
      if (!page) {
        throw new Error('Page not found');
      }

      const pageData = {
        page: page,
        content: {},
      };

      const components = page.fields.components || [];

      for (const reference of components) {
        const contentType = reference.sys.contentType.sys.id;
        if (contentType === 'itemCollection') {
          const itemCollectionData = await fetchContentType('itemCollection');
          pageData.content.itemCollection = itemCollectionData;
        }
      }

      setData((prevData) => ({
        ...prevData,
        [pageId]: pageData,
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching page data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData('notes'); 
  }, []);

  return (
    <ContentfulContext.Provider value={{ data, loading, fetchPageData }}>
      {children}
    </ContentfulContext.Provider>
  );
};
