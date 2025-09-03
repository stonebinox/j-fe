import { useState } from "react";

interface AnalysisState {
  summary: string;
  title: string;
  topics: string[];
  sentiment: string;
  keywords: string[];
}

function App() {
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisState | null>(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setAnalysisData(null);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }),
        }
      );
      const data = await response.json();
      const { data: analysis } = data;
      setInputText("");
      setAnalysisData(analysis);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Analyze Text</h1>
      <textarea
        placeholder="Enter something..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={fetchAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {analysisData && (
        <div>
          <h2>Analysis Results</h2>
          <p>
            <strong>Title:</strong> {analysisData.title}
          </p>
          <p>
            <strong>Summary:</strong> {analysisData.summary}
          </p>
          <p>
            <strong>Sentiment:</strong> {analysisData.sentiment}
          </p>
          <p>
            <strong>Topics:</strong> {analysisData.topics.join(", ")}
          </p>
          <p>
            <strong>Keywords:</strong> {analysisData.keywords.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
