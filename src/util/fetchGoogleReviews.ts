import { ApifyClient } from "apify-client";

// Utility function to fetch Google reviews using Apify
export const fetchGoogleReviews = async (
  mapURL: string,
  maxReviews: number = 10000
): Promise<any[]> => {
  if (!mapURL) {
    throw new Error("Map URL is required to fetch Google reviews.");
  }

  // Initialize the ApifyClient with API token
  const client = new ApifyClient({
    token: process.env.APPIFY_API_TOKEN,
  });

  // Prepare Actor input
  const input = {
    startUrls: [
      {
        url: mapURL,
      },
    ],
    maxReviews,
    reviewsSort: "newest",
    language: "en",
    reviewsOrigin: "all",
    personalData: true,
  };

  // Run the Actor and wait for it to finish
  const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);

  // Fetch the results from the dataset
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items || items.length === 0) {
    throw new Error("No reviews found for the given map URL.");
  }

  if (items[0]?.error) {
    throw new Error("Invalid map URL or an error occurred during the review fetch.");
  }

  return items; // Return the fetched reviews
};