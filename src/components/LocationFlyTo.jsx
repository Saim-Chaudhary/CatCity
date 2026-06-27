import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function LocationFlyTo({ userLocation }) {
  const map = useMap()

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 14, {
        duration: 1.5
      })
    }
  }, [userLocation])

  return null
}