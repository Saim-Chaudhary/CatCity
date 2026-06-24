import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix broken marker icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Detects click on map and adds pin
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng)
  })
  return null
}

export default function App() {
  const [pins, setPins] = useState([])

  const handleMapClick = (latlng) => {
    setPins(prev => [...prev, { id: Date.now(), ...latlng }])
  }

  return (
    <MapContainer
      center={[31.45, 72.99]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onMapClick={handleMapClick} />

      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
          <Popup>🐱 Cat spotted here!</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}