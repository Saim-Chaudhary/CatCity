import { useMapEvents } from 'react-leaflet'

export default function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng)
  })

  return null
}