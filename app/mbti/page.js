"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function MBTIPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false); //conditional rendering

  const [result, setResult] = useState( null );
  const [error, setError] = useState(null);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);


  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading</div>
      </div>
    );
  }

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const emailsRes = await axios.get("/api/fetch-emails");
      const { emails } = emailsRes.data;

      const analysisRes = await axios.post("/api/analyze/mbti", { emails });
      const { analysis } = analysisRes.data;
      
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      
      // Check if it's a 404 error (no emails found)
      if (error.response?.status === 404) {
        setError(error.response.data.message || "No emails found for analysis");
      } 
      else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } 
      else {
        setError("An error occurred during analysis. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 hover:scale-105 border bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        <div className="bg-gray-500 rounded-lg p-8">
          
          <h1 className="text-3xl font-bold text-center mb-8">
            MBTI Analysis
          </h1>

          {!result && !loading && (
            <div className="text-center">
              <button
                onClick={handleAnalysis}
                className="bg-gray-800 hover:scale-105 text-white px-4 py-2 rounded-lg"
              >
                Start Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center text-xl">
              Loading
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Analysis Error</h3>
                  <p className="mt-2 text-sm">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl text-gray-600 font-bold mb-4">Results</h2>
              <p className="whitespace-pre-wrap text-black">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}