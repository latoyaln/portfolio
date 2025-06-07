import React from 'react';
import { ContentfulProvider } from './api/contentfulFetch'; // Import the Contentful context provider
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes from react-router-dom
import Navbar from "./components/navbar";
import Home from './pages/Home'; 
import BlogPost from './components/blogPost';

const App = () => {
  return (
    <ContentfulProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </Router>
    </ContentfulProvider>
  );
};

export default App;
