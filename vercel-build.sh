#!/bin/bash
npm install --legacy-peer-deps
# Install necessary expo CLI
npx expo install --fixes
# Use expo export instead of export:web
npx expo export --platform web 