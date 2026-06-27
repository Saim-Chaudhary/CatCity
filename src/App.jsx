import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

import './utils/leafletConfig'

import StatsBar from './components/StatsBar'
import ReportForm from './components/ReportForm'
import ClickHandler from './components/ClickHandler'
import HeatmapLayer from './components/HeatmapLayer'
import LocationFlyTo from './components/LocationFlyTo'
import UserMarker from './components/UserMarker'
import PinMarkers from './components/PinMarkers'

export default function App() {
  const [pins, setPins] = useState([])
  const [pendingLocation, setPendingLocation] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('asking')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        setLocationStatus('granted')
      },
      () => setLocationStatus('denied')
    )
  }, [])

  const handleFormSubmit = ({ latlng, type, notes }) => {
    setPins(prev => [
      ...prev,
      {
        id: Date.now(),
        lat: latlng.lat,
        lng: latlng.lng,
        type,
        notes
      }
    ])

    setPendingLocation(null)
  }

  return (
    <>
      <StatsBar pins={pins} />

      {locationStatus === 'asking' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '280px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐱</div>
            <h2 style={{ marginBottom: '8px' }}>CatCity</h2>
            <p style={{ color: '#666', marginBottom: '0' }}>
              Finding your location to show nearby cats...
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onMapClick={setPendingLocation} />
        <LocationFlyTo userLocation={userLocation} />
        <HeatmapLayer pins={pins} />
        <UserMarker userLocation={userLocation} />
        <PinMarkers pins={pins} />
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