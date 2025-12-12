import type { BrowseState, EffectState } from '../../types/midi'
import Button from './Button'
import Knob from './Knob'

export default function TopPanel({ browse, effect }: { browse: BrowseState, effect: EffectState }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '10px', background: '#1a1a1a', borderBottom: '1px solid #444' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #444', padding: '10px', borderRadius: '8px' }}>
        <div style={{ fontSize: '12px', color: '#888' }}>BROWSE</div>
        <Button label="LOAD 1" active={browse.load1} color="#fff" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: browse.rotaryPush ? '#fff' : '#444', border: '2px solid #666' }}>
            {browse.rotaryTurn !== 0 && <div style={{ fontSize: '20px', textAlign: 'center', color: '#000' }}>{browse.rotaryTurn > 0 ? '↻' : '↺'}</div>}
          </div>
          <span style={{ fontSize: '9px' }}>PUSH</span>
        </div>
        <Button label="LOAD 2" active={browse.load2} color="#fff" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #444', padding: '10px', borderRadius: '8px' }}>
        <div style={{ fontSize: '12px', color: '#e91e63' }}>BEAT FX</div>
        <Button label="< BEAT" active={effect.beatLeft} color="#e91e63" />
        <Button label="BEAT >" active={effect.beatRight} color="#e91e63" />
        <Button label="SELECT" active={effect.fxSelect} color="#e91e63" />
        <Button label="ON/OFF" active={effect.fxOn} color="#e91e63" wide />
        <Knob label="LEVEL" value={effect.levelDepth} color="#e91e63" />
      </div>
    </div>
  )
}
