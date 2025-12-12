import type { DJControllerState } from '../../types/midi'
import DeckPanel from './DeckPanel'
import MixerPanel from './MixerPanel'
import TopPanel from './TopPanel'

export default function DJControllerComponent({ state }: { state: DJControllerState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <TopPanel browse={state.browse} effect={state.effect} />
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <DeckPanel deck={state.deck1} id={1} />
        <MixerPanel mixer={state.mixer} />
        <DeckPanel deck={state.deck2} id={2} />
      </div>
    </div>
  )
}
