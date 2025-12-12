import { useAtom } from 'jotai'
import { useState } from 'react'
import { djControllerAtom } from './atoms/djControllerAtom'
import DJControllerComponent from './components/controller/DJControllerComponent'

export default function MidiLogger() {
  const [midiState, setMidiState] = useAtom(djControllerAtom)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMidiMessage = (event: MIDIMessageEvent) => {
    const { data } = event
    if (!data)
      return

    const [status, data1, data2] = data
    const command = status >> 4
    const channel = status & 0xF
    const norm = data2 / 127.0
    const isNoteOn = command === 0x9 && data2 > 0

    // ログが多いと重くなるので、開発中以外はコメントアウト推奨
    // const logStr = `Ch:${channel + 1} Cmd:0x${command.toString(16)} D1:${data1} D2:${data2}`
    const logStr = `Ch:${channel + 1} D1:${data1} D2:${data2}`
    // console.log('MIDI Message:', logStr)

    setMidiState((prev) => {
      // 1. 最上位をコピー
      const next = { ...prev, lastMessage: logStr }

      // ------------------------------------------------------
      // MAPPING LOGIC
      // ------------------------------------------------------

      // --- DECK 1 & 2 ---
      if (channel === 0 || channel === 1) {
        const deckKey = channel === 0 ? 'deck1' : 'deck2'

        // ★重要：変更するDeckオブジェクトをコピーして新しい参照を作る
        next[deckKey] = { ...prev[deckKey] }
        // 配列もコピーが必要
        next[deckKey].pads = [...prev[deckKey].pads]

        if (command === 0x9 || command === 0x8) {
          switch (data1) {
            case 11: next[deckKey].playPause = isNoteOn
              break
            case 12: next[deckKey].cue = isNoteOn
              break
            case 63: next[deckKey].shift = isNoteOn
              break
            case 54: next[deckKey].jogTouch = isNoteOn
              break
            case 16: next[deckKey].loopIn = isNoteOn
              break
            case 17: next[deckKey].loopOut = isNoteOn
              break
            case 77: next[deckKey].loop4Beat = isNoteOn
              break
            case 81: next[deckKey].cueLoopCallLeft = isNoteOn
              break
            case 83: next[deckKey].cueLoopCallRight = isNoteOn
              break
            case 88: next[deckKey].beatSync = isNoteOn
              break

            case 27: if (isNoteOn)
              next[deckKey].padMode = 'Hot Cue'
              break
            case 30: if (isNoteOn)
              next[deckKey].padMode = 'Pad FX'
              break
            case 32: if (isNoteOn)
              next[deckKey].padMode = 'Beat Jump'
              break
            case 34: if (isNoteOn)
              next[deckKey].padMode = 'Sampler'
              break

            default:
              if (data1 >= 97 && data1 <= 104) {
                next[deckKey].pads[data1 - 97] = isNoteOn
              }
              // Ch Cue (Headphones)
              if (data1 === 84) {
                // Mixerも変更するのでコピーが必要
                next.mixer = { ...prev.mixer }
                if (channel === 0)
                  next.mixer.chCue1 = isNoteOn
                if (channel === 1)
                  next.mixer.chCue2 = isNoteOn
              }
              break
          }
        }

        if (command === 0xB) {
          // Mixer変更時は必ずコピー
          if ([4, 7, 11, 15, 19].includes(data1)) {
            next.mixer = { ...prev.mixer }
          }

          switch (data1) {
            case 0: next[deckKey].tempo = norm
              break
            case 33:
            case 34:
            case 35:
            case 41:
              next[deckKey].jogTurn = data2 === 1 ? 1 : data2 === 127 ? -1 : 0
              break

            case 4:
              if (channel === 0)
                next.mixer.trim1 = norm
              else next.mixer.trim2 = norm
              break
            case 7:
              if (channel === 0)
                next.mixer.eqHi1 = norm
              else next.mixer.eqHi2 = norm
              break
            case 11:
              if (channel === 0)
                next.mixer.eqMid1 = norm
              else next.mixer.eqMid2 = norm
              break
            case 15:
              if (channel === 0)
                next.mixer.eqLow1 = norm
              else next.mixer.eqLow2 = norm
              break
            case 19:
              if (channel === 0)
                next.mixer.chFader1 = norm
              else next.mixer.chFader2 = norm
              break
          }
        }
      }

      // --- EFFECT (Ch 5 & 6) ---
      if (channel === 4 || channel === 5) {
        // Effectを変更する場合もコピー
        next.effect = { ...prev.effect }

        if (command === 0x9 || command === 0x8) {
          if (data1 === 99)
            next.effect.fxSelect = isNoteOn
          if (data1 === 74)
            next.effect.beatLeft = isNoteOn
          if (data1 === 75)
            next.effect.beatRight = isNoteOn
          if (data1 === 71)
            next.effect.fxOn = isNoteOn
        }

        if (command === 0xB && data1 === 2) {
          next.effect.levelDepth = norm
        }
      }

      // --- GLOBAL / MIXER / BROWSE (Ch 7) ---
      if (channel === 6) {
        // 変更するセクションをコピー
        next.browse = { ...prev.browse }
        next.mixer = { ...prev.mixer }

        if (command === 0xB && data1 === 64) {
          next.browse.rotaryTurn = data2 === 1 ? 1 : -1
        }
        if (command === 0x9 && data1 === 65)
          next.browse.rotaryPush = isNoteOn
        if (command === 0x9 && data1 === 70)
          next.browse.load1 = isNoteOn
        if (command === 0x9 && data1 === 71)
          next.browse.load2 = isNoteOn

        if (command === 0xB) {
          if (data1 === 8)
            next.mixer.masterLevel = norm
          if (data1 === 31)
            next.mixer.crossFader = norm
          if (data1 === 23)
            next.mixer.cfx1 = norm
          if (data1 === 24)
            next.mixer.cfx2 = norm
          if (data1 === 5)
            next.mixer.micLevel = norm
          if (data1 === 12)
            next.mixer.headphoneMix = norm
          if (data1 === 13)
            next.mixer.headphoneLevel = norm
        }
        if (command === 0x9) {
          if (data1 === 99)
            next.mixer.masterCue = isNoteOn
          if (data1 === 0)
            next.mixer.smartCfx = isNoteOn
          if (data1 === 1)
            next.mixer.smartFader = isNoteOn
        }
      }

      // --- PADS for DECK 1 & 2 (Ch 8 & 10) ---
      if (channel === 7 || channel === 9) {
        const deckKey = channel === 7 ? 'deck1' : 'deck2'

        // DeckとPads配列をコピーして新しい参照を作る
        next[deckKey] = { ...prev[deckKey] }
        next[deckKey].pads = [...prev[deckKey].pads]

        if (command === 0x9 || command === 0x8) { // Note On/Off
          let padIndex = -1

          // Rekordbox標準マップに基づくパッドインデックス計算
          // 0-7: Hot Cue
          // 32-39: Pad FX
          // 48-55: Beat Jump
          // 64-71: Sampler
          // 80-87: Key Shift
          // 96-103: Beat Loop

          if (data1 >= 0 && data1 <= 7) {
            padIndex = data1
            // モード切替表示を更新しても良い
            if (isNoteOn)
              next[deckKey].padMode = 'Hot Cue'
          }
          else if (data1 >= 32 && data1 <= 39) {
            padIndex = data1 - 32
            if (isNoteOn)
              next[deckKey].padMode = 'Pad FX'
          }
          else if (data1 >= 48 && data1 <= 55) {
            padIndex = data1 - 48
            if (isNoteOn)
              next[deckKey].padMode = 'Beat Jump'
          }
          else if (data1 >= 64 && data1 <= 71) {
            padIndex = data1 - 64
            if (isNoteOn)
              next[deckKey].padMode = 'Sampler'
          }
          else if (data1 >= 96 && data1 <= 103) {
            padIndex = data1 - 96
            if (isNoteOn)
              next[deckKey].padMode = 'Beat Loop'
          }

          // 有効なパッド範囲ならStateを更新
          if (padIndex >= 0 && padIndex < 8) {
            next[deckKey].pads[padIndex] = isNoteOn
          }
        }
      }

      return next
    })
  }

  const connectMidi = async () => {
    if (!navigator.requestMIDIAccess) {
      setError('Web MIDI API not supported')
      return
    }
    try {
      const access = await navigator.requestMIDIAccess()
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage
      })
      setIsReady(true)
    }
    catch (e) {
      console.error(e)
      setError('MIDI Access Failed')
    }
  }

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
        <button onClick={connectMidi} disabled={isReady} style={{ padding: '10px 20px', fontSize: '16px', background: isReady ? '#2e7d32' : '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isReady ? 'MIDI Connected' : 'Connect DDJ-FLX4'}
        </button>
        <span style={{ marginLeft: '20px', fontFamily: 'monospace', color: '#888' }}>
          Last:
          {' '}
          {midiState.lastMessage}
        </span>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>
      <DJControllerComponent state={midiState} />
    </div>
  )
}
