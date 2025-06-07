import { createClient } from 'contentful';

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  host: 'cdn.contentful.com',
  secure: true,
  environment: 'master'
});

// Ensure all image URLs use HTTPS
const originalGetAsset = client.getAsset;
client.getAsset = async (id, query) => {
  const response = await originalGetAsset(id, query);
  if (response.fields?.file?.url) {
    response.fields.file.url = response.fields.file.url.replace('http://', 'https://');
  }
  return response;
};

export default client;
