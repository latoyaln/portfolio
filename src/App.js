import React from 'react';
import { ContentfulProvider } from './api/contentfulFetch'; // Import the Contentful context provider
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes from react-router-dom
import Home from './pages/Home'; 

const App = () => {
  return (
    <ContentfulProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
        </Routes>
      </Router>
    </ContentfulProvider>
  );
};

export default App;
