import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import Header from '../components/introHeader';
import SelectedProjects from '../components/selectedProjects';
import AboutMe from '../components/aboutMe';
import CTA from '../components/cta';
import BlogPosts from '../components/blogPosts';

const Home = () => {
  const { data, loading, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';
  const aboutMeRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }

    const handleScroll = () => {
      if (aboutMeRef.current) {
        const rect = aboutMeRef.current.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const sectionTop = rect.top + scrollPosition;
        const windowHeight = window.innerHeight;
        
        // Calculate progress based on scroll position
        const progress = Math.min(
          Math.max(
            (scrollPosition - (sectionTop - windowHeight)) / (windowHeight * 0.5),
            0
          ),
          1
        );
        
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, fetchPageData, pageId]);

  const scrollToAboutMe = () => {
    aboutMeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !data[pageId]) {
    return (
      <div className="loading-state flex items-center justify-center min-h-screen bg-daylight">
        <div className="text-midnight text-xl">Loading Home...</div>
      </div>
    );
  }

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
      
      {/* Color Transition Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, ${scrollProgress}) 100%)`,
          opacity: scrollProgress
        }}
      />
      
      {/* About Me Section */}
      <section 
        ref={aboutMeRef} 
        className="relative bg-white"
        style={{
          transition: 'background-color 1000ms ease-in-out'
        }}
      >
        <AboutMe />
      </section>

      {/* Blog Posts Section */}
      <section className="relative bg-daylight py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center mb-12">
          <h2 className="text-h2 font-headings text-midnight mb-2">Latest Blog Posts</h2>
          <p className="text-lg text-midnight max-w-2xl mx-auto">
            Stay updated with my latest thoughts and insights on web development and design.
          </p>
        </div>
        <BlogPosts />
      </section>

      {/* CTA Section */}
      <section className="relative bg-daylight">
        <CTA />
      </section>
    </div>
  ); 
};

export default Home;