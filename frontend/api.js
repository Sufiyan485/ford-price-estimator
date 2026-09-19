/**
 * api.js
 * ---------------------------------------------------------------
 * Thin wrapper around the FastAPI backend.
 *
 * IMPORTANT: update API_BASE_URL when you deploy the backend
 * (e.g. to your Render URL) — this is the only place it needs
 * to change.
 * ---------------------------------------------------------------
 */

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * The exact set of Ford models the backend was trained on
 * (mirrors the `Literal[...]` in the FastAPI CarFeatures schema).
 */
const FORD_MODELS = [
  "Fiesta", "Focus", "Kuga", "Ecosport", "C-Max", "Ka+", "Mondeo",
  "S-Max", "B-MAX", "Grand C-Max", "Galaxy", "Edge", "KA", "Puma",
  "Tourneo Custom", "Grand Tourneo Connect", "Mustang",
  "Torneo Connect", "Fusion", "Streetka", "Ranger", "Escort",
  "Transit Tourneo"
];

/**
 * Calls POST /predict with the given payload.
 * Throws an Error with a user-friendly message on failure.
 */
async function fetchPredictedPrice(payload) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (networkError) {
    throw new Error(
      "Couldn't reach the prediction service. Check your connection and try again."
    );
  }

  if (!response.ok) {
    let detail = null;
    try {
      const errorBody = await response.json();
      detail = errorBody?.detail;
    } catch (_) {
      /* body wasn't JSON — ignore */
    }

    if (response.status === 422) {
      throw new Error("Some of the details entered aren't valid. Please review the form.");
    }
    throw new Error(
      typeof detail === "string" ? detail : `The service returned an unexpected error (${response.status}).`
    );
  }

  const data = await response.json();
  if (typeof data.predicted_price !== "number") {
    throw new Error("The service returned an unexpected response.");
  }
  return data.predicted_price;
}
