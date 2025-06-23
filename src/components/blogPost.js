import React, { useEffect, useContext, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentfulContext } from '../api/contentfulFetch';
import { useLocalization } from '../contexts/LocalizationContext';
import SEO from './Seo';

const ReactMarkdown = lazy(() => import('react-markdown'));

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, fetchPageData } = useContext(ContentfulContext);
  const { currentLocale, getLocalizedPath } = useLocalization();
  const pageId = 'home';

  useEffect(() => {
    if (!data[`${pageId}-${currentLocale}`]) {
      fetchPageData(pageId, currentLocale);
    }
  }, [data, fetchPageData, pageId, currentLocale]);

  const itemCollection =
    data?.[`${pageId}-${currentLocale}`]?.content?.itemCollection?.items ||
    data?.[`${pageId}-${currentLocale}`]?.content?.itemCollection ||
    [];

  const blogPosts = itemCollection.find(
    (item) => item.fields?.internalName === 'BlogPosts'
  );

  const posts = blogPosts?.fields?.components || [];
  const post = posts.find((p) => p.sys.id === id);

  const backToHomeText = currentLocale === 'nl' ? 'Terug naar Home' : 'Back to Home';
  const postNotFoundText = currentLocale === 'nl' ? 'Post Niet Gevonden' : 'Post Not Found';
  const returnToHomeText = currentLocale === 'nl' ? 'Terug naar Home' : 'Return to Home';

  if (!post) {
    return (
      <>
        <SEO 
          title={`${postNotFoundText} - LN Design`}
          description={currentLocale === 'nl' ? 'De gevraagde blogpost kon niet worden gevonden.' : 'The requested blog post could not be found.'}
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{postNotFoundText}</h1>
            <button
              onClick={() => navigate(getLocalizedPath('/'))}
              className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label={returnToHomeText}
            >
              {returnToHomeText}
            </button>
          </div>
        </div>
      </>
    );
  }

  const seoDescription = post.fields.paragraph 
    ? post.fields.paragraph.substring(0, 160).replace(/[#*`]/g, '') + '...'
    : `${currentLocale === 'nl' ? 'Lees meer over' : 'Read more about'} ${post.fields.title}`;

  const seoTitle = `${post.fields.title} - LN Design Blog`;
  const seoImage = post.fields.image ? `https:${post.fields.image.fields.file.url}` : null;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={post.fields.subjects ? post.fields.subjects.join(', ') : undefined}
        image={seoImage}
        article={true}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-8">
          <button
            onClick={() => navigate(getLocalizedPath('/'))}
            className="text-midnight hover:text-blue-800 font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label={backToHomeText}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{backToHomeText}</span>
          </button>
        </nav>

        {post.fields.image && (
          <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
            <img
              src={`https:${post.fields.image.fields.file.url}`}
              alt={post.fields.image.fields.description || post.fields.title}
              className="w-full h-full object-cover"
              loading="lazy"
              width="800"
              height="400"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.fields.title}
          </h1>

          {post.fields.subjects && post.fields.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Categories">
              {post.fields.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  role="listitem"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700">
            <Suspense fallback={<div>Loading content...</div>}>
              <ReactMarkdown
                components={{
                  h1: ({ children, ...props }) => (
                    <h2 className="text-3xl font-bold mt-8 mb-4" {...props}>
                      {children}
                    </h2>
                  ),
                  h2: ({ children, ...props }) => (
                    <h3 className="text-2xl font-bold mt-6 mb-3" {...props}>
                      {children}
                    </h3>
                  ),
                  h3: ({ children, ...props }) => (
                    <h4 className="text-xl font-bold mt-4 mb-2" {...props}>
                      {children}
                    </h4>
                  ),
                  p: ({ children, ...props }) => <p className="mb-4 leading-relaxed" {...props}>{children}</p>,
                  ul: ({ children, ...props }) => <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>,
                  ol: ({ children, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>,
                  li: ({ children, ...props }) => <li className="mb-2" {...props}>{children}</li>,
                  code: ({ inline, children, ...props }) => 
                    inline ? 
                      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props}>{children}</code> :
                      <code className="block bg-gray-100 rounded p-4 my-4 font-mono text-sm overflow-x-auto" {...props}>{children}</code>,
                  pre: ({ children, ...props }) => <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto" {...props}>{children}</pre>,
                  a: ({ children, ...props }) => (
                    <a 
                      className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" 
                      {...props}
                      aria-label={children ? undefined : props.href}
                      {...(props.href && props.href.startsWith('http') ? { 
                        target: '_blank', 
                        rel: 'noopener noreferrer' 
                      } : {})}
                    >
                      {children || props.href}
                    </a>
                  ),
                  blockquote: ({ children, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>{children}</blockquote>,
                  hr: ({ ...props }) => <hr className="my-8 border-gray-300" {...props} />,
                  img: ({ ...props }) => (
                    <img 
                      className="rounded-lg shadow-md my-4 max-w-full h-auto"
                      loading="lazy"
                      {...props}
                      alt={props.alt || 'Blog post image'}
                    />
                  ),
                }}
              >
                {post.fields.paragraph}
              </ReactMarkdown>
            </Suspense>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.fields.title,
              "description": seoDescription,
              "author": {
                "@type": "Person",
                "name": "LN Design"
              },
              "publisher": {
                "@type": "Organization",
                "name": "LN Design",
                "url": "https://lndesign.nl"
              },
              ...(seoImage && { "image": seoImage }),
              "url": `https://lndesign.nl${getLocalizedPath(`/blog/${post.sys.id}`)}`,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://lndesign.nl${getLocalizedPath(`/blog/${post.sys.id}`)}`
              }
            })
          }}
        />
      </article>
    </>
  );
};

export default BlogPost;