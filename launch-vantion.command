#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$ROOT_DIR/frontend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Please install Node.js first."
  read "REPLY?Press Enter to close..."
  exit 1
fi

cd "$APP_DIR"

echo "Installing dependencies if needed..."
npm install

PORT=3000
while lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

URL="http://127.0.0.1:$PORT"

echo ""
echo "Starting Vantion on $URL"
echo "The browser will open automatically."
echo "Keep this Terminal window open while using the site."
echo ""

npm run dev -- --hostname 127.0.0.1 --port "$PORT" > /tmp/vantion-precollege.log 2>&1 &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

for _ in {1..30}; do
  if curl -fsS "$URL" >/dev/null 2>&1; then
    open "$URL"
    break
  fi
  sleep 1
done

if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  echo "The dev server stopped unexpectedly."
  echo ""
  cat /tmp/vantion-precollege.log
  read "REPLY?Press Enter to close..."
  exit 1
fi

echo "Server log: /tmp/vantion-precollege.log"
echo ""
tail -f /tmp/vantion-precollege.log &
TAIL_PID=$!

wait "$SERVER_PID"
kill "$TAIL_PID" >/dev/null 2>&1 || true
