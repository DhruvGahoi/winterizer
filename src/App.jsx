import React, { useState } from "react";

function App() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch URL and summarize
  const summarizeArticle = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Fetch the current tab URL
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tab.url;

      // Call the Gemini API
      const response = await fetch("https://api.example.com/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
        },
        body: JSON.stringify({ prompt: `Summarize this article: ${url}` }),
      });

      const data = await response.json();
      setSummary(data.summary || "No summary available.");
    } catch (err) {
      setError("Failed to fetch summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", width: "300px" }}>
      <h3>Article Summarizer</h3>
      <button onClick={summarizeArticle} disabled={loading} style={{ marginBottom: "10px" }}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <div>
          <h4>Summary:</h4>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
