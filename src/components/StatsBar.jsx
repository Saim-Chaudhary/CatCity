export default function StatsBar({ pins }) {
  const counts = {
    sighting: pins.filter((p) => p.type === 'sighting').length,
    feeding: pins.filter((p) => p.type === 'feeding').length,
    shelter: pins.filter((p) => p.type === 'shelter').length,
    rescue: pins.filter((p) => p.type === 'rescue').length,
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '10px 20px',
        borderRadius: '999px',
        zIndex: 9999,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '20px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }}
    >
      <span>🐱 {counts.sighting} Sightings</span>
      <span>🍽️ {counts.feeding} Feeding</span>
      <span>🏠 {counts.shelter} Shelters</span>

      <span
        style={{
          color: counts.rescue > 0 ? '#ef4444' : 'inherit',
        }}
      >
        🚨 {counts.rescue} Rescue
      </span>
    </div>
  )
}