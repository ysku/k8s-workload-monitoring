Kubernetes Monitoring
======================

**start local cluster**

```bash
$ minikube start --vm-driver=hyperkit
```

- Pod の監視
  - 定期的に監視して、ある条件を満たすと通知を行う
- 追加
  - Pod 監視の worker を実行する
    - 途中で停止させるにはどうすればよいか？
- 更新
  - Pod 監視の worker がなければ追加
  - Pod 監視の worker があれば worker を再起動（内部状態をクリア）
- 削除
  - Pod 監視の worker があれば削除する、なければ warning メッセージ

- Worker に必要なインターフェース
  - 実行の開始
  - 再起動
- Notifier: Worker が持つ。特定の先に通知を行う
- WorkerGroup: Worker の集合
  - Worker の追加
  - Worker の更新
  - Worker の削除
- Informer: Pod の追加、更新、削除などのイベントに応じて処理を実行する
