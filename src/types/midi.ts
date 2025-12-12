export interface DeckState {
  playPause: boolean // 1-1
  cue: boolean // 1-2
  shift: boolean // 1-3
  jogTouch: boolean // 1-4 (Note 54)
  jogTurn: number // 1-4 (CC 34/35/41 - relative)
  loopIn: boolean // 1-5
  loopOut: boolean // 1-6
  loop4Beat: boolean // 1-7
  cueLoopCallLeft: boolean // 1-8
  cueLoopCallRight: boolean// 1-9
  beatSync: boolean // 1-10
  tempo: number // 1-11 (Slider)
  pads: boolean[] // 5-5 (Pad 1-8)
  padMode: string // 5-1 ~ 5-4 (Current Mode)
}

export interface MixerState {
  // Per Channel (controlled via Ch1/Ch2)
  trim1: number // 3-3
  trim2: number
  eqHi1: number // 3-4
  eqHi2: number
  eqMid1: number
  eqMid2: number
  eqLow1: number
  eqLow2: number
  chFader1: number // 3-7
  chFader2: number
  chCue1: boolean // 3-6
  chCue2: boolean

  // Global Mixer (controlled via Ch7)
  masterLevel: number // 3-1
  masterCue: boolean // 3-2
  crossFader: number // 3-8
  cfx1: number // 3-5 (Filter)
  cfx2: number
  micLevel: number // 3-9
  headphoneMix: number // 3-11
  headphoneLevel: number // 3-12
  smartCfx: boolean // 3-10
  smartFader: boolean // 3-13
}

export interface EffectState {
  fxSelect: boolean // 2-2
  beatLeft: boolean // 2-3
  beatRight: boolean // 2-4
  levelDepth: number // 2-5
  fxOn: boolean // 2-6
  chSelect: 'CH1' | 'CH2' | 'Master' | 'None' // 2-1
}

export interface BrowseState {
  rotaryTurn: number // 4-1
  rotaryPush: boolean
  load1: boolean // 4-2
  load2: boolean // 4-3
}

export interface DJControllerState {
  deck1: DeckState
  deck2: DeckState
  mixer: MixerState
  effect: EffectState
  browse: BrowseState
  lastMessage: string | null
}
