import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface EmailGateProps {
  onAuthorized: (email: string) => void;
}

export const EmailGate: React.FC<EmailGateProps> = ({ onAuthorized }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Query the 'resume cheque' table for the email
    const { data, error: dbError } = await supabase
      .from('resumes')
      .select('email')
      .eq('email', email)
      .single();
    setLoading(false);
    if (dbError || !data) {
      setError('You are not authorised to give this test');
      return;
    }
    onAuthorized(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl border border-amber-100 w-full max-w-sm animate-fade-in"
        style={{ boxShadow: '0 2px 12px 0 rgba(251,191,36,0.03)' }}
      >
        <h2 className="text-xl font-semibold text-amber-800 mb-6 text-center">Sign in to take the test</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-amber-200 rounded mb-4 focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-amber-300 bg-amber-50"
          placeholder="Email address"
          required
          autoFocus
        />
        {error && <div className="text-red-500 mb-3 text-center text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-2 rounded font-medium hover:bg-amber-600 transition disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>Verifying...</span>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};
