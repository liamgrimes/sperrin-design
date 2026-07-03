# Sperrin Design
Sperrin Design Website

Official website for Sperrin Design — a contemporary Irish fashion brand inspired by heritage, sustainability, craftsmanship, and slow fashion principles.

Project Goals

Version 1 of the website focuses on establishing a strong online presence for the brand rather than ecommerce.

Current scope:

Homepage
About page
Collections / Gallery page
Contact and Brand Hub page


The project intentionally uses a lightweight stack:

HTML5
CSS3
Vanilla JavaScript
Git and GitHub for collaboration
GoDaddy hosting

The site is designed as a static website.

Project Structure
sperrin-design/
│
├── index.html
├── about.html
├── collections.html
├── contact.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages.css
│   │
│   ├── js/
│   │   └── main.js
│   │
│   └── images/
│
└── README.md
CSS Architecture
variables.css

Contains reusable design tokens:

colours
spacing values
typography settings
layout dimensions
base.css

Contains global styles:

CSS reset
typography defaults
image behaviour
anchor styles
list styles
layout.css

Contains layout rules:

header layout
footer layout
responsive navigation
spacing between sections
components.css

Contains reusable UI components:

Examples:

buttons
cards
forms
image containers
pages.css

Contains styling specific to individual pages.

Current Status

Completed:

Repository setup
GitHub integration
Project structure
Page skeletons
Responsive layout foundation

In Progress:

Homepage layout
Component system
Gallery structure