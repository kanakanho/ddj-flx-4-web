export type PadMode
  = | 'Hot Cue'
    | 'Pad FX 1'
    | 'Pad FX 2'
    | 'Beat Jump'
    | 'Beat Loop'
    | 'Sampler'
    | 'Keyboard'
    | 'Key Shift'
    | 'Unknown'

export interface DeckState {
  playPause: boolean // 0x0B (11)
  cue: boolean // 0x0C (12)
  shift: boolean // Shift button state
  jogTouch: boolean // Note On/Off
  jogTurn: number // Relative value (centered at 64)

  // Loop Section
  loopIn: boolean // 0x10 (16)
  loopOut: boolean // 0x11 (17)
  reloopExit: boolean // 0x4C (76) or similar

  // Beat Sync
  beatSync: boolean // 0x58 (88) or similar based on script

  // Faders & Sliders
  tempo: number // Pitch Slider

  // Pads
  pads: boolean[] // 8 pads state
  padMode: PadMode // Current Active Mode
}

export interface MixerState {
  // Per Channel (controlled via Ch1/Ch2 or Ch7)
  // DDJ-FLX4はMixer操作をCh1/Ch2のCCで送ることが多いですが
  // グローバルなMixerセクションとして管理します
  trim1: number
  trim2: number
  eqHi1: number
  eqHi2: number
  eqMid1: number
  eqMid2: number
  eqLow1: number
  eqLow2: number
  chFader1: number
  chFader2: number
  chCue1: boolean // Headphone Cue Ch1
  chCue2: boolean // Headphone Cue Ch2

  // Global Section
  masterLevel: number
  masterCue: boolean
  crossFader: number
  cfx1: number // Filter/CFX
  cfx2: number

  // Microphone / Headphone
  micLevel: number
  headphoneMix: number
  headphoneLevel: number

  // Smart Features (FLX4 specific)
  smartCfx: boolean
  smartFader: boolean
}

export interface EffectState {
  fxSelect: boolean // Select Next
  fxSelectShift: boolean // Select Prev
  beatLeft: boolean
  beatRight: boolean
  levelDepth: number // Knob
  fxOn: boolean // Button
  chSelect: 'CH1' | 'CH2' | 'Master' | 'None'
}

export interface BrowseState {
  rotaryTurn: number // +1 or -1
  rotaryPush: boolean
  load1: boolean
  load2: boolean
  viewBack: boolean // Often distinct button
}

export interface DJControllerState {
  deck1: DeckState
  deck2: DeckState
  mixer: MixerState
  effect: EffectState
  browse: BrowseState
  lastMessage: string | null
}
