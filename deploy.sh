#!/bin/bash

# Assicurati che lo script esca in caso di errori
set -e

echo "Installazione delle dipendenze con npm..."
npm install

echo "Build dell'app Angular in corso..."
ng build --configuration production --base-href https://bioimedpellegrino.github.io/QDV2024/

echo "Deploy su GitHub Pages in corso..."
ngh --dir=dist/qdv/browser
