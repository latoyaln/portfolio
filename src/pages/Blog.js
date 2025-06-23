import React, { useEffect, useContext, useState } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';
import SEO from '../components/Seo';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Sandpack } from '@codesandbox/sandpack-react';
import BlogPosts from '../components/blogPosts';

const Blog = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale } = useLocalization();
  const pageId = 'home';
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!data[`${pageId}-${currentLocale}`]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale]);

  const itemCollection = data?.[`${pageId}-${currentLocale}`]?.content?.itemCollection?.items || data?.[`${pageId}-${currentLocale}`]?.content?.itemCollection || [];

  const blogPosts = itemCollection.find(
    (item) => item.fields?.internalName === 'BlogPosts'
  );
  console.log('blogPosts:', blogPosts);

  const posts = blogPosts?.fields?.components || [];
  console.log('posts:', posts);

  // Get unique years and categories from posts
  const years = ['all', ...new Set(posts.map(post => {
    const date = new Date(post.fields.date);
    return date.getFullYear().toString();
  }))];

  const categories = ['all', ...new Set(posts.flatMap(post => post.fields.subjects || []))];

  const blogTitle = currentLocale === 'nl' ? 'Blog - LN Design' : 'Blog - LN Design';
  const blogDescription = currentLocale === 'nl' 
    ? 'Ontdek de nieuwste inzichten over frontend development, webdesign en grafisch ontwerp van LN Design.'
    : 'Discover the latest insights about frontend development, web design and graphic design from LN Design.';

  return (
    <>
      <SEO 
        title={blogTitle}
        description={blogDescription}
      />
      
      {/* Blog Posts Section */}
      <section className="bg-daylight py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-midnight mb-8 text-center">Blog</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border border-midnight/20 focus:outline-none focus:ring-2 focus:ring-midnight"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year === 'all' ? (currentLocale === 'nl' ? 'Alle jaren' : 'All Years') : year}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-midnight/20 focus:outline-none focus:ring-2 focus:ring-midnight"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? (currentLocale === 'nl' ? 'Alle categorieën' : 'All Categories') : category}
                </option>
              ))}
            </select>
          </div>

          <BlogPosts 
            selectedYear={selectedYear}
            selectedCategory={selectedCategory}
            showSeeMoreButton={false}
          />
        </div>
      </section>

      <section className="bg-midnight py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-daylight mb-8 text-center">
            {currentLocale === 'nl' ? 'Live Code Editor' : 'Live Code Editor'}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* React Live Example */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-xl font-semibold text-midnight mb-4">React Live Example</h3>
              <LiveProvider code={`function Example() {
                  const [count, setCount] = React.useState(0);
                  return (
                    <div>
                      <p>Count: {count}</p>
                      <button onClick={() => setCount(count + 1)}>
                        Increment
                      </button>
                    </div>
                  );
                }`}>
                <LiveEditor className="rounded-lg mb-4" />
                <LiveError className="text-red-500 mb-4" />
                <LivePreview className="p-4 border border-gray-200 rounded-lg" />
              </LiveProvider>
            </div>

            {/* Sandpack Example */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-xl font-semibold text-midnight mb-4">Sandpack Example</h3>
              <Sandpack
                template="react"
                files={{
                  "/App.js": `export default function App() {
                      return (
                        <div>
                          <h1>Hello Sandpack!</h1>
                          <p>Start editing to see some magic happen!</p>
                        </div>
                      );
                    }`,
                }}
                options={{
                  showNavigator: true,
                  showTabs: true,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
