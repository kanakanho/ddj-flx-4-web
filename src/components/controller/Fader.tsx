export default function Fader({ label, value, height = 150 }: { label: string, value: number, height?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px' }}>
      <div style={{ width: '10px', height: `${height}px`, background: '#333', position: 'relative', borderRadius: '5px' }}>
        <div style={{
          position: 'absolute',
          left: '-5px',
          width: '20px',
          height: '30px',
          background: '#ccc',
          borderRadius: '2px',
          bottom: `${value * (height - 30)}px`,
          transition: 'bottom 0.05s linear',
        }}
        />
      </div>
      <span style={{ fontSize: '10px', marginTop: '8px', color: '#aaa' }}>{label}</span>
    </div>
  )
}
