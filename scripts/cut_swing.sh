#!/bin/bash
set -e

brew install ffmpeg

# ルートを基準にパスを設定
ROOT_DIR=$(dirname "$0")/..
INPUT_FILE="$ROOT_DIR/assets/audio/input.mp3"
OUTPUT_DIR="$ROOT_DIR/src/audio"

[ ! -f "$INPUT_FILE" ] && { echo "can't find input.mp3."; exit 1; }

# 出力ディレクトリが無ければ作成
mkdir -p "$OUTPUT_DIR"

# 8秒ごとに分割, wav変換
for i in {0..5}; do
    START=$((i * 8))
    OUT_FILE=$(printf "%s/swing%02d.wav" "$OUTPUT_DIR" $((i)))
    ffmpeg -y -i "$INPUT_FILE" -ss $START -t 8 "$OUT_FILE"
done

brew uninstall ffmpeg
