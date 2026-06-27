import { Marker, Popup } from 'react-leaflet'
import typeEmoji from '../constants/typeEmoji'

export default function PinMarkers({ pins }) {
  return (
    <>
      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
          <Popup>
            <strong>{typeEmoji[pin.type]} {pin.type.toUpperCase()}</strong>
            <br />
            {pin.notes}
          </Popup>
        </Marker>
      ))}
    </>
  )
}