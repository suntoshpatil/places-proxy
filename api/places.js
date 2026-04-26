export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Missing Google API key on server" });
  }

  const { endpoint, ...params } = req.query;

  const validEndpoints = ["geocode/json", "place/nearbysearch/json", "place/details/json"];
  if (!validEndpoints.includes(endpoint)) {
    return res.status(400).json({ error: "Invalid endpoint" });
  }

  const queryString = new URLSearchParams({ ...params, key: GOOGLE_API_KEY }).toString();
  const url = `https://maps.googleapis.com/maps/api/${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Google", details: err.message });
  }
}
