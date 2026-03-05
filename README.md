# PetCare
A responsive PetCare service website built with React, featuring modern UI design, service listings, and booking interfaces for pet care services.


![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## Overview

PetCare is a full-featured pet care service booking web app. Users can browse services, book appointments, make payments, and manage their bookings — all within a clean and responsive interface.

The app is built with a mock mode that simulates a real backend using `localStorage`, making it fully functional without any server setup.

---

## Features

- **Auth** : Sign in, sign up, forgot password with client-side validation
- **Booking Flow** : Service catalog, custom date picker, time slot selection
- **Payment** : QRIS and Virtual Account (BCA, BNI, Mandiri)
- **My Bookings**: Filter, pay, and cancel bookings
- **Profile** : Update personal info and change password
-  **Responsive** : Optimized for mobile, tablet, and desktop

---

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Vite** — fast build tooling
- **Lucide React** — icons

---

## Getting Started

```bash
git clone https://github.com/yourusername/petcare.git
cd petcare/frontend

pnpm install
cp .env.example .env
pnpm dev
```

---

## Project Structure

```
src/
├── components/
│   ├── sections/     # Landing page sections
│   └── ui/           # Reusable components
├── context/          # Auth context
├── data/             # Static data & service catalog
├── hooks/            # Custom hooks
├── pages/            # Route-level components
├── services/         # API / mock service layer
└── utils/            # Validation helpers
```