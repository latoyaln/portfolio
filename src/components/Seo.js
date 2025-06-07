// src/components/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocalization } from '../contexts/LocalizationContext';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords,
  image,
  article = false 
}) => {
  const { currentLocale, getLocalizedPath } = useLocalization();
  const location = useLocation();
  
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://lndesign.nl';
  const currentUrl = `${siteUrl}${location.pathname}`;
  
  const alternateUrls = {
    'nl': `${siteUrl}${getLocalizedPath(location.pathname.replace('/en', ''), 'nl')}`,
    'en': `${siteUrl}${getLocalizedPath(location.pathname.replace('/en', ''), 'en-US')}`
  };

  const defaultContent = {
    'nl': {
      title: 'LN Design - Frontend Development & Grafisch Ontwerp in Amsterdam',
      description: 'LN Design - Professionele websites en grafisch ontwerp. Gevestigd in Amsterdam. Neem contact op voor uw digitale projecten.',
      keywords: 'webdesign, frontend development, grafisch ontwerp, Amsterdam, React, JavaScript'
    },
    'en-US': {
      title: 'LN Design - Frontend Development & Graphic Design in Amsterdam',
      description: 'LN Design - Professional websites and graphic design. Based in Amsterdam. Contact us for your digital projects.',
      keywords: 'web design, frontend development, graphic design, Amsterdam, React, JavaScript'
    }
  };

  const seoTitle = title || defaultContent[currentLocale]?.title;
  const seoDescription = description || defaultContent[currentLocale]?.description;
  const seoKeywords = keywords || defaultContent[currentLocale]?.keywords;

  return (
    <Helmet>
      <html lang={currentLocale === 'nl' ? 'nl' : 'en'} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={currentLocale === 'nl' ? 'nl_NL' : 'en_US'} />
      <meta property="og:site_name" content="LN Design" />
      
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      <link rel="canonical" href={currentUrl} />
      
      <link rel="alternate" hrefLang="nl" href={alternateUrls.nl} />
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.nl} />
      
      <meta name="robots" content="index, follow" />
      <meta name="author" content="LN Design" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Helmet>
  );
};

export default SEO;