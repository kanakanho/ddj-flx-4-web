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
    const channel = status & 0xF // 0-15

    // JSスクリプトのロジックに基づく正規化
    // ノブ/スライダー: 0.0 - 1.0
    const norm = data2 / 127.0
    // ジョグホイール (Center 64): <64 rew, >64 fwd
    const jogValue = data2 - 64

    const isNoteOn = command === 0x9 && data2 > 0
    // Note Off (0x8) または Velocity 0 の Note On
    // const isNoteOff = command === 0x8 || (command === 0x9 && data2 === 0)

    const logStr = `Ch:${channel + 1} Cmd:0x${command.toString(16).toUpperCase()} D1:${data1} (0x${data1.toString(16).toUpperCase()}) D2:${data2}`

    setMidiState((prev) => {
      const next = { ...prev, lastMessage: logStr }

      // ------------------------------------------------------
      // MAPPING LOGIC (Based on Pioneer-DDJ-FLX4-script.js)
      // ------------------------------------------------------

      // === DECK 1 (Ch 1 / 0x00) & DECK 2 (Ch 2 / 0x01) ===
      // JS Script: Deck1 uses 0x90/0xB0, Deck2 uses 0x91/0xB1
      if (channel === 0 || channel === 1) {
        const deckKey = channel === 0 ? 'deck1' : 'deck2'

        // オブジェクトのコピー
        next[deckKey] = { ...prev[deckKey] }
        next[deckKey].pads = [...prev[deckKey].pads]

        // --- Note On/Off Messages ---
        if (command === 0x9 || command === 0x8) {
          switch (data1) {
            case 0x0B: next[deckKey].playPause = isNoteOn
              break // 11: Play/Pause
            case 0x0C: next[deckKey].cue = isNoteOn
              break // 12: Cue
            case 0x3F: next[deckKey].shift = isNoteOn
              break // 63: Shift (Standard Pioneer)
            case 0x36: next[deckKey].jogTouch = isNoteOn
              break // 54: Jog Touch (Check JS value, user code had 54)

            // Loop Section
            case 0x10: next[deckKey].loopIn = isNoteOn
              break // 16
            case 0x11: next[deckKey].loopOut = isNoteOn
              break // 17
            case 0x4C: next[deckKey].reloopExit = isNoteOn
              break // 76: Reloop/Exit
            case 0x51: next[deckKey].cueLoopCallLeft = isNoteOn
              break // 81
            case 0x53: next[deckKey].cueLoopCallRight = isNoteOn
              break // 83

            // Beat Sync
            case 0x58: next[deckKey].beatSync = isNoteOn
              break // 88

            // Pad Modes (Defined in JS lights section)
            case 0x1B: if (isNoteOn)
              next[deckKey].padMode = 'Hot Cue'
              break // 27
            case 0x69: if (isNoteOn)
              next[deckKey].padMode = 'Keyboard'
              break // 105
            case 0x1E: if (isNoteOn)
              next[deckKey].padMode = 'Pad FX 1'
              break // 30
            case 0x6B: if (isNoteOn)
              next[deckKey].padMode = 'Pad FX 2'
              break // 107
            case 0x20: if (isNoteOn)
              next[deckKey].padMode = 'Beat Jump'
              break // 32
            case 0x6D: if (isNoteOn)
              next[deckKey].padMode = 'Beat Loop'
              break // 109
            case 0x22: if (isNoteOn)
              next[deckKey].padMode = 'Sampler'
              break // 34
            case 0x6F: if (isNoteOn)
              next[deckKey].padMode = 'Key Shift'
              break // 111

            // Headphone Cue (Mixer Section but sent on Deck Channel sometimes)
            case 0x54: // 84: Ch Cue
              next.mixer = { ...prev.mixer }
              if (channel === 0)
                next.mixer.chCue1 = isNoteOn
              else next.mixer.chCue2 = isNoteOn

              break
          }
        }

        // --- Control Change Messages (CC) ---
        if (command === 0xB) {
          // JS: wheel center at 64; <64 rew >64 fwd
          // Pioneer Jog often on CC 33, 34, 35 (0x21, 0x22, 0x23)
          if (data1 === 0x21 || data1 === 0x22 || data1 === 0x23) {
            // 64を中心とした相対値を加算、あるいは値をそのままセット
            // ここでは回転速度として扱います
            next[deckKey].jogTurn = jogValue
          }

          // Tempo Slider
          if (data1 === 0x00) { // 0: Tempo
            next[deckKey].tempo = norm
          }

          // Mixer Controls (if sent on Deck Channels)
          // 多くのPioneerコントローラはMixer情報をCh 1/2ではなく
          // 独立したチャンネルか、特定のCCブロックで送りますが
          // ユーザーの元のコードに合わせてここにも配置します
          next.mixer = { ...prev.mixer }
          switch (data1) {
            case 0x04: (channel === 0) ? next.mixer.trim1 = norm : next.mixer.trim2 = norm
              break
            case 0x07: (channel === 0) ? next.mixer.eqHi1 = norm : next.mixer.eqHi2 = norm
              break
            case 0x0B: (channel === 0) ? next.mixer.eqMid1 = norm : next.mixer.eqMid2 = norm
              break
            case 0x0F: (channel === 0) ? next.mixer.eqLow1 = norm : next.mixer.eqLow2 = norm
              break
            case 0x13: (channel === 0) ? next.mixer.chFader1 = norm : next.mixer.chFader2 = norm
              break
          }
        }
      }

      // === BEAT FX (Ch 5 / 0x04) ===
      // JS Script: lights.beatFx uses 0x94 (Ch 5)
      if (channel === 4) {
        next.effect = { ...prev.effect }
        if (command === 0x9) {
          // Note Mappings (推測およびJSからの逆算)
          if (data1 === 0x47)
            next.effect.fxOn = isNoteOn // JS lights.beatFx.data1 is 0x47 (71)
          if (data1 === 0x43)
            next.effect.fxSelect = isNoteOn // JS shiftBeatFx data1 is 0x43 (67)
          // Beat Left/Right often around 74/75
          if (data1 === 74)
            next.effect.beatLeft = isNoteOn
          if (data1 === 75)
            next.effect.beatRight = isNoteOn
        }
        if (command === 0xB) {
          if (data1 === 2)
            next.effect.levelDepth = norm
        }
      }

      // === BROWSE / GLOBAL MIXER (Ch 7 / 0x06) ===
      if (channel === 6) {
        next.browse = { ...prev.browse }
        next.mixer = { ...prev.mixer }

        // Browse
        if (command === 0xB && data1 === 0x40) { // Rotary Turn
          next.browse.rotaryTurn = jogValue // 64 center
        }
        if (command === 0x9) {
          if (data1 === 0x41)
            next.browse.rotaryPush = isNoteOn // 65
          if (data1 === 0x46)
            next.browse.load1 = isNoteOn // 70
          if (data1 === 0x47)
            next.browse.load2 = isNoteOn // 71
        }

        // Mixer Global
        if (command === 0xB) {
          switch (data1) {
            case 0x08: next.mixer.masterLevel = norm
              break
            case 0x1F: next.mixer.crossFader = norm
              break // 31
            case 0x17: next.mixer.cfx1 = norm
              break // 23
            case 0x18: next.mixer.cfx2 = norm
              break // 24
            case 0x05: next.mixer.micLevel = norm
              break
            case 0x0C: next.mixer.headphoneMix = norm
              break
            case 0x0D: next.mixer.headphoneLevel = norm
              break
          }
        }
      }

      // === PADS (Ch 8-11 / 0x07 - 0x0A) ===
      // JS Script:
      // Ch 8 (0x97): Deck 1 Pads
      // Ch 9 (0x98): Deck 1 Pads (Shift)
      // Ch 10 (0x99): Deck 2 Pads
      // Ch 11 (0x9A): Deck 2 Pads (Shift)
      if (channel >= 7 && channel <= 10) {
        // Deck 1: Ch 7 or 8, Deck 2: Ch 9 or 10
        const isDeck1 = channel === 7 || channel === 8
        const deckKey = isDeck1 ? 'deck1' : 'deck2'

        next[deckKey] = { ...prev[deckKey] }
        next[deckKey].pads = [...prev[deckKey].pads]

        if (command === 0x9 || command === 0x8) {
          let padIndex = -1

          // Rekordbox/Serato Standard Mapping Ranges
          // Hot Cue: 0-7, 8-15
          // Pad FX: 32-39
          // Beat Jump: 64-71 (or specific map in JS output)
          // Sampler: 48-55 or 96-103

          // JS Script Output implies:
          // HotCue: 0x00 - 0x07
          // Sampler: 0x30 - 0x37 (48 - 55)

          if (data1 >= 0 && data1 <= 7) {
            padIndex = data1
          }
          else if (data1 >= 32 && data1 <= 39) {
            padIndex = data1 - 32
          }
          else if (data1 >= 48 && data1 <= 55) {
            padIndex = data1 - 48
          }
          else if (data1 >= 64 && data1 <= 71) {
            padIndex = data1 - 64
          }
          else if (data1 >= 96 && data1 <= 103) {
            padIndex = data1 - 96
          }

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
      // 入力ポートすべてに対してリスナーを設定
      if (access.inputs.size === 0) {
        setError('No MIDI devices found')
      }
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage
      })
      setIsReady(true)
      setError(null)
    }
    catch (e) {
      console.error(e)
      setError('MIDI Access Failed')
    }
  }

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
        <button
          type="button"
          onClick={connectMidi}
          disabled={isReady}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: isReady ? '#2e7d32' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isReady ? 'MIDI Connected' : 'Connect DDJ-FLX4'}
        </button>
        <span style={{ marginLeft: '20px', fontFamily: 'monospace', color: '#888' }}>
          Last:
          {' '}
          {midiState.lastMessage}
        </span>
        {error && <div style={{ color: '#ff5252', marginTop: '10px' }}>{error}</div>}
      </div>
      <DJControllerComponent state={midiState} />
    </div>
  )
}
