# Clue Notes

![Tests](https://img.shields.io/github/check-runs/isbaysoft/cluenotes/main?label=tests&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?style=flat&logo=typescript&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=flat&logo=vuedotjs&logoColor=white)
[![Netlify Status](https://api.netlify.com/api/v1/badges/da1c3500-ab74-4f3e-9ae3-17975bea9166/deploy-status)](https://app.netlify.com/sites/cluenotes/deploys)
![License](https://img.shields.io/github/license/isbaysoft/cluenotes?color=blue)

Clue Notes is a mobile-friendly companion app for Clue/Cluedo games.
It helps you track cards, log turns, and keep deduction notes during play.

Live review link: [https://cluenotes.netlify.app](https://cluenotes.netlify.app)

## Important Notice

This is a learning/pet project created for study and experimentation.
It is provided "as is", without any warranties or guarantees.

By using this project, you accept full responsibility for how you use it.
The author is not liable for data loss, gameplay decisions, or any direct/indirect damages.

Questions, feedback, or issues are welcome:

- `cluenotes.app@proton.me`

## Features

- Suggestion Wizard for step-by-step turn logging.
- Notebook grid with deduction statuses.
- Turn history view with edit/delete support.
- Auto-hide clues mode for safer in-person play (mobile only).
- Persistent local state (browser storage).
- PWA support for install/offline-friendly usage.
- Mobile-first layout and controls.

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- SCSS
- Vite PWA plugin

## Getting Started

### Install

```sh
npm install
```

### Run in development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Preview build

```sh
npm run preview
```

## Useful Scripts

```sh
npm run lint
npm run lint:fix
npm run typecheck
npm run typecheck:strict
npm run format
```
