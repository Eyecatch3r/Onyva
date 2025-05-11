// eslint-disable-next-line
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * HTTP function to get Google Maps review info
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 */
// eslint-disable-next-line
exports.getScore = onRequest({ cors: true }, (request, response) => {
  // Extract rating, reviewCount, and distance from query parameters
  const rating = parseFloat(request.query.rating);
  const reviewCount = parseFloat(request.query.reviewCount);
  const distance = parseFloat(request.query.distance);

  // Validate input parameters
  if (
    isNaN(rating) ||
    isNaN(reviewCount) ||
    isNaN(distance) ||
    reviewCount === 0 ||
    distance <= 0
  ) {
    // eslint-disable-next-line
    logger.error("Invalid input parameters", { rating, reviewCount, distance });
    // eslint-disable-next-line
    return response.status(400).json({ error: "Invalid input parameters" });
  }

  // Calculate the score
  const score = Math.log10(distance) * (rating / reviewCount) * 250;

  // Log the calculated score
  // eslint-disable-next-line
  logger.info("Calculated score", { score });
  // Respond with the received parameters as JSON
  // eslint-disable-next-line
  response.json({ score: score });
});
