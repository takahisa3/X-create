# X-create プロジェクト指示書

このリポジトリはX(Twitter)自動投稿パイプラインです。Claude Codeのスケジュールトリガー(平日9/13/18時JST)から呼ばれた時、以下のルールに従って作業してください。

## 目的

AI/Claude Code領域でXに自動投稿し、エンゲージメントを継続的に改善する。本ファイルは投稿生成の **不変ルール** を定義する。時流で変わる数値データは `insights/learnings.json` を参照すること。

## 役割分担 (厳守)

- **Claude (あなた)**: リサーチ・下書き生成・インサイト抽出・commit & push
- **GitHub Actions**: X API への実投稿・数値取得
- **絶対にしないこと**: X API を直接叩く / Secrets を読もうとする / `node_modules` を commit / `scripts/` や `.github/workflows/` を変更

## 制約

- **無料プラン** — 1投稿 **280字以内** (絵文字・URL含む。URLはt.co短縮後23字として計算)
- `scripts/post.js` が280字超の下書きをスキップするため、生成時に必ず字数確認

---

## 🎯 投稿の4類型 (必ず1つ選択)

投稿ごとに必ず以下1つの「型」に当てはめる。混ぜない。

### A. 事件/スクープ型 (爆発力狙い)
- **用途**: 業界の大ニュース・やらかし・流出
- **構造**:
  - 文頭: `【悲報】` `【朗報】` `【速報】` `🚨` など
  - 数字・時刻・固有名詞などディテールを盛る
  - 「しかもこれ、ただの◯◯じゃない」で二段階の驚きを足す
- **字数**: 120〜280字

### B. 実践知見/企業事例型 (ブクマ狙い)
- **用途**: 具体企業の実装事例・設定公開・運用ノウハウ
- **構造**:
  - 文頭: 「◯◯社の△△、めちゃくちゃ実践的で参考になる」
  - `▼要点` → `①②③` の短い箇条書き (要点は3つまでに圧縮)
  - 自分なりの解釈を最後に一言
- **字数**: 180〜280字

### C. 1行Tips/警告型 (共感バズ狙い)
- **用途**: ハッとする気づき・短い警告・ぼやき
- **構造**:
  - 40〜120字で完結
  - 警告/共感/ぼやきのどれか1トーンに統一
  - 最後に余韻を残す問いかけか体言止め
- **字数**: 40〜120字

### D. 保存版まとめ型 (ブクマ&RT両取り)
- **用途**: リポジトリ紹介・ツールまとめ・機能解説
- **構造**:
  - 文頭: `【保存版】` `【完全版】` `【必見】`
  - 数値入りの短い箇条書き (`・27エージェント` `・64スキル`)
  - 末尾にURL or 続きへの誘導
- **字数**: 180〜280字

---

## ✅ 必ず守るルール

1. ハッシュタグは使わない (`#AI` 等は平均Viewsが半減)
2. 数字から投稿を始めない (「1. はじめに」型はヒット率5%まで落ちる)
3. C型以外は50字未満にしない
4. 改行と空行で段落を分け、視覚的に読みやすく
5. カタカナ/英語の固有名詞を具体的に出す (抽象論にしない)
6. URLは本文末尾に置く (文頭・文中に置かない)

## 🚫 絶対にやらないこと

- `#AI` `#プログラミング` 等のハッシュタグ
- 「1. …」のような数字スタート
- 「すごい」「やばい」だけで中身のない感想
- 事実確認できない伝聞の断定
- 280字超過 (post.js が弾きます)

---

## 📊 動的データの参照先

`insights/learnings.json` に過去解析から蓄積された動的パラメータが入る。投稿生成時に存在すれば必ず読み込む。

| キー | 意味 |
|---|---|
| `best_hours` / `best_dow` | 投稿すべき時間帯・曜日 |
| `lift_words` | 現時点で伸びやすいキーワード群 |
| `good_patterns` / `bad_patterns` | 型の微調整メモ (直近の傾向で更新) |
| `next_research_hints` | 次リサーチで狙うトピック |

**更新は STEP 3 (インサイト抽出) のみ**。CLAUDE.md 本体は触らない。

初回で未作成なら空の骨格で作成:
```json
{
  "updated_at": "ISO8601",
  "best_hours": [],
  "best_dow": [],
  "lift_words": [],
  "good_patterns": [],
  "bad_patterns": [],
  "next_research_hints": []
}
```

---

## 実行フロー (毎回この順序)

### STEP 1: リサーチ
1. `insights/learnings.json` の `next_research_hints` があれば優先、なければ `config/themes.md` から1つ選定
2. `WebSearch` で最新トレンド・競合投稿を調査
3. `research/YYYY-MM-DD-HHMM.md` (UTC) に保存:
   ```
   # テーマ: xxx
   ## 狙う型: A / B / C / D
   ## 要点
   - 箇条書き3点
   ## 参考URL
   - URL
   ```

### STEP 2: 投稿案生成
1. 選んだ型 (A/B/C/D) に沿って日本語 **280字以内** の投稿候補を3案作成
2. `insights/learnings.json` の `lift_words` / `good_patterns` / `bad_patterns` を反映
3. 最良案を選定理由付きで決定
4. `drafts/pending/YYYY-MM-DD-HHMM.md` に保存 (**形式厳守** — `scripts/post.js` がパース):
   ```
   ---
   selected: 1
   type: A
   reason: 選定理由
   ---
   ## 案1
   (本文280字以内)
   ## 案2
   (本文280字以内)
   ## 案3
   (本文280字以内)
   ```
   - 見出しは `## 案1` `## 案2` `## 案3` を厳守
   - **必ず各案の字数を目視確認**

### STEP 3: インサイト抽出
1. `posted/` の直近7件 (JSON) と `analytics/` の対応数値を読む
2. 「伸びた要因」「次回の改善点」を抽出 → `insights/YYYY-MM-DD-HHMM.md` に保存
3. **`insights/learnings.json` を更新** (上記骨格に沿って追記/置換)
4. 過去データなしの初回は learnings.json の骨格作成のみ、Markdown insights は「初回のためスキップ」と記載

### STEP 4: commit & push
```bash
git add research/ drafts/ insights/ logs/
git commit -m "auto: pipeline run YYYY-MM-DD HH:MM UTC"
git push origin main
```

---

## エラー処理

- 各STEPで失敗したら `logs/error-YYYY-MM-DD-HHMM.md` に原因とスタックトレースを記録
- 後続STEPは可能な限り続行
- 最終的にエラーログも commit & push

## ディレクトリ責任

| パス | 責任 | 内容 |
|---|---|---|
| `CLAUDE.md` | ユーザー編集 | 不変ルール・投稿哲学 (本ファイル) |
| `config/themes.md` | ユーザー編集 | テーマ候補リスト |
| `research/` | Claude生成 | 調査結果 (Markdown) |
| `drafts/pending/` | Claude生成→Actions消費 | 未投稿下書き |
| `posted/` | Actions生成 | 投稿済みメタデータ (JSON) |
| `analytics/` | Actions生成 | 投稿の数値メトリクス (JSON) |
| `insights/*.md` | Claude生成 | 学びのMarkdownログ |
| `insights/learnings.json` | Claude更新 | 動的パラメータ (構造化) |
| `logs/` | Claude生成 | エラーログ |
| `scripts/` | 変更不可 | post.js / analytics.js |
| `.github/workflows/` | 変更不可 | Actions定義 |

## タイムスタンプ

常に `date -u +%Y-%m-%d-%H%M` (UTC) を使用。ファイル名・commitメッセージともに。
