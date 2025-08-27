#!/bin/bash
set -e

brew install ffmpeg

# input.mp3をwav変換し8秒ごとにカット
input="../audio/input.mp3"
for i in {0..5}; do
  start=$((i * 8))
  out=$(printf "../audio/swing%02d.wav" $((i+1)))
  ffmpeg -y -i "$input" -ss $start -t 8 "$out"
done

brew uninstall ffmpeg
