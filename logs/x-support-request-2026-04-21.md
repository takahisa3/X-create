# X Developer Support 依頼テンプレート

提出先: https://help.x.com/forms/platform
または Developer Community で個別投稿: https://devcommunity.x.com/

---

## Subject
```
Standalone App on Pay-Per-Use cannot POST /2/tweets (403) - please attach to Project
```

## 本文(英語・コピペ用)
```
Hello X Developer Support,

My Pay-Per-Use app cannot call POST /2/tweets and consistently returns:
  HTTP 403 Forbidden
  "You are not permitted to perform this action."

This is the well-known issue where apps created under the new Pay-Per-Use Developer Console are Standalone Apps and not attached to a Project, while v2 write endpoints require a Project-attached app.

Account / App details:
- Account ID: 2046485016125865984
- App Name: 2046485016125865984takahisa082
- App ID: 32807497
- Account handle: @takahisa0828
- Credit balance: $10.00 (Pay-Per-Use)
- App permissions: Read and Write (OAuth 1.0a)
- Access Token: regenerated after setting Read and Write permissions

What I have already verified:
- Authentication works (GET endpoints succeed)
- OAuth 1.0a keys are valid (X_API_KEY/SECRET, X_ACCESS_TOKEN/SECRET)
- The app permission shows "Read and write" and the Access Token was regenerated after the permission change
- Credit balance is not zero
- Rate limit is not exceeded (97/100 remaining)

Could you please attach my Standalone App (ID: 32807497) to a Project so POST /2/tweets works?

Thank you.
```

## 日本語補足(フォームの別欄用)
```
Pay-Per-Use でアプリを作成しましたが、Standalone App 扱いとなっており、
POST /2/tweets が 403 "You are not permitted to perform this action." で失敗します。

App ID 32807497 を Project にアタッチしていただきたいです。
認証・クレジット・権限はすべて正しく設定済みであることを確認済みです。
```

## 返信目安
- Developer Community 投稿: 数日〜2週間
- Support フォーム: 1〜4週間(時期により変動)

## 同じ症状の既報スレッド(参照用)
- https://devcommunity.x.com/t/pay-per-use-no-projects-section-in-console-standalone-app-only-post-2-tweets-returns-403-you-are-not-permitted-to-perform-this-action-despite-5-credits/259262
- https://devcommunity.x.com/t/new-pay-per-use-account-no-create-project-button-standalone-apps-only-post-2-tweets-fails-403-read-works/257250
- https://devcommunity.x.com/t/403-error-app-not-attached-to-project/259520
