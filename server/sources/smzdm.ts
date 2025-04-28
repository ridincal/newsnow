import * as cheerio from "cheerio";
import type { NewsItem } from "@shared/types";

// Assuming myFetch is defined elsewhere
// declare function myFetch(url: string): Promise<string>;

export default defineSource(async () => {
  console.log("Fetching SMZDM hot posts...");
  const baseURL = "https://post.smzdm.com/hot_1/";
  let html: string;

  try {
    html = await myFetch(baseURL);

    // --- Verification Starts Here ---

    console.log("--- Fetched Content Start ---");
    console.log(html); // Print the entire fetched content
    console.log("--- Fetched Content End ---");

    // You might also want to check the type and length
    console.log(`Type of fetched content: ${typeof html}`);
    console.log(`Length of fetched content: ${html?.length ?? 'N/A'}`);

    // If the content is too long, print only a snippet
    // console.log("Fetched Content Snippet:", html.substring(0, 1000));

    // --- Verification Ends Here ---

  } catch (error) {
    console.error("Failed to fetch SMZDM page:", error);
    // Log the error object for more details
    console.error("Error details:", error);
    return [];
  }

  // Only proceed if html is a non-empty string
  if (!html || typeof html !== 'string' || html.length === 0) {
      console.error("Fetched content is invalid or empty.");
      return [];
  }

  const $ = cheerio.load(html);
  // ... rest of your cheerio parsing logic ...

  // ... (parsing code as before)

  const $main = $("#feed-list .feed-row-wide"); // Example selector
  const news: NewsItem[] = [];
   if ($main.length === 0) {
      console.warn("SMZDM selector found 0 elements. Check the logged HTML content above to verify structure and selectors.");
   }
  $main.each((_, el) => {
      const a = $(el).find("h5 > a.feed-title-link");
      const url = a.attr("href");
      const title = a.text().trim();
      if (url && title) {
          news.push({ url, title, id: url });
      }
  });
  console.log(`Found ${news.length} SMZDM news items.`);
  return news;
});
