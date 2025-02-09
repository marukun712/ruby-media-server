# ruby-media-server

Sinatra と Remix で動作するメディアストリーミングサーバーです。
iTunes で取り込んだ.m4a 形式の音声ファイルのみ動作確認しています。

# Features

- 音声ファイルを hls でストリーミング
- メタデータの自動取得

# Usage

docker-compose で起動します。

```
docker-compose up
```

起動後、http://localhost:5173 で管理画面にアクセスできます。
