import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from '../utils/leafletConfig'
import 'leaflet.heat'

export default function HeatmapLayer({ pins }) {
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