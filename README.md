# 🧠 Graph LLM Query System

An intelligent data exploration system that allows users to query databases using **natural language** and visualize relationships through an **interactive graph interface**.

---

## 🚀 Overview

The **Graph LLM Query System** enables users to:

* Ask questions in plain English
* Automatically generate optimized SQL queries
* Execute queries on a PostgreSQL database
* Visualize results as an interactive graph
* Expand nodes dynamically for deeper insights

This system combines **LLMs + SQL + Graph Visualization** to create a powerful data exploration tool.

---

## 🏗️ Architecture

```
Frontend (React + React Flow)
        ↓
API Layer (Express.js)
        ↓
LLM Query Processor
        ↓
PostgreSQL Database
```

### Components:

* **Frontend** → Chat interface + Graph visualization
* **Backend** → Query processing + API handling
* **LLM Layer** → Converts natural language → SQL
* **Database** → Stores structured data
* **Graph Engine** → Transforms rows → nodes & edges

---

## ⚙️ Tech Stack

### Frontend

* React.js
* React Flow (Graph Visualization)
* Axios

### Backend

* Node.js
* Express.js
* PostgreSQL (pg)

### AI / LLM

* OpenAI GPT (for query generation)

---

## 🔥 Features

* 🧠 Natural language to SQL conversion
* ⚡ Optimized query execution
* 🛡️ SQL guardrails for safety
* 📊 Graph-based data visualization
* 🔄 Dynamic node expansion
* 📦 Structured API responses
* 🌐 Fully deployable (Render + Vercel)

---

## 📁 Project Structure

```
graph_llm_query_system/
│
├── backend/                   
│   ├── src/
│   │   ├── app.js
│   │   ├── clearDb.js
│   │   ├── testDb.js
│   │   │            
│   │   ├── config/             
│   │   │   ├── db.js         
│   │   │   └── llm.js          
│   │   │
│   │   ├── controllers/        
│   │   │   └── query.controller.js
│   │   │   └── graph.controller.js
│   │   │
│   │   ├── data_ingestion/           
│   │   │   ├── load_jsonl.js
│   │   │   ├── seed_db.js
│   │   │   └── transform.js
│   │   │
│   │   ├── Models/           
│   │   │   ├── billing.model.js
│   │   │   ├── customer.model.js
│   │   │   ├── delivery.model.js
│   │   │   ├── order.model.js
│   │   │   ├── payment.model.js
│   │   │   └── product.model.js
│   │   │
│   │   ├── routes/             
│   │   │   ├── query.routes.js
│   │   │   └── graph.routes.js
│   │   │
│   │   ├── services/           
│   │   │   ├── query.service.js
│   │   │   ├── guardrail.service.js
│   │   │   ├── graph.service.js
│   │   │   └── llm.service.js
│   │   │
│   │   ├── utils/             
│   │   │   ├── graphTransformer.js
│   │   │   ├── logger.js
│   │   │   └── sqlValidator.js
│   │   │
│   │   ├── prompts/         
│   │   │   ├── response.Prompt.js
│   │   │   ├── sql.Prompt.js
│   │   │   └── guardrail.Prompt.js
│   │
│   ├── package.json               
│   └── .env         
│
├── frontend/                   
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── App.css
│   │   │
│   │   ├── pages/             
│   │   │   └── Home.jsx
│   │   │
│   │   ├── components/        
│   │   │   ├── Chat.jsx
│   │   │   ├── GraphView.jsx
│   │   │   ├── GraphView.css
│   │   │   └── NodeDetails.jsx
│   │   │
│   │   ├── services/           
│   │   │   └── api.js
│   │
│   └──  package.json
│                 
└── README.md 
```

---

## 🧪 Example Query

```
Show orders for customer 310000109
```

### Generated SQL:

```sql
SELECT id, customer_id
FROM sales_orders
WHERE customer_id = 310000109
LIMIT 50;
```

### Output:

* Rows returned
* Graph visualization (Customer → Orders)

---

## 🔐 Environment Variables

### Backend (`.env`)

```
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_postgres_url
PORT=3000
```

⚠️ Never commit `.env` files to GitHub.

---

## 🛠️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/graph_llm_query_system.git
cd graph_llm_query_system
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
OPENAI_API_KEY=your_key
DATABASE_URL=your_db_url
```

Run server:

```
node src/app.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🛡️ Guardrails Implementation

* Prevents unsafe SQL queries
* Limits result size (`LIMIT 50`)
* Validates user input
* Ensures read-only operations

---

## 🚀 Future Improvements

* Multi-table joins visualization
* Advanced graph layouts
* Query caching
* Role-based access control
* Fine-tuned LLM model

---

