import React from 'react';
import { ContentfulProvider } from './api/contentfulFetch';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from "./components/navbar";
import Home from './pages/Home'; 
import BlogPost from './components/blogPost';
import SEO from './components/Seo';
import Projects from './pages/Projects';
import About from './pages/About';

const App = () => {
  return (
    <HelmetProvider>
      <LocalizationProvider>
        <ContentfulProvider>
          <SEO />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<Home />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/en/blog/:id" element={<BlogPost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/en/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/en/about" element={<About />} />
          </Routes>
        </ContentfulProvider>
      </LocalizationProvider>
    </HelmetProvider>
  );
};

export default App;