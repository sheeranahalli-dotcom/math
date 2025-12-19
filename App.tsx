import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Info } from 'lucide-react';
import { parseInputData, calculateStatistics, StatisticsResult } from './utils/statistics';
import ScatterPlot from './components/ScatterChart';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [inputX, setInputX] = useState<string>('1, 2, 3, 4, 5');
  const [inputY, setInputY] = useState<string>('2, 4, 6, 8, 10');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatisticsResult | null>(null);

  // Initial calculation on load
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = () => {
    setError(null);
    const { data, error: parseError } = parseInputData(inputX, inputY);

    if (parseError) {
      setError(parseError);
      setStats(null);
      return;
    }

    const result = calculateStatistics(data);
    setStats(result);
  };

  const handleClear = () => {
    setInputX('');
    setInputY('');
    setStats(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Sunil M S</h1>
          </div>
          <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Info className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Data Input
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="inputX" className="block text-sm font-medium text-gray-700 mb-1">
                    Variable X (Independent)
                  </label>
                  <textarea
                    id="inputX"
                    value={inputX}
                    onChange={(e) => setInputX(e.target.value)}
                    placeholder="e.g. 10, 20, 30..."
                    className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-y"
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate numbers with commas or spaces.</p>
                </div>

                <div>
                  <label htmlFor="inputY" className="block text-sm font-medium text-gray-700 mb-1">
                    Variable Y (Dependent)
                  </label>
                  <textarea
                    id="inputY"
                    value={inputY}
                    onChange={(e) => setInputY(e.target.value)}
                    placeholder="e.g. 5, 15, 25..."
                    className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm font-mono resize-y"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 animate-fadeIn">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium shadow-sm transition-all active:scale-[0.98]"
                >
                  Calculate
                </button>
                <button
                  onClick={handleClear}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  aria-label="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">How it works</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Covariance measures the directional relationship between two variables. 
                <br /><br />
                • <strong>Positive:</strong> Variables move in the same direction.<br />
                • <strong>Negative:</strong> Variables move in opposite directions.<br />
                • <strong>Zero:</strong> No linear relationship.
              </p>
            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            {stats ? (
              <>
                 <ScatterPlot data={stats.data} />
                 <AnalysisResult stats={stats} />
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                <Calculator className="w-12 h-12 mb-3 opacity-20" />
                <p>Enter data and hit calculate to see results.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
