import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
      className="px-4 py-1.5 rounded-full border text-sm font-semibold">
      {verdict}
    </span>
  )
}

function ScoreRing({ value, label, color }) {
  const percent = Math.round(value * 100)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{percent}%</span>
        </div>
      </div>
      <p className="text-zinc-500 text-xs mt-2 text-center">{label}</p>
    </div>
  )
}

export default function DecisionResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [decision, setDecision] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/decisions/${id}`)
      .then(res => setDecision(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-500">Loading result...</p>
    </div>
  )

  if (!decision) return null

  let ai = null
  try { ai = JSON.parse(decision.ai_analysis) } catch {}

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-24 pb-28 md:pb-12">

        {/* Title + Verdict */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-4">
          <p className="text-zinc-600 text-xs mb-3">{new Date(decision.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h2 className="text-xl font-semibold text-white mb-4">{decision.title}</h2>
          <VerdictBadge verdict={decision.verdict} />
        </div>

        {/* Score Rings */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-4">
          <h3 className="text-white font-semibold mb-6">Engine Output</h3>
          <div className="grid grid-cols-3 gap-4">
            <ScoreRing value={decision.base_score} label="Rational Score" color="#7c3aed" />
            <ScoreRing value={decision.simulated_score} label="Simulated Score" color="#6366f1" />
            <ScoreRing value={decision.regret_probability} label="Regret Risk" color="#ef4444" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-zinc-800 rounded-xl p-4 text-center">
              <p className="text-zinc-500 text-xs mb-1">Worst Case (P10)</p>
              <p className="text-white font-bold text-2xl">{Math.round(decision.simulation_percentile_10 * 100)}%</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4 text-center">
              <p className="text-zinc-500 text-xs mb-1">Best Case (P90)</p>
              <p className="text-white font-bold text-2xl">{Math.round(decision.simulation_percentile_90 * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Your Inputs */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-4">
          <h3 className="text-white font-semibold mb-4">Your Inputs</h3>
          <div className="space-y-3">
            {[
              { label: 'Importance', value: decision.importance },
              { label: 'Risk', value: decision.risk },
              { label: 'Short Term Gain', value: decision.short_term_gain },
              { label: 'Long Term Impact', value: decision.long_term_impact },
              { label: 'Discipline Alignment', value: decision.discipline_alignment },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">{item.label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / 10) * 100}%`,
                        backgroundColor: item.label === 'Risk' ? '#ef4444' : '#7c3aed'
                      }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm w-8 text-right">{item.value}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        {ai && !ai._error && (
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-4">
            <h3 className="text-white font-semibold mb-4">AI Analysis</h3>
            <div className="space-y-4">
              {[
                { label: 'Logical Breakdown', key: 'logical_breakdown' },
                { label: 'Tradeoff', key: 'tradeoff_explanation' },
                { label: 'Suggestion', key: 'suggestion' },
                { label: 'Behavioral Insight', key: 'behavioral_insight' },
              ].map(item => (
                <div key={item.key} className="border-l-2 border-violet-600 pl-4">
                  <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{ai[item.key]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#7c3aed' }}
          className="w-full text-white font-semibold py-4 rounded-2xl text-sm"
        >
          Analyze Another Decision →
        </button>

      </div>
    </div>
  )
}