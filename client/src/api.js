const BASE_URL = "http://localhost:3000"; // change later

export const shortenUrl = async (longUrl) => {
  const res = await fetch(`${BASE_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: longUrl }),
  });

  if (!res.ok) throw new Error("Failed to shorten");

  return res.json();
};

export const redirectUrl = async (shortCode) => {
  const res = await fetch(`${BASE_URL}/${shortCode}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Invalid short URL");

  return res.json();
};
