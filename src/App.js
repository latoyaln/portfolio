import React, { useContext } from 'react';
import { ContentfulProvider, ContentfulContext } from './api/contentfulFetch';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import Navbar from "./components/navbar";
import Home from './pages/Home'; 
import BlogPost from './components/blogPost';
import SEO from './components/Seo';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import LoadingState from './components/LoadingState';
import Blog from './pages/Blog';

const AppContent = () => {
  const { loading } = useContext(ContentfulContext);
  const location = useLocation();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <SEO />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
              <Home />
          } />
          <Route path="/en" element={
              <Home />
          } />
          <Route path="/blog/:id" element={
              <BlogPost />
          } />
          <Route path="/en/blog/:id" element={
              <BlogPost />
          } />
          <Route path="/projects" element={
              <Projects />
          } />
          <Route path="/en/projects" element={
              <Projects />
          } />
          <Route path="/about" element={
              <About />
          } />
          <Route path="/en/about" element={
              <About />
          } />
          <Route path="/contact" element={
              <Contact />
          } />
          <Route path="/en/contact" element={
              <Contact />
          } />
          <Route path="/blog" element={
              <Blog />
          } />
          <Route path="/en/blog" element={
              <Blog />
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <LocalizationProvider>
        <ContentfulProvider>
          <AppContent />
        </ContentfulProvider>
      </LocalizationProvider>
    </HelmetProvider>
  );
};

export default App;