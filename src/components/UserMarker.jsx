import { Marker, Popup } from 'react-leaflet'
import L from '../utils/leafletConfig'

export default function UserMarker({ userLocation }) {
  if (!userLocation) return null

  return (
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
  )
}