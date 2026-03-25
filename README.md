# 🛡️ Dodge AI: Supply Chain Intelligence Engine

**Dodge AI** is a high-performance, full-stack **Graph-RAG** (Retrieval-Augmented Generation) application designed for deep forensic analysis of "Order-to-Cash" supply chain flows. It combines an embedded graph database with Large Language Models (LLMs) to provide real-time, natural language insights into complex logistical networks.

---

## ⚡ Core Pillars

-   **Graph-RAG Architecture**: Merges the reasoning power of **Groq (Llama 3.3)** with the structural precision of a property graph.
-   **Analytical Graph Lake**: Utilizes **DuckDB** for vectorized processing of supply chain triples, achieving sub-100ms query latency.
-   **High-Fidelity Visualization**: Powered by **Cytoscape.js**, featuring a custom "Blue vs. Red" node convention for clear entity-to-metadata separation.
-   **Premium Glassmorphism UI**: A production-grade dashboard built with **React** and **Tailwind CSS**, featuring frosted glass panels, live telemetry, and sidebar AI interaction.
-   **Bidirectional Interaction**: Touch nodes on the graph to trigger AI forensic traces, or prompt the AI to have it automatically focus and zoom the map.

---

## 🏗️ Technical Architecture

### **Backend Engine**
-   **FastAPI**: High-performance asynchronous API layer.
-   **DuckDB**: Embedded analytical database for zero-latency storage.
-   **NetworkX**: Complex network modeling and relationship extraction.
-   **Groq SDK**: Ultra-fast inference using Llama 3 models.

### **Frontend Dashboard**
-   **React 19 + Vite**: Modern, atomic component architecture.
-   **Cytoscape.js**: Industrial-grade graph visualization engine.
-   **Lucide Icons**: Clean, professional iconography.
-   **Tailwind CSS**: Custom "Linear-style" design system with `backdrop-filter` support.

---

## 🚀 Deployment & Scaling

The system is fully containerized and optimized for cloud environments like **AWS EC2**.

### **Dockerized Workflow**
We use a multi-stage `Dockerfile` to optimize image size and performance:
1.  **Stage 1**: Builds the React frontend (Vite).
2.  **Stage 2**: Packages the Python backend and serves the frontend assets via FastAPI.

```bash
# Start the entire stack in one command
docker-compose up -d --build
```

### **AWS Hosting Guide**
*   **Instance**: t2.micro (Ubuntu 24.04).
*   **Memory Management**: Configured with 2GB Swap space to handle heavy builds.
*   **Networking**: Exposed on port `8000` via AWS Security Groups.

---

## 📂 Project Structure

```bash
├── main.py              # FastAPI Entry Point & RAG Logic
├── db.py                # DuckDB & Graph Data Layer
├── memory_manager.py    # Conversation & Context Buffer
├── preprocessing.py     # CSV-to-Graph ETL Pipeline
├── graph_edges.csv      # Source Supply Chain Dataset
├── Dockerfile           # Multi-stage Container Profile
├── docker-compose.yml   # Production Orchestration
└── frontend/            # React Application Source
    ├── src/             
    │   ├── components/  # Dashboard, Chat, Popups
    │   └── lib/         # Cytoscape Utils & Logic
    └── package.json     
```

---

## 🎯 Sample Forensic Queries

-   *"Perform a full trace on Order_740506. Who is the customer and what is the billing status?"*
-   *"Identify nodes with high degree centrality. Which products are most connected?"*
-   *"Analyze the relationship between Customer_310000109 and Order_740510."*
-   *"Are there any disconnected clusters or orphans in the graph?"*

---

## 🛡️ Analyst Guardrails

This engine is strictly tuned for **Supply Chain Forensic Analysis**. It utilizes a proprietary system prompt to ensure it refuses off-topic requests (poems, general code, etc.) and focuses exclusively on the logic contained within the graph dataset.

*"Dodge AI: Turning complex logisitcs data into actionable intelligence."*
