import { atom, useAtom } from 'jotai'

// --- 状態管理 (Jotai) ---
interface MidiState {
  isReady: boolean
  inputs: string[] // 接続されたデバイス名のリスト
  error: string | null
}

export const midiAtom = atom<MidiState>({
  isReady: false,
  inputs: [],
  error: null,
})

// --- MIDIメッセージの解析ヘルパー ---
function parseMidiMessage(data: Uint8Array) {
  const [status, data1, data2] = data
  const command = status >> 4
  const channel = status & 0xF

  let type = 'Unknown'
  if (command === 0x9)
    type = 'Note On'
  else if (command === 0x8)
    type = 'Note Off'
  else if (command === 0xB)
    type = 'Control Change (CC)'
  else if (command === 0xE)
    type = 'Pitch Bend'

  return { type, channel, data1, data2 }
}

export default function MidiLogger() {
  const [midiState, setMidiState] = useAtom(midiAtom)

  // MIDIメッセージ受信時のハンドラ
  const handleMidiMessage = (event) => {
    const { data } = event
    if (!data)
      return

    // 1. 生データをログ出力 (Uint8Array)
    // 例: [144, 60, 100] -> NoteOn, C4, Velocity 100
    console.log('Raw MIDI Data:', data)

    // 2. 読みやすい形式でログ出力（デバッグ用）
    const parsed = parseMidiMessage(data)
    console.log(
      `%c[MIDI] ${parsed.type} (Ch:${parsed.channel + 1}) | Note/No:${parsed.data1} | Vel/Val:${parsed.data2}`,
      'color: #bada55',
    )
  }

  const connectMidi = async () => {
    if (!navigator.requestMIDIAccess) {
      setMidiState(prev => ({ ...prev, error: 'Web MIDI API is not supported in this browser.' }))
      return
    }

    try {
      // MIDIアクセス権を要求
      const access = await navigator.requestMIDIAccess()

      console.log('--- MIDI Access Granted ---')

      const inputNames: string[] = []

      // 接続されているすべての入力デバイスに対してリスナーを設定
      for (const input of access.inputs.values()) {
        inputNames.push(input.name || 'Unknown Device')
        // イベントリスナー登録
        input.onmidimessage = handleMidiMessage
        console.log(`Listening to device: ${input.name}`)
      }

      if (inputNames.length === 0) {
        console.warn('No MIDI input devices found.')
      }

      setMidiState({
        isReady: true,
        inputs: inputNames,
        error: null,
      })

      // 接続状態の変化（ケーブルの抜き差し）を監視
      access.onstatechange = (e) => {
        if (!e.port) {
          console.error('MIDI Connection Event has no port information.')
          return
        }
        console.log(`Connection status changed: ${e.port.name} -> ${e.port.state}`)
      }
    }
    catch (err) {
      console.error('MIDI Access Failed', err)
      setMidiState(prev => ({ ...prev, error: 'Failed to access MIDI devices.' }))
    }
  }

  // コンポーネントがマウントされたら自動で接続を試みる場合（手動ボタンが良い場合はuseEffectを削除）
  // useEffect(() => {
  //   connectMidi();
  // }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Web MIDI Logger</h1>

      <button onClick={connectMidi} disabled={midiState.isReady}>
        {midiState.isReady ? 'MIDI Listening...' : 'Start MIDI Listening'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Status:</h3>
        {midiState.error
          ? (
              <p style={{ color: 'red' }}>{midiState.error}</p>
            )
          : (
              <p style={{ color: midiState.isReady ? 'green' : 'gray' }}>
                {midiState.isReady ? 'Connected & Listening' : 'Waiting to start...'}
              </p>
            )}
      </div>

      {midiState.inputs.length > 0 && (
        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
          <strong>Connected Devices:</strong>
          <ul>
            {midiState.inputs.map((name, i) => <li key={i}>{name}</li>)}
          </ul>
        </div>
      )}

      <p style={{ fontSize: '0.9em', color: '#666' }}>
        ※ 実際にコントローラを操作して、ブラウザのConsole (F12) を確認してください。
      </p>
    </div>
  )
}
