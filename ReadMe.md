my-app/
├── assets/
│   ├── css/
│   │   ├── common/                <-- Global UI Styles (Page တိုင်းမှာ ပါမည့် CSS)
│   │   │   ├── reset.css          // Browser Default Margin/Padding ဖျက်ရန်
│   │   │   ├── variables.css      // Root Colors, Fonts, Spacing များ
│   │   │   ├── components.css     // Modal, Buttons, Toast, Card Layouts
│   │   │   └── utilities.css      // Flex, Grid, Spacing Helper Classes
│   │   ├── features/              <-- Page သီးသန့် CSS များ
│   │   │   ├── user.css
│   │   │   └── dashboard.css
│   │   └── main.css               // Global CSS Entry Point (Imports all common styles)
│   │
│   ├── js/
│   │   ├── core/                  <-- Core Engine (Framework-less SDK)
│   │   │   ├── app.core.js        // Event Bus & Delegation Helper
│   │   │   ├── app.api.js         // Native Fetch API Wrapper
│   │   │   ├── app.state.js       // Simple Reactive State Manager
│   │   │   └── app.ui.js          // Global UI Components (Modal, Toast Loader Manager)
│   │   │
│   │   ├── components/            <-- Reusable UI Logic (Vanilla Web Components/Modules)
│   │   │   ├── navbar.js
│   │   │   └── sidebar.js
│   │   │
│   │   ├── features/              <-- Page-Specific Business Logic (Modules)
│   │   │   ├── user-feature.js
│   │   │   └── dashboard-feature.js
│   │   │
│   │   └── main.js                // Global Entry Point Script
│   │
│   └── images/                    <-- Static Assets
│       ├── icons/
│       └── logo.svg
│
├── components/                    <-- Common Server HTML partials (Server Side Include သုံးလျှင်)
│   ├── header.html
│   └── footer.html
│
├── pages/                         <-- Sub Pages
│   ├── users.html
│   └── dashboard.html
│
└── index.html                     <-- Main HTML Entry Point