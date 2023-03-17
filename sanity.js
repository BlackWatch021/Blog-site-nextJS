import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
};

//Connecting with the CMS, for content
export const sanityClient = createClient(config);

// To access all the images from sanity
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
