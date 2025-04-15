import React, { useContext, useEffect } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import Header from '../components/introHeader';

const Home = () => {
  const { data, loading, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  if (loading || !data[pageId]) {
    return <div className="loading-state">Loading Home...</div>;
  }

  return (
    <section className="flex p-10 justify-center h-[80vh] items-center overflow-hidden bg-midnight"> 
      <Header />
    </section>
  ); 
};

export default Home;
