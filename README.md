# 🎵 Beat Link (BeatLnk)
**Decentralized Music Identity & Data Network — live on World Chain Mainnet**

Own and prove your Spotify taste without revealing raw data. Beat Link turns zk-verified listening activity into a **VIBE DataCoin (ERC-20)** and unlocks **token-gated artist/genre communities**.

<p align="left">
  <a href="https://beat-link.mithranmv.com/">Live Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#how-it-works">How it works</a> •
  <a href="#repository-structure">Repo</a>
</p>

---

## ✨ Features

- **zk-Verified Spotify Data** — Reclaim Protocol + zkTLS; no raw Spotify data leaves your device.  
- **Encrypted, Decentralized Storage** — Lighthouse (IPFS/Filecoin).  
- **VIBE DataCoin** — ERC-20 minted after verification (World Chain).  
- **Token-Gated Communities** — Artist/genre chats for verified listeners.  
- **World Mini App UX** — Seamless wallet & tx flow in-app.  
- **DeFi-ready** — VIBE can plug into AMMs, rewards, staking.

---

## 🚀 Quick Start

> **Network selection**
>
> - If you want to try the project on **mainnet**, use the **`mainnet/`** folder **together with** the **`backend/`** folder.  
> - If you want to try the project on **testnet**, use the **`testnet/`** folder **together with** the **`backend/`** folder.

### 1) Clone
```bash
git clone https://github.com/fabiomughilan/BeatLnk.git
cd BeatLnk
````

### 2) Environment variables

Choose **one** mode and copy the env templates.

**Mainnet mode**

```bash
# Backend
cp mainnet/.env.backend.example backend/.env
# Frontend
cp mainnet/.env.frontend.example frontend/.env.local
```

**Testnet mode**

```bash
# Backend
cp testnet/.env.backend.example backend/.env
# Frontend
cp testnet/.env.frontend.example frontend/.env.local
```

Fill the placeholders (see **Env reference** below).

### 3) Install & run

**Backend**

```bash
cd backend
npm install
npm run dev
# or npm run start for production
```

**Frontend**

```bash
cd ../frontend
npm install
npm run dev
# App defaults to http://localhost:3000
```

---

## 🔐 Env reference (placeholders)

*Backend (`backend/.env`):*

```
# World Chain / RPC
WORLDCHAIN_RPC_URL=
CHAIN_ID=480  # (example; set to actual)
VIBE_TOKEN_ADDRESS=              # Filled from mainnet/testnet config
# Reclaim / zkTLS
RECLAIM_APP_ID=
RECLAIM_PROVIDER_ID=spotify
RECLAIM_API_KEY=
# Lighthouse
LIGHTHOUSE_API_KEY=
# Optional: Push Protocol (chat)
PUSH_APP_ENV=prod
PUSH_CHANNEL_ADDRESS=
```

*Frontend (`frontend/.env.local`):*

```
NEXT_PUBLIC_VIBE_TOKEN_ADDRESS=
NEXT_PUBLIC_EXPLORER_URL=
NEXT_PUBLIC_WORLD_MINI_APP_ID=
NEXT_PUBLIC_BACKEND_URL=http://localhost:PORT
NEXT_PUBLIC_PUSH_CONFIG=enabled
```

> Contract addresses and network constants are stored in:
>
> * `mainnet/addresses.json` (World Chain mainnet)
> * `testnet/addresses.json` (testnet)

---

## 🗂 Repository Structure

```
.
├── backend/          # APIs, Reclaim/zkTLS verification, Lighthouse upload, token mint triggers
├── frontend/         # Next.js app + World Mini SDK integration
├── mainnet/          # Mainnet configs (.env.* examples, addresses.json, deploy notes)
├── testnet/          # Testnet configs (.env.* examples, addresses.json, deploy notes)
└── README.md
```

* **Mainnet run:** `mainnet/` + `backend/` (+ `frontend/`)
* **Testnet run:** `testnet/` + `backend/` (+ `frontend/`)

---

## 🛠 Tech Stack

| Layer            | Tool/Protocol                     | Purpose                       |
| ---------------- | --------------------------------- | ----------------------------- |
| Data proofs      | **Reclaim Protocol + zkTLS**      | Verify Spotify data privately |
| Storage          | **Lighthouse (IPFS/Filecoin)**    | Encrypted, permanent data     |
| Tokenization     | **VIBE (ERC-20)**                 | Data ownership + utility      |
| Chain            | **World Chain (Mainnet/Testnet)** | On-chain logic                |
| Client           | **Next.js + World Mini App SDK**  | Wallet & tx UX                |
| Messaging (exp.) | **Push Protocol**                 | Token-gated artist chats      |

---

## 🧠 How it works

1. **Connect & Prove** — User connects Spotify via **Reclaim**; zkTLS generates attestations of liked songs/playlists/recent artists (no raw data).
2. **Encrypt & Store** — Proof bundle is encrypted and uploaded via **Lighthouse** to IPFS/Filecoin.
3. **Mint VIBE** — Backend validates proof and triggers **VIBE** mint (World Chain).
4. **Join Communities** — Users with matching verified artists/genres unlock **token-gated chats** (via Push Protocol).

---

## 🧪 Development notes

* **Contracts**: addresses and ABIs are referenced from `mainnet/` or `testnet/`.
* **World Mini**: the app uses World Mini SDK for auth/sign and gas-efficient flows on World Chain.
* **Chat gating**: access rules derive from verified artists/genres + VIBE balance/holds.

---

## 🌐 Demo

* App: **[https://beat-link.mithranmv.com/](https://beat-link.mithranmv.com/)**
* Status: **Live on World Chain Mainnet**

---

## 🤖 AI assistance (hackathon)

* ChatGPT — scaffolding, docs, quick iterations.
* Claude — Solidity review & access-control logic hints.
* Copilot — inline UI/SDK suggestions.

*No AI used for cryptographic proofs; those rely on Reclaim/zkTLS.*

---

## 📨 Contact / Team

Built at **ETHGlobal 2025** by

* **Mithran MV** — product & full-stack
* **Fabio Mughilan** — contracts & infra

---
