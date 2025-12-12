import type { MixerState } from '../../types/midi'
import Button from './Button'
import Fader from './Fader'
import Knob from './Knob'

export default function MixerPanel({ mixer }: { mixer: MixerState }) {
  return (
    <div style={{ width: '350px', padding: '20px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>

      {/* Global Mixer Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <Knob label="MIC" value={mixer.micLevel} />
        <Knob label="HP MIX" value={mixer.headphoneMix} />
        <Knob label="HP LEVEL" value={mixer.headphoneLevel} />
        <Knob label="MASTER" value={mixer.masterLevel} color="#fff" />
      </div>

      {/* Channel Strips */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flex: 1 }}>
        {/* CH 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: '#888', fontSize: '12px' }}>CH 1</div>
          <Knob label="TRIM" value={mixer.trim1} color="#ddd" />
          <Knob label="HI" value={mixer.eqHi1} />
          <Knob label="MID" value={mixer.eqMid1} />
          <Knob label="LOW" value={mixer.eqLow1} />
          <Knob label="CFX" value={mixer.cfx1} color="#2979ff" />
          <Button label="CUE" active={mixer.chCue1} color="#ff9800" />
          <Fader label="VOL" value={mixer.chFader1} />
        </div>

        {/* Center Utility */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button label="M.CUE" active={mixer.masterCue} color="#ff9800" />
            <Button label="S.CFX" active={mixer.smartCfx} color="#00e5ff" />
            <Button label="S.FDR" active={mixer.smartFader} color="#00e5ff" />
          </div>
        </div>

        {/* CH 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: '#888', fontSize: '12px' }}>CH 2</div>
          <Knob label="TRIM" value={mixer.trim2} color="#ddd" />
          <Knob label="HI" value={mixer.eqHi2} />
          <Knob label="MID" value={mixer.eqMid2} />
          <Knob label="LOW" value={mixer.eqLow2} />
          <Knob label="CFX" value={mixer.cfx2} color="#2979ff" />
          <Button label="CUE" active={mixer.chCue2} color="#ff9800" />
          <Fader label="VOL" value={mixer.chFader2} />
        </div>
      </div>

      {/* Crossfader */}
      <div style={{ marginTop: '30px', padding: '10px', background: '#111', borderRadius: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px' }}>A</span>
          <div style={{ flex: 1, height: '10px', background: '#000', position: 'relative', borderRadius: '5px' }}>
            <div style={{
              position: 'absolute',
              top: '-5px',
              width: '30px',
              height: '20px',
              background: '#ccc',
              borderRadius: '2px',
              left: `${mixer.crossFader * 90}%`, // 簡易的な幅調整
            }}
            />
          </div>
          <span style={{ fontSize: '10px' }}>B</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: '9px', color: '#666', marginTop: '5px' }}>CROSSFADER</div>
      </div>
    </div>
  )
}
