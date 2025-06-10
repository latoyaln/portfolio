import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';

const Header = () => {
  const pageId = 'home';
  const { data, loading, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale } = useLocalization();
  const dataKey = `${pageId}-${currentLocale}`;

  const rolesNL = ['Latoya', 'frontend developer', 'grafisch ontwerper', 'LN design'];
  const rolesEN = ['Latoya', 'frontend developer', 'graphic designer', 'LN design'];
  
  const roles = currentLocale === 'nl' ? rolesNL : rolesEN;
  
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!data[dataKey]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale, dataKey]);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting && charIndex < currentRole.length) {
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 2000); 
        } else {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
          setCharIndex(0);
        }
      }
    };

    const timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  const handleEmailClick = useCallback(() => {
    window.location.href = 'mailto:l.n.design@hotmail.com';
  }, []);

  const handleLinkedInClick = useCallback(() => {
    window.open('https://www.linkedin.com/in/latoyanijmeijer', '_blank', 'noopener,noreferrer');
  }, []);

  if (loading || !data[dataKey]) return null;

  const itemCollection =
    data[dataKey]?.content?.itemCollection?.items ||
    data[dataKey]?.content?.itemCollection ||
    [];

  const headerSection = itemCollection.find(
    (item) => item.fields?.internalName === 'Header'
  );

  const headerComponent = headerSection?.fields?.components?.[0];
  const introText = headerComponent?.fields?.textParagraph;

  if (!introText) return null;

  const dynamicText = roles[roleIndex].substring(0, charIndex);

  // Localized text
  const greeting = currentLocale === 'nl' ? 'Ik ben' : 'I am';

  return (
    <section className="relative font-medium text-xl md:text-h2 lg:text-h1 text-white" aria-label="Introduction">
      <h2 className="mb-4">
        <span className="sr-only">{greeting}</span>
        <span aria-hidden="true">{greeting} {dynamicText},</span>
      </h2>
      <h1 className="max-w-[23ch] text-2xl md:text-h2 lg:text-h1">{introText}</h1>

      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4 group relative transition-all duration-300 ease-in-out">
        <button
          onClick={handleLinkedInClick}
          className="inline-block transition-all duration-300 group-hover:tracking-widest focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-midnight rounded"
          aria-label={currentLocale === 'nl' ? 'Bekijk LinkedIn profiel' : 'View LinkedIn profile'}
        >
          → LinkedIn
        </button>

        <button 
          onClick={handleEmailClick}
          className="inline-block transition-all duration-300 group-hover:tracking-widest focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-midnight rounded"
          aria-label={currentLocale === 'nl' ? 'Stuur een e-mail' : 'Send an email'}
        >
          → {currentLocale === 'nl' ? 'E-mail' : 'Email'}
        </button>
      </div>
    </section>
  );
};

export default Header;