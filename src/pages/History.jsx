import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function VerdictBadge({ verdict }) {
  const styles = {
    'Strong Yes': { bg: '#16a34a20', border: '#16a34a40', color: '#4ade80' },
    'Lean Yes':   { bg: '#7c3aed20', border: '#7c3aed40', color: '#a78bfa' },
    'Neutral':    { bg: '#ca8a0420', border: '#ca8a0440', color: '#fbbf24' },
    'Lean No':    { bg: '#ea580c20', border: '#ea580c40', color: '#fb923c' },
    'Strong No':  { bg: '#dc262620', border: '#dc262640', color: '#f87171' },
  }
  const s = styles[verdict] || styles['Neutral']
  return (
    <span style={{ backgroundColor: s.bg, borderColor: s.border, color: s.color }}
      className="px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap">
      {verdict}
    </span>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/decisions')
      .then(res => setDecisions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-24 pb-28 md:pb-12">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">History</h2>
          <p className="text-zinc-500 text-sm mt-1">All your past decisions</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-600">Loading...</p>
          </div>
        ) : decisions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-zinc-400 font-medium mb-1">No decisions yet</p>
            <p className="text-zinc-600 text-sm mb-6">Your decision history will appear here</p>
            <button
              onClick={() => navigate('/')}
              style={{ backgroundColor: '#7c3aed' }}
              className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Make your first decision
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {decisions.map(d => (
              <div
                key={d.id}
                onClick={() => navigate(`/result/${d.id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-zinc-600 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <p className="text-white font-medium text-sm leading-snug">{d.title}</p>
                  <VerdictBadge verdict={d.verdict} />
                </div>
                <div className="flex gap-4 text-xs text-zinc-600">
                  <span>
                    Score: <span className="text-zinc-300 font-medium">{Math.round(d.simulated_score * 100)}%</span>
                  </span>
                  <span>
                    Regret: <span className="text-zinc-300 font-medium">{Math.round(d.regret_probability * 100)}%</span>
                  </span>
                  <span className="ml-auto">
                    {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}