# DDJ-FLX4 Web Controller

Pioneer DDJ-FLX4 DJコントローラーをWeb MIDI APIを使用してブラウザで可視化・操作するWebアプリケーションです。

## 🌐 ウェブサイト

デプロイされたアプリケーションはこちら:
**https://kanakanho.github.io/ddj-flx4-web/**

## ✨ 機能

- Web MIDI APIを使用したリアルタイムMIDI入力の可視化
- Pioneer DDJ-FLX4コントローラーの完全なUI再現
- デッキ、ミキサー、エフェクト、ブラウザセクションの状態管理
- パッドモード切り替え（Hot Cue、Pad FX、Beat Jump、Sampler等）
- ジョグホイール、フェーダー、ノブの視覚的フィードバック

## 🚀 使い方

1. ブラウザで [https://kanakanho.github.io/ddj-flx4-web/](https://kanakanho.github.io/ddj-flx4-web/) にアクセス
2. Pioneer DDJ-FLX4コントローラーをコンピューターに接続
3. 「Connect DDJ-FLX4」ボタンをクリックしてMIDI接続を確立
4. コントローラーを操作すると、画面上のUIがリアルタイムで更新されます

### ブラウザ要件

- Web MIDI APIをサポートするブラウザが必要です（Chrome、Edge、Opera等）
- Firefox、Safariではデフォルトでサポートされていません

## 🛠️ 開発環境の構築

### 必要な環境

- Node.js (v20以上推奨)
- pnpm (v10以上)

### セットアップ手順

1. リポジトリをクローン:
```bash
git clone https://github.com/kanakanho/ddj-flx4-web.git
cd ddj-flx4-web
```

2. 依存パッケージをインストール:
```bash
pnpm install
```

3. 開発サーバーを起動:
```bash
pnpm dev
```

ブラウザで `http://localhost:5173` にアクセスできます。

### 利用可能なコマンド

```bash
pnpm dev        # 開発サーバーを起動（ホットリロード有効）
pnpm build      # プロダクションビルドを作成
pnpm preview    # ビルドしたアプリをプレビュー
pnpm lint       # ESLintでコードをチェック
pnpm lint:fix   # ESLintで自動修正可能な問題を修正
```

## 📦 技術スタック

- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** (Rolldown) - 高速ビルドツール
- **Jotai** - 状態管理
- **Web MIDI API** - MIDIデバイスとの通信

## 🎹 MIDIの型情報

このプロジェクトでは、DDJ-FLX4コントローラーの状態を型安全に管理するために以下の型定義を使用しています（`src/types/midi.ts`）:

### 主要な型定義

#### `DeckState`
デッキ（左右のターンテーブル部分）の状態を表す型:
```typescript
export interface DeckState {
  playPause: boolean // Play/Pauseボタン (0x0B)
  cue: boolean // Cueボタン (0x0C)
  shift: boolean // Shiftボタン (0x3F)
  jogTouch: boolean // ジョグホイールのタッチ検出 (0x36)
  jogTurn: number // ジョグホイールの回転（相対値）

  // ループセクション
  loopIn: boolean // Loop In (0x10)
  loopOut: boolean // Loop Out (0x11)
  reloopExit: boolean // Reloop/Exit (0x4C)
  cueLoopCallLeft: boolean // Cue/Loop Call Left (0x51)
  cueLoopCallRight: boolean // Cue/Loop Call Right (0x53)

  // ビートシンク
  beatSync: boolean // Beat Sync (0x58)

  // スライダー
  tempo: number // テンポスライダー（0.0 - 1.0）

  // パッド
  pads: boolean[] // 8つのパッドの状態
  padMode: PadMode // 現在のパッドモード
}
```

#### `MixerState`
ミキサーセクションの状態:
```typescript
export interface MixerState {
  // チャンネル別コントロール
  trim1: number // チャンネル1 Trim
  trim2: number // チャンネル2 Trim
  eqHi1: number // チャンネル1 EQ High
  eqHi2: number // チャンネル2 EQ High
  eqMid1: number // チャンネル1 EQ Mid
  eqMid2: number // チャンネル2 EQ Mid
  eqLow1: number // チャンネル1 EQ Low
  eqLow2: number // チャンネル2 EQ Low
  chFader1: number // チャンネル1フェーダー
  chFader2: number // チャンネル2フェーダー
  chCue1: boolean // チャンネル1 Cue
  chCue2: boolean // チャンネル2 Cue

  // グローバルコントロール
  masterLevel: number // マスターレベル
  masterCue: boolean // マスターCue
  crossFader: number // クロスフェーダー
  cfx1: number // CFX 1
  cfx2: number // CFX 2
  micLevel: number // マイクレベル
  headphoneMix: number // ヘッドフォンミックス
  headphoneLevel: number // ヘッドフォンレベル
  smartCfx: boolean // Smart CFX
  smartFader: boolean // Smart Fader
}
```

#### `EffectState`
エフェクトセクションの状態:
```typescript
export interface EffectState {
  fxSelect: boolean // エフェクト選択
  fxSelectShift: boolean // エフェクト選択（Shift）
  beatLeft: boolean // Beat Left
  beatRight: boolean // Beat Right
  levelDepth: number // Level/Depth（0.0 - 1.0）
  fxOn: boolean // エフェクトON/OFF
  chSelect: 'CH1' | 'CH2' | 'Master' | 'None' // チャンネル選択
}
```

#### `BrowseState`
ブラウザセクションの状態:
```typescript
export interface BrowseState {
  rotaryTurn: number // ロータリーエンコーダーの回転
  rotaryPush: boolean // ロータリーエンコーダーの押下
  load1: boolean // Load to Deck 1
  load2: boolean // Load to Deck 2
  viewBack: boolean // View/Back
}
```

#### `PadMode`
パッドの動作モード:
```typescript
export type PadMode
  = | 'Hot Cue' // ホットキュー（0x1B）
    | 'Pad FX 1' // パッドFX 1（0x1E）
    | 'Pad FX 2' // パッドFX 2（0x6B）
    | 'Beat Jump' // ビートジャンプ（0x20）
    | 'Beat Loop' // ビートループ（0x6D）
    | 'Sampler' // サンプラー（0x22）
    | 'Keyboard' // キーボード（0x69）
    | 'Key Shift' // キーシフト（0x6F）
    | 'Unknown' // 不明
```

### MIDIチャンネルマッピング

DDJ-FLX4は複数のMIDIチャンネルを使用します:

- **Channel 1 (0x00)**: Deck 1 コントロール
- **Channel 2 (0x01)**: Deck 2 コントロール
- **Channel 5 (0x04)**: Beat FX
- **Channel 7 (0x06)**: Browse / Global Mixer
- **Channel 8 (0x07)**: Deck 1 Pads
- **Channel 9 (0x08)**: Deck 1 Pads (Shift)
- **Channel 10 (0x09)**: Deck 2 Pads
- **Channel 11 (0x0A)**: Deck 2 Pads (Shift)

## 🎛️ コントローラーの型について

このプロジェクトのMIDIマッピングとコントローラーの型定義は、Mixxxの公式DDJ-FLX4スクリプトを参考にしています:

**参考リンク**: [Pioneer-DDJ-FLX4-script.js](https://github.com/mixxxdj/mixxx/blob/main/res/controllers/Pioneer-DDJ-FLX4-script.js)

Mixxxは、オープンソースのDJソフトウェアで、多くのDJコントローラーの公式マッピングを提供しています。DDJ-FLX4のMIDIメッセージの解釈、ボタンのマッピング、LEDライティングなどの実装は、このスクリプトを基に設計されています。

### 主な参考点

- MIDIコントロールチェンジ（CC）番号とその機能のマッピング
- Note On/Off メッセージの解釈
- パッドモードの切り替えロジック
- ジョグホイールの相対値処理（中心値64）
- LEDライティングのための出力マッピング

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🤝 コントリビューション

Issue や Pull Request を歓迎します！

---

Built with ❤️ using React + TypeScript + Vite
