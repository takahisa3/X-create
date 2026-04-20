# X-create プロジェクト指示書

このリポジトリはX(Twitter)自動投稿パイプラインです。Claude Codeのスケジュールトリガー(平日9/13/18時JST)から呼ばれた時、以下のルールに従って作業してください。

## 役割分担 (厳守)

- **Claude (あなた)**: リサーチ・下書き生成・インサイト抽出・commit & push のみ
- **GitHub Actions**: X API への実投稿・数値取得
- **絶対にしないこと**: X API を直接叩かない / Secrets を読もうとしない / `node_modules` を commit しない

## 実行フロー (毎回この順序)

### STEP 1: リサーチ
1. `config/themes.md` からテーマ1つ選定 (なければ自由選定)
2. `WebSearch` で最新トレンド・競合投稿を調査
3. `research/YYYY-MM-DD-HHMM.md` (UTC) に保存:
   ```
   # テーマ: xxx
   ## 要点
   - 箇条書き3点
   ## 参考URL
   - URL
   ```

### STEP 2: 投稿案生成
1. リサーチを元に日本語140字以内の投稿候補を3案作成
2. 最良案を選定理由付きで決定
3. `drafts/pending/YYYY-MM-DD-HHMM.md` に保存 (**この形式は厳守** — `scripts/post.js` がパースします):
   ```
   ---
   selected: 1
   reason: 選定理由
   ---
   ## 案1
   (本文140字以内)
   ## 案2
   (本文140字以内)
   ## 案3
   (本文140字以内)
   ```
   - `selected` は採用する案の番号 (1-3)
   - 見出しは `## 案1` `## 案2` `## 案3` の形式を厳守

### STEP 3: インサイト抽出
1. `posted/` の直近7件(JSON)と、対応する `analytics/` の数値を読む
2. 「伸びた要因」「次回の改善点」を抽出
3. `insights/YYYY-MM-DD-HHMM.md` に保存
4. 過去データがない初回実行は「初回のためスキップ」と記載

### STEP 4: commit & push
```bash
git add research/ drafts/ insights/ logs/
git commit -m "auto: pipeline run YYYY-MM-DD HH:MM UTC"
git push origin main
```

## エラー処理

- 各STEPで失敗したら `logs/error-YYYY-MM-DD-HHMM.md` に原因とスタックトレースを記録
- 後続STEPは可能な限り続行
- 最終的にエラーログもcommit&push

## ディレクトリ意味

| パス | 責任 | 内容 |
|---|---|---|
| `config/themes.md` | ユーザー編集 | テーマ候補リスト |
| `research/` | Claude生成 | 調査結果 |
| `drafts/pending/` | Claude生成→Actions消費 | 未投稿下書き |
| `posted/` | Actions生成 | 投稿済みのtweet_id等 |
| `analytics/` | Actions生成 | 投稿の数値メトリクス |
| `insights/` | Claude生成 | 過去データからの学び |
| `logs/` | Claude生成 | エラーログ |
| `scripts/` | 変更不可 | post.js / analytics.js |
| `.github/workflows/` | 変更不可 | Actions定義 |

## 禁止事項

- `scripts/` や `.github/workflows/` の変更 (ユーザー承認なし)
- `posted/` `analytics/` への書き込み (Actionsの領域)
- `package.json` の編集
- `drafts/pending/` のフォーマット逸脱 (`scripts/post.js` が壊れる)
- 1ファイル内に複数ドラフトを混ぜる (1実行 = 1ファイル)

## タイムスタンプ

常に `date -u +%Y-%m-%d-%H%M` (UTC) を使用。ファイル名・commitメッセージともに。

## 投稿文のスタイルガイドライン

- 日本語140字以内 (絵文字は1文字としてカウント)
- ハッシュタグは最大2個
- URLを含める場合はt.co短縮後で23字として計算
- 煽り・過度な断定は避け、具体例や数値を優先
