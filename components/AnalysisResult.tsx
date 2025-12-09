import React, { useState } from 'react';
import { StatisticsResult } from '../utils/statistics';
import { getCovarianceAnalysis } from '../services/geminiService';
import { Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisResultProps {
  stats: StatisticsResult;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ stats }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCovarianceAnalysis(stats);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Sample Size (N)</span>
          <span className="text-3xl font-bold text-gray-800 mt-2">{stats.n}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Mean X</span>
          <span className="text-3xl font-bold text-indigo-600 mt-2">{stats.meanX.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Mean Y</span>
          <span className="text-3xl font-bold text-pink-600 mt-2">{stats.meanY.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md border border-indigo-600 flex flex-col items-center justify-center text-center text-white">
          <span className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Sample Covariance</span>
          <span className="text-3xl font-bold mt-2">{stats.sampleCovariance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
          <span className="text-xs text-indigo-200 mt-1">Pop. Cov: {stats.populationCovariance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">AI Insight & Interpretation</h3>
          </div>
          {!analysis && !loading && (
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Analyze with Gemini
            </button>
          )}
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
              <p>Analyzing statistical relationship...</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!analysis && !loading && !error && (
             <div className="text-center py-8 text-gray-500">
               <p>Click "Analyze with Gemini" to get a detailed breakdown of what this covariance means for your data.</p>
             </div>
          )}

          {analysis && (
            <div className="prose prose-indigo max-w-none text-gray-700">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;