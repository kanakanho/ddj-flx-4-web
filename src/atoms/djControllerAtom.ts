import type { DeckState, DJControllerState } from '../types/midi'
import { atom } from 'jotai'

const initialDeck: DeckState = {
  playPause: false,
  cue: false,
  shift: false,
  jogTouch: false,
  jogTurn: 0,

  // Loop Section
  loopIn: false,
  loopOut: false,
  reloopExit: false,

  // Beat Sync
  beatSync: false,

  // Faders & Sliders
  tempo: 0.5,

  // Pads
  pads: Array.from<boolean>({ length: 8 }).fill(false),
  padMode: 'Hot Cue',
}

const initialState: DJControllerState = {
  deck1: { ...initialDeck },
  deck2: { ...initialDeck },
  mixer: {
    // Knobs (Center = 0.5)
    trim1: 0.5,
    trim2: 0.5,
    eqHi1: 0.5,
    eqHi2: 0.5,
    eqMid1: 0.5,
    eqMid2: 0.5,
    eqLow1: 0.5,
    eqLow2: 0.5,

    // Faders (Bottom = 0)
    chFader1: 0,
    chFader2: 0,

    // Cues
    chCue1: false,
    chCue2: false,

    // Global
    masterLevel: 0,
    masterCue: false,
    crossFader: 0.5,

    // CFX / Filter (Center = 0.5)
    cfx1: 0.5,
    cfx2: 0.5,

    // Mic / HP
    micLevel: 0,
    headphoneMix: 0.5,
    headphoneLevel: 0.5,

    // Smart Features
    smartCfx: false,
    smartFader: false,
  },
  effect: {
    fxSelect: false,
    fxSelectShift: false,
    beatLeft: false,
    beatRight: false,
    levelDepth: 0,
    fxOn: false,
    chSelect: 'None',
  },
  browse: {
    rotaryTurn: 0,
    rotaryPush: false,
    load1: false,
    load2: false,
    viewBack: false,
  },
  lastMessage: null,
}

export const djControllerAtom = atom<DJControllerState>(initialState)
