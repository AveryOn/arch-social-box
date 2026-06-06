#!/bin/sh

DATE=$(date +"%Y-%m-%d")
TEXT="$1"

if [ -z "$TEXT" ]; then
  echo "Ошибка: укажи текст коммита"
  echo "Пример: ./git-push.sh \"init project\""
  exit 1
fi

git add .
git commit -m "[$DATE] $TEXT"
git push origin main
