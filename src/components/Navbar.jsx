import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  const links = [
    { label: 'Decide', path: '/', icon: '⚡' },
    { label: 'History', path: '/history', icon: '📋' },
    { label: 'Analytics', path: '/analytics', icon: '📊' },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm px-6 py-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-white font-semibold text-lg">Decisio</span>
        </div>

        <div className="flex items-center gap-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname === link.path
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-sm">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-red-400 text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-2 py-3 flex justify-around items-center">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition px-4 ${
              location.pathname === link.path
                ? 'text-violet-400'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-xs font-medium text-zinc-500 hover:text-red-400 transition px-4"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </nav>
    </>
  )
}