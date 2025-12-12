import type { DeckState } from '../../types/midi'
import Button from './Button'

export default function DeckPanel({ deck, id }: { deck: DeckState, id: number }) {
  return (
    <div style={{ flex: 1, padding: '20px', background: '#111', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h3 style={{ margin: 0, color: '#666', textAlign: 'center' }}>
        DECK
        {id}
      </h3>

      {/* Loop Section */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
        <Button label="IN/4" active={deck.loopIn} color="#ff9800" />
        <Button label="OUT" active={deck.loopOut} color="#ff9800" />
        <Button label="EXIT" active={deck.loop4Beat} color="#ff9800" />
        <Button label="CUE CALL <" active={deck.cueLoopCallLeft} color="#ff9800" />
        <Button label="CUE CALL >" active={deck.cueLoopCallRight} color="#ff9800" />
      </div>

      {/* Jog Wheel */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, #333 0%, #222 100%)`,
          border: deck.jogTouch ? '4px solid #00e5ff' : '4px solid #444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#fff' }}>JOG</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{deck.jogTurn !== 0 ? (deck.jogTurn > 0 ? '>> CW' : '<< CCW') : 'STOP'}</div>
          </div>
        </div>
      </div>

      {/* Transport & Shift */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button label="CUE" active={deck.cue} color="#ff9800" wide />
          <Button label="PLAY" active={deck.playPause} color="#00e676" wide />
        </div>
        <Button label="SHIFT" active={deck.shift} color="#fff" />
      </div>

      {/* Tempo Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#222', padding: '10px', borderRadius: '4px' }}>
        <span style={{ fontSize: '10px' }}>TEMPO</span>
        <div style={{ flex: 1, height: '4px', background: '#444', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-6px',
            width: '10px',
            height: '16px',
            background: '#ccc',
            left: `${deck.tempo * 100}%`,
          }}
          />
        </div>
        <Button label="SYNC" active={deck.beatSync} color="#ff3d00" />
      </div>

      {/* Pads */}
      <div style={{ borderTop: '1px solid #333', paddingTop: '10px' }}>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#888', marginBottom: '5px' }}>
          PAD MODE:
          {' '}
          <span style={{ color: '#fff' }}>{deck.padMode}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {deck.pads.map((active, i) => (
            <div
              key={i}
              style={{
                height: '40px',
                background: active ? '#00e5ff' : '#333',
                borderRadius: '4px',
                boxShadow: active ? '0 0 10px #00e5ff' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
