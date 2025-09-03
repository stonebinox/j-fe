import { useState, useEffect } from "react";

interface HistoryItem {
  id: number | string;
  user_input: string;
  summary: string;
  title: string;
  topics: string[];
  sentiment: string;
  keywords: string[];
  created_at?: string;
}

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const [expandedHistory, setExpandedHistory] = useState<
    Record<string | number, boolean>
  >({});

  const toggleHistory = (id: string | number) => {
    setExpandedHistory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      await fetchHistory(); // Refresh history after new analysis
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/history`
      );
      const data = await response.json();
      // API returns { data: [...] }
      setHistory(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.log(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div style={{ width: "100%", marginTop: "2rem" }}>
        <h2>Analysis History</h2>
        {historyLoading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {history.map((item) => {
              const expanded = expandedHistory[item.id];
              return (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong>Title:</strong> {item.title}
                      <span
                        style={{
                          fontSize: "0.9em",
                          color: "#888",
                          marginLeft: 8,
                        }}
                      >
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <button
                      style={{
                        fontSize: "0.9em",
                        padding: "0.2em 0.7em",
                        borderRadius: 4,
                        border: "1px solid #bbb",
                        background: "#f7f7f7",
                        cursor: "pointer",
                        color: "#333",
                      }}
                      onClick={() => toggleHistory(item.id)}
                    >
                      {expanded ? "Hide Details" : "Show Details"}
                    </button>
                  </div>
                  {expanded && (
                    <div style={{ marginTop: 12 }}>
                      <div>
                        <strong>User Input:</strong>{" "}
                        <span style={{ whiteSpace: "pre-line" }}>
                          {item.user_input}
                        </span>
                      </div>
                      <div>
                        <strong>Summary:</strong> {item.summary}
                      </div>
                      <div>
                        <strong>Sentiment:</strong> {item.sentiment}
                      </div>
                      <div>
                        <strong>Topics:</strong> {item.topics.join(", ")}
                      </div>
                      <div>
                        <strong>Keywords:</strong> {item.keywords.join(", ")}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
