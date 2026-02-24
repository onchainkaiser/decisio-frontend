import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'


function ScoreSlider({ label, name, description, value, onChange }) {
  const percent = ((value - 1) / 9) * 100
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
      <div className="flex justify-between items-start mb-1">
        <div>
          <p className="text-white font-medium text-sm">{label}</p>
          <p className="text-zinc-500 text-xs mt-0.5">{description}</p>
        </div>
        <span className="text-2xl font-bold text-violet-400 ml-4">{value}</span>
      </div>
      <div className="mt-4">
        <input
          type="range"
          name={name}
          min="1"
          max="10"
          value={value}
          onChange={onChange}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #7c3aed ${percent}%, #27272a ${percent}%)`
          }}
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}


export default function NewDecision() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [scores, setScores] = useState({
    importance: 5,
    risk: 5,
    short_term_gain: 5,
    long_term_impact: 5,
    discipline_alignment: 5,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSlider(e) {
    setScores({ ...scores, [e.target.name]: Number(e.target.value) })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/decisions', { title, ...scores })
      navigate(`/result/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-24 pb-28 md:pb-12">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">New Decision</h2>
          <p className="text-zinc-500 text-sm mt-1">Score each factor honestly. The engine handles the rest.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              What is the decision?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Should I quit my job and start a business"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition placeholder-zinc-600"
            />
          </div>

          <ScoreSlider
            label="Importance"
            name="importance"
            description="How much does this decision matter to your life?"
            value={scores.importance}
            onChange={handleSlider}
          />
          <ScoreSlider
            label="Risk"
            name="risk"
            description="How risky is this? Higher = more dangerous downside."
            value={scores.risk}
            onChange={handleSlider}
          />
          <ScoreSlider
            label="Short Term Gain"
            name="short_term_gain"
            description="How much do you benefit in the near future?"
            value={scores.short_term_gain}
            onChange={handleSlider}
          />
          <ScoreSlider
            label="Long Term Impact"
            name="long_term_impact"
            description="How positive is the long term outcome?"
            value={scores.long_term_impact}
            onChange={handleSlider}
          />
          <ScoreSlider
            label="Discipline Alignment"
            name="discipline_alignment"
            description="How aligned is this with your values and goals?"
            value={scores.discipline_alignment}
            onChange={handleSlider}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: loading ? '#52525b' : '#7c3aed' }}
            className="w-full text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-sm mt-2"
          >
            {loading ? 'Analyzing...' : 'Analyze Decision →'}
          </button>
        </form>

      </div>
    </div>
  )
}