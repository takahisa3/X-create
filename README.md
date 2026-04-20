# X-create

X(Twitter) 自動投稿パイプライン。Claude Code のスケジュールトリガーがリサーチ&下書き生成を担当し、GitHub Actions が実投稿と数値取得を行う。

## アーキテクチャ

```
[Claude (trigger: 平日9/13/18時)]          [GitHub Actions]            [X API]
  research/ 生成                ─commit─→  (drafts/pending push検知)  ──post──→
  drafts/pending/ 生成                      post.yml → posted/ へ記録
  insights/ 生成 (過去データから)            analytics.yml (6h毎) → analytics/ 更新
```

## セットアップ

### 1. X API 認証情報の登録

X Developer Portal (https://developer.twitter.com) でアプリを作成し、**Read and Write** 権限で OAuth 1.0a キーを発行。

リポジトリ Settings → Secrets and variables → Actions で以下4つを登録:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

### 2. Actions の書き込み権限

Settings → Actions → General → Workflow permissions を **Read and write permissions** に設定。

### 3. スケジュールトリガー

Claude Code 側で `trig_01QqwXsiLPn9Kecqztqpxr1p` が登録済み。管理画面:
https://claude.ai/code/scheduled/trig_01QqwXsiLPn9Kecqztqpxr1p

## ディレクトリ構成

- `config/themes.md` — 投稿テーマ候補
- `research/` — リサーチ結果 (Claudeが生成)
- `drafts/pending/` — 未投稿の下書き (Claudeが生成 → Actionsが消費)
- `posted/` — 投稿済みのメタデータ (Actionsが記録)
- `analytics/` — 投稿の数値 (Actionsが定期取得)
- `insights/` — 過去データからの学び (Claudeが生成)
- `logs/` — エラーログ
- `scripts/` — 投稿・数値取得スクリプト
- `.github/workflows/` — GitHub Actions 定義
