import React, { useContext, useEffect, useRef } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import Header from '../components/introHeader';
import SelectedProjects from '../components/selectedProjects';
import AboutMe from '../components/aboutMe';
import CTA from '../components/cta';
import BlogPosts from '../components/blogPosts';

const Home = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';
  const aboutMeRef = useRef(null);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }

    const handleScroll = () => {
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, fetchPageData, pageId]);

  const scrollToAboutMe = () => {
    aboutMeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="flex p-10 justify-center h-screen items-center overflow-hidden bg-midnight relative"> 
        <Header />
      </section>
      
      {/* Selected Projects Section */}
      <div className="relative">
        <SelectedProjects onScrollToAbout={scrollToAboutMe} />
      </div>

      <section 
        ref={aboutMeRef} 
        className="relative bg-white"
        style={{
          transition: 'background-color 1000ms ease-in-out'
        }}
      >
        <AboutMe />
      </section>

      <section className="relative bg-daylight py-20">
        <div className="container text-center mx-auto px-4 sm:px-6 mb-12">
          <h2 className="text-h2 font-headings text-midnight mb-2">Blog</h2>
        </div>
        <BlogPosts />
      </section>

      <section className="relative bg-daylight">
        <CTA />
      </section>
    </div>
  ); 
};

export default Home;