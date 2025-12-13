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
  shift: boolean // 0x3F (63)
  jogTouch: boolean // 0x36 (54)
  jogTurn: number // Relative value

  // Loop Section
  loopIn: boolean // 0x10 (16)
  loopOut: boolean // 0x11 (17)
  reloopExit: boolean // 0x4C (76)
  cueLoopCallLeft: boolean // 0x51 (81)
  cueLoopCallRight: boolean // 0x53 (83)

  // Beat Sync
  beatSync: boolean // 0x58 (88)

  // Faders & Sliders
  tempo: number // Pitch Slider

  // Pads
  pads: boolean[]
  padMode: PadMode
}

export interface MixerState {
  // Per Channel
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
  chCue1: boolean
  chCue2: boolean

  // Global
  masterLevel: number
  masterCue: boolean
  crossFader: number
  cfx1: number
  cfx2: number
  micLevel: number
  headphoneMix: number
  headphoneLevel: number
  smartCfx: boolean
  smartFader: boolean
}

export interface EffectState {
  fxSelect: boolean
  fxSelectShift: boolean
  beatLeft: boolean
  beatRight: boolean
  levelDepth: number
  fxOn: boolean
  chSelect: 'CH1' | 'CH2' | 'Master' | 'None'
}

export interface BrowseState {
  rotaryTurn: number
  rotaryPush: boolean
  load1: boolean
  load2: boolean
  viewBack: boolean
}

export interface DJControllerState {
  deck1: DeckState
  deck2: DeckState
  mixer: MixerState
  effect: EffectState
  browse: BrowseState
  lastMessage: string | null
}
