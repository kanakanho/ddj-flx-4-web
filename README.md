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

1. 依存パッケージをインストール:
```bash
pnpm install
```

2. 開発サーバーを起動:
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

このプロジェクトでは、DDJ-FLX4コントローラーの状態を型安全に管理するための型定義を使用しています。

型定義の詳細は [`src/types/midi.ts`](src/types/midi.ts) を参照してください。

このプロジェクトのMIDIマッピングとコントローラーの型定義は、Mixxxの公式DDJ-FLX4スクリプトを参考にしています: [Pioneer-DDJ-FLX4-script.js](https://github.com/mixxxdj/mixxx/blob/main/res/controllers/Pioneer-DDJ-FLX4-script.js)

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

Built with ❤️ using React + TypeScript + Vite
