<p align="center">
  <h1 align="center">🧘 Sanctuary — Solana Wellness & Fitness Platform</h1>
  <p align="center"><strong>Web3-Powered Wellness with 3D Immersive Experiences</strong></p>
  <p align="center">
    A next-gen wellness and fitness platform built on Solana blockchain with immersive 3D experiences (React Three Fiber), AI-powered exercise analysis (Google GenAI), and on-chain reward systems. Features GSAP animations, Supabase backend, and Phantom wallet integration.
  </p>
</p>

<p align="center">
  <a href="https://sanctuary-flame-iota.vercel.app"><img src="https://img.shields.io/badge/🌐_Live-sanctuary.vercel.app-14F195?style=for-the-badge" alt="Live" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-TypeScript-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Solana-Blockchain-14F195?logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-3D-000000?logo=three.js&logoColor=white" alt="R3F" />
  <img src="https://img.shields.io/badge/Google_GenAI-AI-4285F4?logo=google&logoColor=white" alt="GenAI" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
</p>

---

## ✨ Features

- 🌐 **3D Immersive UI** — React Three Fiber + Drei for stunning 3D visual experiences with post-processing effects
- 🧠 **AI Exercise Analysis** — Google GenAI-powered exercise recommendations and form analysis
- 💎 **Solana Integration** — Anchor program for on-chain rewards, wallet adapter for Phantom/Solflare
- 📊 **Exercise Tracking** — Supabase-backed exercise data with structured schemas
- 🎨 **Premium Animations** — GSAP scroll-triggered animations and transitions
- 🔐 **Web3 Auth** — Solana wallet-based authentication

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (TypeScript) |
| **3D Engine** | React Three Fiber + Drei + Postprocessing |
| **Blockchain** | Solana (Anchor Programs) |
| **AI** | Google GenAI (@google/genai) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Animations** | GSAP + @gsap/react |
| **UI** | Radix UI + Tailwind CSS |

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend["🖥️ Next.js App"]
        Landing[3D Landing<br/>React Three Fiber]
        Exercises[Exercise Hub<br/>AI-Powered Analysis]
        Wallet[Wallet Connect<br/>Phantom / Solflare]
    end

    subgraph AI["🧠 AI Layer"]
        GenAI[Google GenAI<br/>Exercise Analysis]
    end

    subgraph Blockchain["⛓️ Solana"]
        Anchor[Anchor Program<br/>On-Chain Rewards]
        Devnet[Solana Devnet]
    end

    subgraph Backend["☁️ Supabase"]
        DB[(PostgreSQL<br/>Exercise Data)]
        Auth[Auth]
    end

    Landing --> Wallet
    Wallet --> Anchor --> Devnet
    Exercises --> GenAI
    Exercises --> DB
```

---

## 📁 Project Structure

```
sanctuary/
├── src/                        # Next.js source
├── anchor-program/             # Solana smart contract (Anchor)
├── scripts/                    # Deployment & utility scripts
├── supabase-schema.sql         # Database schema
├── supabase-schema-exercises.sql # Exercise data schema
├── public/                     # Static assets
└── package.json
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/deevashb24/sanctuary.git
cd sanctuary
npm install
npm run dev
```

Live at **[sanctuary-flame-iota.vercel.app](https://sanctuary-flame-iota.vercel.app)**

---

## 📄 License

MIT License

---

<p align="center">
  <strong>Find your sanctuary — on-chain wellness 🧘</strong>
</p>
