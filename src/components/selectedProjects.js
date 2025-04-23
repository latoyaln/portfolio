import React, {useEffect, useContext } from 'react';
import { ContentfulContext } from '../api/contentfulFetch';

const SelectedProjects = () => {
  const { data, fetchPageData } = useContext(ContentfulContext);
  const pageId = 'home';

  useEffect(() => {
    if (!data[pageId]) {
      fetchPageData(pageId);
    }
  }, [data, fetchPageData, pageId]);

  const itemCollection =
    data[pageId].content.itemCollection?.items ||
    data[pageId].content.itemCollection ||
    [];

  const selectedProjects = itemCollection.find(
    (item) => item.fields.internalName === 'SelectedProjects'
  );

  const projectsHeader = selectedProjects?.fields.components?.[0];

  return (
    <section className="container mx-auto my-20 px-6">
    <h2 className="text-h2 font-headings text-midnight mb-2">
      {projectsHeader?.fields?.title}
    </h2>
    <p className="text-body text-midnight mb-10">
      {projectsHeader?.fields?.textParagraph}
    </p>
    <div className="relative gap-6">
      {selectedProjects?.fields?.components?.length > 0 ? (
        selectedProjects.fields.components.map((project, index) => (
          <div
            key={index}
            className="w-full h-[350px] relative overflow-hidden"
          >
            <img
              src={project.fields.coverImage?.fields?.file?.url}
              alt={project.fields.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 font-medium text-daylight bg-black/50 px-2 py-1 rounded">
              {project.fields.title}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-midnight">No projects found.</p>
      )}
    </div>
  </section>
  
  );
};

export default SelectedProjects;
