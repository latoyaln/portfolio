import React, { useContext, useEffect } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const Header = () => {
  const pageId = 'home';
  const { data, loading, fetchPageData } = useContext(ContentfulContext);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  if (loading || !data[pageId]) return null;

  const itemCollection =
    data[pageId].content.itemCollection?.items ||
    data[pageId].content.itemCollection ||
    [];

  const headerSection = itemCollection.find(
    (item) => item.fields.internalName === 'Header'
  );

  const headerComponent = headerSection?.fields.components?.[0];
  const introText = headerComponent?.fields?.textParagraph;

  if (!introText) return null;

  return (
    <header className="intro-header">
      <h1 className='font-headings text-h1 text-white'>{introText}</h1>
    </header>
  );
};

export default Header;
