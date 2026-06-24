#!/bin/bash
# Sanctuary AI Blob - Frame Extractor
# Extracts WebP frames from the animation MP4, sorted into state ranges:
#   Frames 1–30%   → idle
#   Frames 31–50%  → listening
#   Frames 51–65%  → processing
#   Frames 66–100% → speaking

set -e

VIDEO="/Users/deevash/Downloads/sanctuary/public/ASSETS/TALKING_ANIMATION/frames/Initial_Scene_-_2026-05-27_202605271944.mp4"
OUT_DIR="/Users/deevash/Downloads/sanctuary/public/ASSETS/TALKING_ANIMATION/frames/webp"

echo "🎬 Sanctuary Frame Extractor"
echo "────────────────────────────"

if ! command -v ffmpeg &>/dev/null; then
  echo "❌ ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

if [ ! -f "$VIDEO" ]; then
  echo "❌ Video not found at: $VIDEO"
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "📊 Probing video..."
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$VIDEO" 2>/dev/null)
FPS=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$VIDEO" 2>/dev/null | head -1)

echo "  Duration: ${DURATION}s"
echo "  FPS: $FPS"
echo ""

echo "🖼  Extracting frames at 12fps as WebP..."
ffmpeg -i "$VIDEO" \
  -vf "fps=12,scale=512:512:flags=lanczos" \
  -c:v libwebp \
  -lossless 0 \
  -compression_level 4 \
  -q:v 80 \
  -an \
  "$OUT_DIR/frame_%04d.webp" \
  -y 2>&1 | grep -E "(frame=|error)" || true

TOTAL=$(ls "$OUT_DIR"/frame_*.webp 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "✅ Extracted $TOTAL frames to $OUT_DIR"
echo "   Use these ranges in VoiceController:"
echo "   Idle:       frame_0001 → frame_$(printf '%04d' $((TOTAL * 30 / 100)))"
echo "   Listening:  frame_$(printf '%04d' $((TOTAL * 30 / 100 + 1))) → frame_$(printf '%04d' $((TOTAL * 50 / 100)))"
echo "   Processing: frame_$(printf '%04d' $((TOTAL * 50 / 100 + 1))) → frame_$(printf '%04d' $((TOTAL * 65 / 100)))"
echo "   Speaking:   frame_$(printf '%04d' $((TOTAL * 65 / 100 + 1))) → frame_$(printf '%04d' $TOTAL)"
