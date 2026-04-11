import { useState } from "react";
import { shortenUrl, redirectUrl } from "../api";

export default function UrlForm() {
  const [mode, setMode] = useState("shorten"); // shorten | redirect
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;

    setLoading(true);
    setResult("");

    try {
      if (mode === "shorten") {
        const data = await shortenUrl(input);
        setResult(data.shortUrl); // backend should return this
      } else {
        const data = await redirectUrl(input);
        window.location.href = data.originalUrl;
      }
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setMode("shorten")}
          className={`px-4 py-2 rounded-l-lg ${
            mode === "shorten" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Shorten
        </button>
        <button
          onClick={() => setMode("redirect")}
          className={`px-4 py-2 rounded-r-lg ${
            mode === "redirect" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Redirect
        </button>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={
          mode === "shorten" ? "Enter long URL..." : "Enter short code..."
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-700 mb-4 outline-none"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-4 bg-gray-700 p-3 rounded-lg break-all">
          {result}
        </div>
      )}
    </div>
  );
}
