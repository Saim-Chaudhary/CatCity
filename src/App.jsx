import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// ── 1. Fly to user location ──────────────────────────────
function LocationFlyTo({ userLocation }) {
  const map = useMap()
  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.5 })
    }
  }, [userLocation])
  return null
}

// ── 2. Click handler ─────────────────────────────────────
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng)
  })
  return null
}

// ── 3. Heatmap layer ─────────────────────────────────────
function HeatmapLayer({ pins }) {
  const map = useMap()
  useEffect(() => {
    if (!pins.length) return
    const points = pins.map(pin => [pin.lat, pin.lng, 1])
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
    })
    heat.addTo(map)
    return () => map.removeLayer(heat)
  }, [pins])
  return null
}

// ── 4. Report form ───────────────────────────────────────
function ReportForm({ latlng, onSubmit, onCancel }) {
  const [type, setType] = useState('sighting')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!notes.trim()) return alert('Please add a note!')
    onSubmit({ latlng, type, notes })
  }

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white', padding: '24px', borderRadius: '12px',
      zIndex: 9999, width: '300px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ marginBottom: '16px' }}>🐱 Report a Cat</h3>

      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Type</label>
      <select
        style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
        value={type} onChange={e => setType(e.target.value)}
      >
        <option value="sighting">🐱 Cat Sighting</option>
        <option value="feeding">🍽️ Feeding Station</option>
        <option value="shelter">🏠 Shelter</option>
        <option value="rescue">🚨 Rescue Needed</option>
      </select>

      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Notes</label>
      <textarea
        style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc', height: '80px', resize: 'none' }}
        placeholder="Describe what you saw..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          style={{ flex: 1, padding: '10px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={handleSubmit}
        >Submit</button>
        <button
          style={{ flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={onCancel}
        >Cancel</button>
      </div>
    </div>
  )
}

// ── 5. Emoji map ─────────────────────────────────────────
const typeEmoji = {
  sighting: '🐱',
  feeding: '🍽️',
  shelter: '🏠',
  rescue: '🚨'
}

function StatsBar({ pins }) {
  const counts = {
    sighting: pins.filter(p => p.type === 'sighting').length,
    feeding: pins.filter(p => p.type === 'feeding').length,
    shelter: pins.filter(p => p.type === 'shelter').length,
    rescue: pins.filter(p => p.type === 'rescue').length,
  }

  return (
    <div style={{
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
      whiteSpace: 'nowrap'
    }}>
      <span>🐱 {counts.sighting} Sightings</span>
      <span>🍽️ {counts.feeding} Feeding</span>
      <span>🏠 {counts.shelter} Shelters</span>
      <span style={{ color: counts.rescue > 0 ? '#ef4444' : 'inherit' }}>
        🚨 {counts.rescue} Rescue
      </span>
    </div>
  )
}

// ── 6. Main App ──────────────────────────────────────────
export default function App() {
  const [pins, setPins] = useState([])
  const [pendingLocation, setPendingLocation] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('asking')

  useEffect(() => {
    if (!navigator.geolocation) { setLocationStatus('denied'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('granted')
      },
      () => setLocationStatus('denied')
    )
  }, [])

  const handleFormSubmit = ({ latlng, type, notes }) => {
    setPins(prev => [...prev, { id: Date.now(), lat: latlng.lat, lng: latlng.lng, type, notes }])
    setPendingLocation(null)
  }

  return (
    <>
      <StatsBar pins={pins} />
      {locationStatus === 'asking' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', textAlign: 'center', maxWidth: '280px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐱</div>
            <h2 style={{ marginBottom: '8px' }}>CatCity</h2>
            <p style={{ color: '#666', marginBottom: '0' }}>Finding your location to show nearby cats...</p>
          </div>
        </div>
      )}

      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onMapClick={setPendingLocation} />
        <LocationFlyTo userLocation={userLocation} />
        <HeatmapLayer pins={pins} />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: '',
              html: '<div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(59,130,246,0.8)"></div>',
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            })}
          >
            <Popup>📍 You are here</Popup>
          </Marker>
        )}

        {pins.map(pin => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{typeEmoji[pin.type]} {pin.type.toUpperCase()}</strong><br />{pin.notes}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {pendingLocation && (
        <ReportForm
          latlng={pendingLocation}
          onSubmit={handleFormSubmit}
          onCancel={() => setPendingLocation(null)}
        />
      )}
    </>
  )
}