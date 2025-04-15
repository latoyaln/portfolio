import React, { useState, useEffect, useContext } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const Header = () => {
  const pageId = 'home';
  const { data, loading, fetchPageData } = useContext(ContentfulContext);

  const roles = ['Latoya', 'frontend developer', 'graphic designer', 'LN design'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
  }, [charIndex, isDeleting, roleIndex]);

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  if (loading || !data[pageId]) return null;

  const itemCollection =
    data[pageId].content.itemCollection?.items ||
    data[pageId].content.itemCollection ||
    [];

  const headerSection = itemCollection.find(
    (item) => item.fields.internalName === 'Header'
  );

  const headerComponent = headerSection?.fields.components?.[0];
  const introText = headerComponent?.fields?.textParagraph;

  if (!introText) return null;

  const dynamicText = roles[roleIndex].substring(0, charIndex);

  return (
    <section className="relative font-medium text-h2 md:text-h1 text-white">
      <h2>I am {dynamicText},</h2>
      <h1 className="max-w-23ch">{introText}</h1>

      <div className="flex justify-between mt-6 gap-4 group relative transition-all duration-300 ease-in-out">
    <a
      href="https://www.linkedin.com/in/latoyanijmeijer"
      className="inline-block transition-all duration-300 group-hover:tracking-widest"
    >
      → LinkedIn
    </a>

    <a href="mailto:l.n.design@hotmail.com"
      className="inline-block transition-all duration-300 group-hover:tracking-widest">
      → Email
    </a>
    </div>

    </section>
  );
};

export default Header;
