import React, { useContext, useEffect } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import Header from '../components/introHeader';
import SelectedProjects from '../components/selectedProjects';
import AboutMe from '../components/aboutMe';


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
    <section className=" bg-daylight">
    <section className="flex p-10 justify-center h-[80vh] items-center overflow-hidden bg-midnight"> 
      <Header />
    </section>
    <section className="container mx-auto my-20 px-6">
      <SelectedProjects />
    </section>
    <section>
      <AboutMe />
    </section>
    </section>
  ); 
};

export default Home;
