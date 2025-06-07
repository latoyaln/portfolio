import React, { createContext, useState, useEffect } from 'react';
import client from './contentful';

export const ContentfulContext = createContext();

export const ContentfulProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContentType = async (contentType, locale = 'nl') => {
    try {
      const response = await client.getEntries({
        content_type: contentType,
        locale: locale,
        include: 2, 
      });
      return response.items;
    } catch (error) {
      console.error(`Error fetching ${contentType} data from Contentful:`, error);
      setError(error);
      return [];
    }
  };

  const fetchPageData = async (pageId, locale = 'nl') => {
    try {
      const pageResponse = await client.getEntries({
        content_type: 'page',
        'fields.slug': pageId,
        locale: locale,
        include: 2, 
      });

      const page = pageResponse.items[0];
      if (!page) {
        throw new Error(`Page not found: ${pageId}`);
      }

      const pageData = {
        page: page,
        content: {},
      };

      const components = page.fields.components || [];

      for (const reference of components) {
        const contentType = reference.sys.contentType.sys.id;
        if (contentType === 'itemCollection') {
          const itemCollectionData = await fetchContentType('itemCollection', locale);
          pageData.content.itemCollection = itemCollectionData;
        }
      }

      // Store data with both the localized key and the simple pageId key for backwards compatibility
      const dataKey = `${pageId}-${locale}`;
      setData((prevData) => ({
        ...prevData,
        [dataKey]: pageData,
        [pageId]: pageData, 
      }));

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching page data:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchPageData('home', 'nl'),
      fetchPageData('projects', 'nl'),
      fetchPageData('about-lndesign', 'nl')
    ]).catch(error => {
      console.error('Error during initial data fetch:', error);
      setError(error);
    });
  }, []);

  return (
    <ContentfulContext.Provider value={{ data, loading, error, fetchPageData }}>
      {children}
    </ContentfulContext.Provider>
  );
};