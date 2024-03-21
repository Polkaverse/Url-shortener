// Import required modules
const express = require("express"); // Express.js for building web applications
const bodyParser = require("body-parser"); // Middleware to parse request bodies
const crypto = require("crypto"); // Crypto module for generating hash

// Create an Express application
const app = express();

// Define the port number
const PORT = 3000;

// Middleware to parse JSON bodies of incoming requests
app.use(bodyParser.json());

// Data structures to store URL mappings and domain counts
const urlToShortcode = {}; // Map from URL to shortcode
const shortcodeToUrl = {}; // Map from shortcode to URL
const domainCounts = {}; // Map from domain to count of shortened URLs

// Function to generate a shortcode from a URL
function generateShortcode(url) {
  // Generate SHA1 hash of the URL
  const hash = crypto.createHash("sha1");
  hash.update(url);
  const hashedUrl = hash.digest("hex");
  // Return the first 8 characters of the hash as the shortcode
  return hashedUrl.substr(0, 8);
}

// Endpoint to handle URL shortening
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  // Check if URL is provided
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Check if URL is already shortened
  if (urlToShortcode[url]) {
    return res.json({ shortcode: urlToShortcode[url] });
  }

  // Generate shortcode for the URL
  const shortcode = generateShortcode(url);
  // Store the URL-shortcode mapping
  urlToShortcode[url] = shortcode;
  shortcodeToUrl[shortcode] = url;

  // Extract domain from the URL
  const domain = new URL(url).hostname;
  // Increment count of shortened URLs for the domain
  domainCounts[domain] = (domainCounts[domain] || 0) + 1;

  // Log the URL-shortcode mapping
  // console.log("urlToShortcode:", urlToShortcode);
  // console.log("shortcodeToUrl:", shortcodeToUrl);

  // Return the shortcode in the response
  res.json({ shortcode });
});

// Endpoint to retrieve metrics (top 3 domains with the most shortened URLs)
app.get("/metrics", (req, res) => {
  // Convert domainCounts object to an array of [domain, count] pairs
  const domainCountsArr = Object.entries(domainCounts);

  // Sort domainCountsArr based on count in descending order
  domainCountsArr.sort((a, b) => b[1] - a[1]);

  // Take top 3 domains or less if there are fewer than 3 domains
  const topDomains = domainCountsArr.slice(0, 3);

  // Convert array of domain-count pairs to an object for easier JSON formatting
  const metrics = topDomains.reduce((acc, [domain, count]) => {
    acc[domain] = count;
    return acc;
  }, {});

  // Return the top domains and their counts in the response
  res.json(metrics);
});

// Endpoint to handle redirection based on shortcode
app.get("/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const url = shortcodeToUrl[shortcode];

  // Check if shortcode is valid
  if (url) {
    // Redirect to the original URL
    return res.redirect(url);
  } else {
    // Return 404 error if shortcode is not found
    return res.status(404).json({ error: "Shortcode not found" });
  }
});

// Start the server and listen for incoming connections
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the server for testing
module.exports = server;
