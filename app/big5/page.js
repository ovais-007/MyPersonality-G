"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Big5Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

    try {
      const emailsRes = await axios.get("/api/fetch-emails");
      const { emails } = emailsRes.data;

      const analysisRes = await axios.post("/api/analyze/big5", { emails });
      const { analysis } = analysisRes.data;
      
      setResult(analysis);
    } catch (error) {
      alert("Error: " + error.message);
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
            Big Five Analysis
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

          {result && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl text-red-200 font-bold mb-4">Results</h2>
              <p className="whitespace-pre-wrap text-black">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}