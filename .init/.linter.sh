#!/bin/bash
cd /home/kavia/workspace/code-generation/sql-learning-hub-194941-194950/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

