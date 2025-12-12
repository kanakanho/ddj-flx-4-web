export default function Knob({ label, value, color = '#00e5ff' }: { label: string, value: number, color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${color}`, position: 'relative', background: '#222' }}>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '2px',
          height: '50%',
          background: color,
          transformOrigin: 'bottom center',
          transform: `translate(-50%, 0) rotate(${(value * 270) - 135}deg)`,
        }}
        />
      </div>
      <span style={{ fontSize: '10px', marginTop: '4px', color: '#aaa' }}>{label}</span>
    </div>
  )
}
