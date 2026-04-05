#!/bin/sh

echo "[❗] Clearing cache"
rm -rf .yarn/cache .nx/cache .angular node_modules yarn.lock dist package-lock.json

if [ ! -f ./yarn.lock ]; then
  echo "[❗] yarn.lock File not found!"
  echo "[📄] Creating new lock file.."
  touch yarn.lock
fi

echo "[⚡] Running yarn"
yarn install

echo "[⚡] Setting sdks"
yarn dlx @yarnpkg/sdks

echo "[⚡] Extracting required artifacts.."
cd .yarn/cache

fVar=$(find * -type f -name '@angular-cli-npm-*.*\.zip')
unzip -o ${fVar} "node_modules/@angular/cli/lib/*/*" -d "./../../"

echo "[⚡] Building project to verify.."
yarn build:prod
