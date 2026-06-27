import { useState } from 'react'

export default function ReportForm({ latlng, onSubmit, onCancel }) {
  const [type, setType] = useState('sighting')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!notes.trim()) return alert('Please add a note!')
    onSubmit({ latlng, type, notes })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        zIndex: 9999,
        width: '300px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <h3 style={{ marginBottom: '16px' }}>🐱 Report a Cat</h3>

      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold',
        }}
      >
        Type
      </label>

      <select
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="sighting">🐱 Cat Sighting</option>
        <option value="feeding">🍽️ Feeding Station</option>
        <option value="shelter">🏠 Shelter</option>
        <option value="rescue">🚨 Rescue Needed</option>
      </select>

      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold',
        }}
      >
        Notes
      </label>

      <textarea
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          height: '80px',
          resize: 'none',
        }}
        placeholder="Describe what you saw..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          style={{
            flex: 1,
            padding: '10px',
            background: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          style={{
            flex: 1,
            padding: '10px',
            background: '#e5e7eb',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}