import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentfulContext } from '../api/contentfulFetch';

const BlogPosts = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection =
    data?.[pageId]?.content?.itemCollection?.items ||
    data?.[pageId]?.content?.itemCollection ||
    [];

  console.log('Full Contentful Data:', data);
  console.log('Item Collection:', itemCollection);

  const blogPosts = itemCollection.find(
    (item) => item.fields?.internalName === 'BlogPosts'
  );

  console.log('Found Blog Posts:', blogPosts);

  const posts = blogPosts?.fields?.components || [];

  console.log('Filtered Posts:', posts);

  if (!posts.length) {
    return (
      <div className="text-center text-midnight py-12">
        <pre className="text-left bg-gray-100 p-4 rounded-lg overflow-auto max-w-4xl mx-auto">
          {JSON.stringify({
            data: data,
            itemCollection: itemCollection,
            blogPosts: blogPosts,
            posts: posts
          }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.sys.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {post.fields.image && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`https:${post.fields.image.fields.file.url}`}
                  alt={post.fields.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {post.fields.subjects && post.fields.subjects.length > 0 && (
                  <>
                    <span className="text-sm text-gray-500">{post.fields.subjects[0]}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                {post.fields.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.fields.paragraph}
              </p>
              <Link 
                to={`/blog/${post.sys.id}`}
                className="inline-flex items-center text-midnight hover:text-blue-800 font-medium group-hover:underline"
              >
                Read More
                <svg 
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
