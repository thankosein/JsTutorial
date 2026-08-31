# Lightweight Modular Vanilla JavaScript Architecture

A scalable, high-performance, and framework-less architecture built entirely with Vanilla JavaScript (ES6+), designed for lightweight web applications, dashboards, and enterprise intranet systems without the heavy overhead of modern frontend frameworks.

---

## 📁 Project Directory Structure

```text
my-app/
├── assets/
│   ├── css/
│   │   ├── common/                <-- Global UI Styles (Applied across all pages)
│   │   │   ├── reset.css          // Resets browser default margins/paddings
│   │   │   ├── variables.css      // Root variables (Colors, Fonts, Spacing)
│   │   │   ├── components.css     // Reusable UI styles (Modal, Buttons, Toast, Cards)
│   │   │   └── utilities.css      // Flex, Grid, and Spacing helper classes
│   │   ├── features/              <-- Page-Specific Styles
│   │   │   ├── user.css
│   │   │   └── dashboard.css
│   │   └── main.css               // Global CSS Entry Point
│   │
│   ├── js/
│   │   ├── core/                  <-- Framework-less Core SDK Engine
│   │   │   ├── app.core.js        // Event Bus & DOM Delegation Helpers
│   │   │   ├── app.api.js         // Native Fetch API Wrapper Service
│   │   │   ├── app.state.js       // Lightweight Reactive State Manager
│   │   │   └── app.ui.js          // Global UI Manager (Modal, Toast, Loader)
│   │   │
│   │   ├── components/            <-- Reusable UI Web Components & Modules
│   │   │   ├── navbar.js
│   │   │   └── sidebar.js
│   │   │
│   │   ├── features/              <-- Page-Specific Business Logic Modules
│   │   │   ├── user-feature.js
│   │   │   └── dashboard-feature.js
│   │   │
│   │   └── main.js                // Global JavaScript Entry Point
│   │
│   └── images/                    <-- Static Assets (Icons, SVGs, Logos)
│
├── components/                    <-- Server-Side HTML Partials (SSI templates)
│   ├── header.html
│   └── footer.html
│
├── pages/                         <-- Sub-Pages / Views
│   ├── users.html
│   └── dashboard.html
│
└── index.html                     <-- Main HTML Entry Point / SPA Shell