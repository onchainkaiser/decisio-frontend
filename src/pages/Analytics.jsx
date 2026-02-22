import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-2xl">{value}</p>
      {sub && <p className="text-zinc-600 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function TrendPill({ value }) {
  const config = {
    improving: { color: '#4ade80', bg: '#16a34a20', border: '#16a34a40' },
    declining:  { color: '#f87171', bg: '#dc262620', border: '#dc262640' },
    worsening:  { color: '#f87171', bg: '#dc262620', border: '#dc262640' },
    stable:     { color: '#fbbf24', bg: '#ca8a0420', border: '#ca8a0440' },
  }
  const c = config[value] || config.stable
  return (
    <span style={{ color: c.color, backgroundColor: c.bg, borderColor: c.border }}
      className="px-3 py-1 rounded-full border text-xs font-semibold capitalize">
      {value}
    </span>
  )
}

export default function Analytics() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/me')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-500">Loading analytics...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-24 pb-28 md:pb-12">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-zinc-500 text-sm mt-1">Your decision patterns over time</p>
        </div>

        {!data || data.message ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-zinc-400 font-medium mb-1">No data yet</p>
            <p className="text-zinc-600 text-sm mb-6">Make decisions to build your profile</p>
            <button
              onClick={() => navigate('/')}
              style={{ backgroundColor: '#7c3aed' }}
              className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Make your first decision
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Total Decisions"
                value={data.total_decisions}
                sub="decisions analyzed"
              />
              <StatCard
                label="Avg Score"
                value={`${Math.round(data.averages.score * 100)}%`}
                sub="rational score"
              />
              <StatCard
                label="Avg Regret Risk"
                value={`${Math.round(data.averages.regret_probability * 100)}%`}
                sub="regret probability"
              />
              <StatCard
                label="Risk Tolerance"
                value={`${data.averages.risk_tolerance}/10`}
                sub="avg risk taken"
              />
            </div>

            {/* Trends */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Score Trend</span>
                  <TrendPill value={data.trends.score_trend} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Regret Trend</span>
                  <TrendPill value={data.trends.regret_trend} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Volatility</span>
                  <span className="text-white font-semibold text-sm">{data.trends.volatility}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Discipline Alignment</span>
                  <span className="text-white font-semibold text-sm">{data.averages.discipline_alignment}/10</span>
                </div>
              </div>
            </div>

            {/* Verdict Distribution */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Verdict Distribution</h3>
              <div className="space-y-3">
                {Object.entries(data.verdict_distribution).map(([verdict, count]) => {
                  const total = data.total_decisions
                  const pct = Math.round((count / total) * 100)
                  const colors = {
                    'Strong Yes': '#4ade80',
                    'Lean Yes': '#a78bfa',
                    'Neutral': '#fbbf24',
                    'Lean No': '#fb923c',
                    'Strong No': '#f87171',
                  }
                  return (
                    <div key={verdict}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">{verdict}</span>
                        <span className="text-zinc-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: colors[verdict] || '#7c3aed' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Behavioral Insights */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Behavioral Insights</h3>
              <div className="space-y-3">
                {data.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                    <p className="text-zinc-300 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Timeline */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Recent Decisions</h3>
              <div className="space-y-2">
                {data.timeline.slice().reverse().map(d => (
                  <div
                    key={d.id}
                    onClick={() => navigate(`/result/${d.id}`)}
                    className="flex justify-between items-center cursor-pointer hover:bg-zinc-800 rounded-xl px-3 py-2.5 transition-all duration-150"
                  >
                    <p className="text-zinc-300 text-sm truncate max-w-xs">{d.title}</p>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-violet-400 text-sm font-semibold">
                        {Math.round(d.score * 100)}%
                      </span>
                      <span className="text-zinc-600 text-xs">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}