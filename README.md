# 🚀 DLancer – Decentralized Freelancing Platform

DLancer is a decentralized gig economy platform that leverages blockchain technology to create a secure, trustless freelancing experience. It includes features like smart contract-based escrow, DAO-powered dispute resolution, milestone-based payments, and wallet-based authentication.

---

## 🤝Contributions
- **Satyam Kumar** - https://github.com/ThakurSatyam04
- **Anjali Singh** - https://github.com/Anjali0048
- **Rohit Kumar** - https://github.com/ROHIT-01234
- **Sudhir Shenai** - https://github.com/sudhir-shenai

## 🛠 Tech Stack

### Frontend
- **React** – UI Framework
- **Tailwind CSS / Shadcn UI** – Styling
- **Ethers.js** – Web3 integration
- **React Router** – Routing
- **WalletConnect / MetaMask** – Wallet login

### Backend
- **Node.js** – Runtime
- **Express.js** – API framework
- **MongoDB (Mongoose)** – Database
- **Web3.js / Ethers.js** – Smart contract interaction

---

## 🔧 Installation Steps

Follow these steps to get DLancer up and running locally.

---

### 1. 📁 Clone the Repository
```bash
git clone https://github.com/Tech-Pirates-FYP/DLancer.git
cd DLancer
```

### 2. 📁 Add .env in root folder
```bash
SEPOLIA_RPC_URL = 
PRIVATE_KEY = 
PRIVATE_KEY_2 =
ETHERSCAN_API_KEY =
```

### 3. 📁 In /server/src/env/dev.env
```bash
PORT= 9999
MONGO_URI= 
SECRET_KEY=
```

### 4. 📁 Compile the smart contracts
```bash
cd contracts
npx hardhat compile
```

### 5. 📁 Setup frontend
```bash
cd client
npm install
npm run dev
```

### 6. 📁 Setup backend
```bash
cd ../server
npm install
npm run dev
```
