import React, { useEffect, useState } from 'react';
import { calculateTraitScores } from '../utils/scoring';
import { supabase } from '../supabaseClient';
import { PersonalityChart } from './PersonalityChart';

interface ResultsCardProps {
  scores: number[];
  email: string;
}

type ProfileScoreResponse = { profile_score: number } | null; // Supabase response type

export function ResultsCard({ scores, email }: ResultsCardProps) {
  const traitScores = calculateTraitScores(scores);
  const traits = [
    { name: 'Extraversion', description: 'Energy, positive emotions, assertiveness, sociability and the tendency to seek stimulation in the company of others.' },
    { name: 'Agreeableness', description: 'A tendency to be compassionate and cooperative rather than suspicious and antagonistic towards others.' },
    { name: 'Conscientiousness', description: 'A tendency to be organized and dependable, show self-discipline, act dutifully, aim for achievement, and prefer planned rather than spontaneous behavior.' },
    { name: 'Neuroticism', description: 'The tendency to experience unpleasant emotions easily, such as anger, anxiety, depression, and vulnerability.' },
    { name: 'Openness', description: 'Appreciation for art, emotion, adventure, unusual ideas, curiosity, and variety of experience.' },
  ];

  const getScoreColor = (score: number) => {
    const normalizedScore = (score + 50) / 100;
    if (normalizedScore < 0.4) return 'text-amber-600';
    if (normalizedScore < 0.6) return 'text-amber-500';
    return 'text-emerald-600';
  };

  // take no decimal points. if score is 23.34 take 23
  const personalityScore = Math.floor(((traitScores[4] * 0.2 ) + (traitScores[2] * 0.2) + (traitScores[0] * 0.2) + (traitScores[1] * 0.2) + (traitScores[3] * 0.2)) * 0.3);

  // State for profileScore, fitmentScore, and error
  const [profileScore, setProfileScore] = useState<number | null>(null);
  const [fitmentScore, setFitmentScore] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch profile_score and calculate fitment_score
  useEffect(() => {
    async function fetchProfileScore() {
      setFetchError(null);
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('profile_score')
          .eq('email', email)
          .single();
        if (error) {
          setFetchError('Failed to fetch profile score.');
          setProfileScore(null);
          setFitmentScore(null);
        } else if (data && data.profile_score != null) {
          setProfileScore(data.profile_score);
          setFitmentScore(Math.floor(data.profile_score + personalityScore));
        } else {
          setProfileScore(null);
          setFitmentScore(null);
        }
      } catch (err) {
        setFetchError('An unexpected error occurred.');
        setProfileScore(null);
        setFitmentScore(null);
      }
    }
    fetchProfileScore();
  }, [email, personalityScore]);

  useEffect(() => {
    // Update the user's scores in Supabase
    async function updateScores() {
      await supabase
        .from('resumes')
        .update({
          openness: traitScores[4],
          conscientiousness: traitScores[2],
          extraversion: traitScores[0],
          agreeableness: traitScores[1],
          neuroticism: traitScores[3],
          personality_analysis_completed: true,
          personality_score: personalityScore,
          fitment_score: fitmentScore,
        })
        .eq('email', email);
    }
    if (fitmentScore !== null) {
      updateScores();
    }
  }, [traitScores, email, personalityScore, fitmentScore]);

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl border border-amber-100 animate-fade-in">
        <h2 className="text-2xl font-semibold text-center text-amber-800 mb-8">Your Personality Profile</h2>
        {fetchError && (
          <div className="mb-4 text-red-600 text-center text-sm">{fetchError}</div>
        )}
        <div className="flex flex-col md:flex-row md:gap-10 md:items-start mb-8">
          <div className="flex-1 flex items-center justify-center mb-6 md:mb-0">
            <PersonalityChart scores={traitScores} />
          </div>
          <div className="flex-1">
            <ul className="space-y-5">
              {traits.map((trait, index) => (
                <li key={trait.name} className="flex flex-col gap-1 bg-amber-50 rounded p-4 border border-amber-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-semibold text-amber-800">{trait.name}</span>
                    <span className={`text-base font-semibold px-2 py-0.5 rounded ${getScoreColor(traitScores[index])} bg-amber-100`}>{traitScores[index]}</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2 mb-1">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, traitScores[index]))}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-amber-500">{trait.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Optionally show scores */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-4">
          {typeof profileScore === 'number' && (
            <div className="text-sm text-amber-700 bg-amber-100 rounded px-4 py-2">Profile Score: <span className="font-bold">{profileScore}</span></div>
          )}
          <div className="text-sm text-amber-700 bg-amber-100 rounded px-4 py-2">Personality Score: <span className="font-bold">{personalityScore}</span></div>
          {typeof fitmentScore === 'number' && (
            <div className="text-sm text-amber-700 bg-amber-100 rounded px-4 py-2">Fitment Score: <span className="font-bold">{fitmentScore}</span></div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}