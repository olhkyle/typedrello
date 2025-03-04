# Typedrello

> Boost your productivity

## Goals

- Benchmark Trello Web Application
- Gradual adoption of TypeScript in a Vanilla JavaScript App

## Features

- Make a `List` in order
- Make multiple `Card`s in List
- `DND(Drag and Drop)` Lists
  - only works on Desktop (﹡ will-update `TouchEvent` on Tablet and Mobile)

## Technical Consideration

- Migrating an existing _Vanilla JavaScript_ App to _TypeScript_
- Implemented SPA using Vanilla TypeScript without any libraries or frameworks
- Built with Custom Core Library such as React `Reconciliation` with TypeScript
- Designed a CBD library based on the implemented Diffing(Reconciliation) algorithm, using `Class` (ES6+) syntax
- Implemented various DOM event interactions using _Event Delegation_
- Define Components as declarative views with state
