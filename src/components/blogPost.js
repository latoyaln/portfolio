import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentfulContext } from '../api/contentfulFetch';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const blogPosts = itemCollection.find(
    (item) => item.fields?.internalName === 'BlogPosts'
  );

  const posts = blogPosts?.fields?.components || [];
  const post = posts.find((p) => p.sys.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:text-blue-800 font-medium mb-8 flex items-center"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {post.fields.image && (
        <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
          <img
            src={`https:${post.fields.image.fields.file.url}`}
            alt={post.fields.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.fields.title}
        </h1>

        {post.fields.subjects && post.fields.subjects.length > 0 && (
          <div className="flex gap-2 mb-8">
            {post.fields.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        )}

        <div className="text-gray-700">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-2" {...props} />,
              code: ({ node, inline, ...props }) => 
                inline ? 
                  <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props} /> :
                  <code className="block bg-gray-100 rounded p-4 my-4 font-mono text-sm overflow-x-auto" {...props} />,
              pre: ({ node, ...props }) => <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
              hr: ({ node, ...props }) => <hr className="my-8 border-gray-300" {...props} />,
            }}
          >
            {post.fields.paragraph}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
