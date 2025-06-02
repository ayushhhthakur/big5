import React, { useState, useEffect } from 'react';
import { Dice6, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { questions } from './data/questions';
import { ResultsCard } from './components/ResultsCard';
import { SplashPage } from './components/SplashPage';
import { EmailGate } from './components/EmailGate';

interface AppProps {
  isEmbedded?: boolean;
}

function App({ isEmbedded = false }: AppProps) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>(new Array(questions.length).fill(0));
  const [isComplete, setIsComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [intermediateScores, setIntermediateScores] = useState<Array<{
    code: number;
    originalScore: number;
    finalScore: number;
  }>>([]);
  const [authorizedEmail, setAuthorizedEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
  }, []);

  const handleStart = () => setStarted(true);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };

  const handleScore = (originalScore: number) => {
    const newScores = [...scores];
    const finalScore = questions[currentQuestion].code < 0 ? (6 - originalScore) : originalScore;
    newScores[currentQuestion] = finalScore;
    setScores(newScores);
  };

  const handleComplete = () => {
    const intermediateResults = scores.map((score, index) => ({
      code: questions[index].code,
      originalScore: questions[index].code < 0 ? 6 - score : score,
      finalScore: score
    }));
    setIntermediateScores(intermediateResults);
    setIsComplete(true);
  };

  const containerClasses = isEmbedded 
    ? 'min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 font-sans text-amber-900 p-4'
    : 'container mx-auto max-w-2xl min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 font-sans text-amber-900 p-4';

  if (!authorizedEmail) {
    return <EmailGate onAuthorized={setAuthorizedEmail} />;
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center">
      {!started ? (
        <SplashPage onStart={handleStart} isEmbedded={isEmbedded} />
      ) : !isComplete ? (
        <div className="mt-8 animate-fade-in w-full max-w-xl mx-auto">
          {/* Minimal Progress Bar */}
          <div className="w-full h-1 bg-amber-100 rounded mb-8">
            <div
              className="h-1 bg-amber-500 rounded transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-3 py-2 rounded bg-white border border-amber-100 text-amber-500 hover:bg-amber-100 transition disabled:opacity-40"
              aria-label="Previous question"
            >
              Prev
            </button>
            <span className="text-base font-medium text-amber-700">
              {currentQuestion + 1} / {questions.length}
            </span>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-6 py-2 rounded bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
              >
                Complete
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className="px-3 py-2 rounded bg-white border border-amber-100 text-amber-500 hover:bg-amber-100 transition disabled:opacity-40"
                aria-label="Next question"
              >
                Next
              </button>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl border border-amber-100 mb-10 animate-fade-in text-center">
            <h2 className="text-xl font-semibold text-amber-800 mb-8">
              {questions[currentQuestion].text}
            </h2>
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((score) => {
                const isSelected = scores[currentQuestion] === (questions[currentQuestion].code < 0 ? 6 - score : score);
                return (
                  <button
                    key={score}
                    onClick={() => {
                      handleScore(score);
                      if (currentQuestion < questions.length - 1) {
                        handleNext();
                      }
                    }}
                    className={`w-12 h-12 text-lg font-semibold rounded border transition-all duration-150 flex items-center justify-center
                      ${isSelected ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-400'}
                    `}
                    aria-label={`Score ${score}`}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-sm text-amber-400 mt-6">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>

          {isAdmin && (
            <div className="space-y-4 text-sm font-mono">
              {intermediateScores.map((score, index) => (
                <div key={index}>
                  Q{index + 1} (Code: {score.code}): Original: {score.originalScore}, Final:{' '}
                  {score.finalScore}
                </div>
              ))}
            </div>
          )}
          <style>{`
            @keyframes fade-in { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none; } }
            .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
          `}</style>
        </div>
      ) : (
        <ResultsCard scores={scores} email={authorizedEmail} />
      )}
    </div>
  );
}

export default App;