export default function Button({ label, active, color = 'red', wide = false }: { label: string, active: boolean, color?: string, wide?: boolean }) {
  return (
    <div style={{
      padding: wide ? '5px 20px' : '8px 12px',
      margin: '3px',
      borderRadius: '4px',
      background: active ? color : '#333',
      color: active ? '#000' : '#888',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      transition: 'background 0.1s',
      border: active ? `1px solid ${color}` : '1px solid #444',
    }}
    >
      {label}
    </div>
  )
}
