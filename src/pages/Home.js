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
    <section className="relative w-screen h-screen flex justify-center items-center overflow-hidden bg-midnight"> 
      <Header />

    </section>
  );
};

export default Home;
