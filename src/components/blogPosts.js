import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';
import SEO from './Seo';

const BlogPosts = ({ selectedYear = 'all', selectedCategory = 'all', showSeeMoreButton = true }) => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale, getLocalizedPath } = useLocalization();
  const pageId = 'home';

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection = data?.[pageId]?.content?.itemCollection?.items || data?.[pageId]?.content?.itemCollection || [];

  const blogPosts = itemCollection.find(
    (item) => item.fields?.internalName === 'BlogPosts'
  );

  const posts = blogPosts?.fields?.components || [];

  // Filter posts based on selected year and category
  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.fields.date);
    const postYear = postDate.getFullYear().toString();
    const postCategories = post.fields.subjects || [];

    const yearMatch = selectedYear === 'all' || postYear === selectedYear;
    const categoryMatch = selectedCategory === 'all' || postCategories.includes(selectedCategory);

    return yearMatch && categoryMatch;
  });

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.fields.date) - new Date(a.fields.date);
  });

  const blogTitle = currentLocale === 'nl' ? 'Blog - LN Design' : 'Blog - LN Design';
  const blogDescription = currentLocale === 'nl' 
    ? 'Ontdek de nieuwste inzichten over frontend development, webdesign en grafisch ontwerp van LN Design.'
    : 'Discover the latest insights about frontend development, web design and graphic design from LN Design.';

  const readMoreText = currentLocale === 'nl' ? 'Lees meer over' : 'Read more about';
  const noPostsText = currentLocale === 'nl' ? 'Geen blogposts gevonden.' : 'No blog posts found.';
  const seeMoreText = currentLocale === 'nl' ? 'Bekijk alle posts' : 'See all posts';

  if (!sortedPosts.length) {
    return (
      <>
        <SEO 
          title={blogTitle}
          description={blogDescription}
        />
        <div className="text-center text-midnight py-12">
          <p>{noPostsText}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={blogTitle}
        description={blogDescription}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedPosts.map((post) => {
            const linkText = `${readMoreText} ${post.fields.title}`;
            const blogPostUrl = getLocalizedPath(`/blog/${post.sys.id}`);
            
            return (
              <article 
                key={post.sys.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {post.fields.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={`https:${post.fields.image.fields.file.url}`}
                      alt={post.fields.image.fields.description || post.fields.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width="400"
                      height="200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.fields.subjects && post.fields.subjects.length > 0 && (
                      <span className="text-sm text-gray-500" aria-label="Category">
                        {post.fields.subjects[0]}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(post.fields.date).toLocaleDateString(currentLocale === 'nl' ? 'nl-NL' : 'en-US')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      to={blogPostUrl}
                      className="link-swap hover:text-midnight focus:text-midnight focus:outline-none focus:ring-2 focus:ring-midnight focus:ring-offset-2 rounded"
                      aria-describedby={`post-excerpt-${post.sys.id}`}
                      aria-label={linkText}
                    >
                      <span>{post.fields.title}</span>
                    </Link>
                  </h3>
                  <p 
                    id={`post-excerpt-${post.sys.id}`}
                    className="text-body mb-4 line-clamp-3"
                  >
                    {post.fields.paragraph ? 
                      post.fields.paragraph.substring(0, 150) + (post.fields.paragraph.length > 150 ? '...' : '') 
                      : ''}
                  </p>
                  <Link 
                    to={blogPostUrl}
                    className="inline-flex items-center text-midnight hover:text-blue-800 font-medium group-hover:underline focus:outline-none focus:ring-2 focus:ring-midnight focus:ring-offset-2 rounded"
                    aria-label={linkText}
                  >
                    {currentLocale === 'nl' ? 'Lees meer' : 'Read More'}
                    <svg 
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        
        {/* See More Button */}
        {showSeeMoreButton && (
          <div className="text-center mt-12">
            <Link
              to={getLocalizedPath('/blog')}
              className="inline-flex items-center px-6 py-3 bg-midnight text-daylight rounded-lg hover:bg-midnight/90 focus:outline-none focus:ring-2 focus:ring-midnight focus:ring-offset-2 transition-colors duration-300"
            >
              {seeMoreText}
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPosts;