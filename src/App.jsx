import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng)
  })
  return null
}

// The form that appears when user clicks map
function ReportForm({ latlng, onSubmit, onCancel }) {
  const [type, setType] = useState('sighting')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!notes.trim()) return alert('Please add a note!')
    onSubmit({ latlng, type, notes })
  }

  const formStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    zIndex: 9999,
    width: '300px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  }

  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold' }
  const selectStyle = { width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc' }
  const textareaStyle = { width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc', height: '80px', resize: 'none' }
  const btnRowStyle = { display: 'flex', gap: '8px' }
  const submitBtnStyle = { flex: 1, padding: '10px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
  const cancelBtnStyle = { flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }

  return (
    <div style={formStyle}>
      <h3 style={{ marginBottom: '16px' }}>🐱 Report a Cat</h3>

      <label style={labelStyle}>Type</label>
      <select style={selectStyle} value={type} onChange={e => setType(e.target.value)}>
        <option value="sighting">🐱 Cat Sighting</option>
        <option value="feeding">🍽️ Feeding Station</option>
        <option value="shelter">🏠 Shelter</option>
        <option value="rescue">🚨 Rescue Needed</option>
      </select>

      <label style={labelStyle}>Notes</label>
      <textarea
        style={textareaStyle}
        placeholder="Describe what you saw..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <div style={btnRowStyle}>
        <button style={submitBtnStyle} onClick={handleSubmit}>Submit</button>
        <button style={cancelBtnStyle} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

// Emoji per report type
const typeEmoji = {
  sighting: '🐱',
  feeding: '🍽️',
  shelter: '🏠',
  rescue: '🚨'
}

export default function App() {
  const [pins, setPins] = useState([])
  const [pendingLocation, setPendingLocation] = useState(null)

  const handleMapClick = (latlng) => {
    setPendingLocation(latlng)
  }

  const handleFormSubmit = ({ latlng, type, notes }) => {
    setPins(prev => [...prev, {
      id: Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
      type,
      notes
    }])
    setPendingLocation(null)
  }

  const handleCancel = () => {
    setPendingLocation(null)
  }

  return (
    <>
      <MapContainer
        center={[31.45, 72.99]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onMapClick={handleMapClick} />

        {pins.map(pin => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{typeEmoji[pin.type]} {pin.type.toUpperCase()}</strong>
              <br />
              {pin.notes}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Form overlay when location is picked */}
      {pendingLocation && (
        <ReportForm
          latlng={pendingLocation}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}