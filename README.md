# 👶 Mini Baby Monitor IoT Hub

*(English version below)*

## 專案價值與簡介 (Project Value)

這是一個基於雲原生架構 (Cloud-Native) 開發的輕量級物聯網 (IoT) 數據中樞系統。本專案模擬真實的寶寶監視器場景，透過 MQTT 協定接收高頻率的即時硬體數據，進行商業邏輯判斷後，將異常狀態持久化至資料庫中。

專案核心價值在於展現**現代化後端開發與 DevOps 維運能力**，完整打通了從硬體端數據流、微服務容器化、Kubernetes (K8s) 叢集佈署，到結合 AI 代理的自動化 CI/CD 流程。

## 🌟 核心技術亮點

* **IoT 即時數據流 (MQTT Pub/Sub)：** 捨棄傳統 HTTP 輪詢，採用極輕量級的 MQTT 協定建立 Broker，實現設備端與伺服器端的完美解耦，確保在惡劣網路環境下警報訊息的高可靠性。
* **高可用雲端基礎設施 (Kubernetes)：** 實踐「基礎設施即代碼 (IaC)」，撰寫標準 K8s YAML (Deployment, Service, ConfigMap)，完成服務發現與內部網路路由，具備快速水平擴展 (Scale-out) 的能力。
* **不可變基礎設施與容器優化：** 撰寫 Multi-stage `Dockerfile`，不僅大幅縮減 Image 體積，更透過升級底層 Node.js 執行環境，從根本解決了密碼學套件的跨版本相依性問題。
* **AI 賦能的自動化 DevOps：** 建置 GitHub Actions CI/CD 流程，整合大語言模型 (LLM) 打造自動化 Code Review Agent，於 Pull Request 階段針對安全性、架構與效能提供資深工程師級別的審查建議。

## 🛠️ 技術棧 (Tech Stack)

* **Backend:** Node.js (v20), TypeScript, Mongoose
* **IoT Protocol:** MQTT (Eclipse Mosquitto)
* **Database:** MongoDB
* **DevOps & Cloud:** Docker, Kubernetes (Kind), GitHub Actions
* **AI Agent:** OpenAI API / ChatGPT-CodeReview Action

## 🚀 快速啟動 (Quick Start)

本專案支援使用 `kind` (Kubernetes in Docker) 在本地端快速啟動叢集驗證。

```bash
# 1. 建立 K8s 叢集並建置/載入映像檔
kind create cluster --name iot-cluster
docker build -t baby-monitor-hub:v4 .
kind load docker-image baby-monitor-hub:v4 --name iot-cluster

# 2. 佈署基礎設施與應用服務
kubectl apply -f k8s/

# 3. 啟動本機端 MQTT 轉發與硬體模擬器進行試車
kubectl port-forward svc/mqtt-svc 1883:1883 &
npm run sim

# 4. 監看微服務即時日誌
kubectl logs -l app=hub -f

```

---

# 👶 Mini Baby Monitor IoT Hub (English)

## Project Value & Overview

This is a lightweight, cloud-native IoT data hub system simulating a real-time baby monitor scenario. It utilizes the MQTT protocol to ingest high-frequency telemetry data from simulated hardware, processes business logic on the fly, and persists anomalous events to a database.

The core value of this project lies in demonstrating **modern backend architecture and DevOps capabilities**. It showcases a complete pipeline: from handling hardware telemetry and containerizing microservices, to orchestrating deployments via Kubernetes (K8s) and integrating an AI-powered CI/CD workflow.

## 🌟 Key Technical Highlights

* **Real-time IoT Telemetry (MQTT Pub/Sub):** Replaced traditional HTTP polling with a lightweight MQTT Broker to achieve perfect decoupling between devices and servers, ensuring high reliability of alert messages even in constrained network environments.
* **Highly Available Infrastructure (Kubernetes):** Embraced "Infrastructure as Code (IaC)" by authoring declarative K8s YAMLs (Deployment, Service, ConfigMap) to handle service discovery and internal routing, preparing the system for rapid horizontal scaling.
* **Immutable Infrastructure & Container Optimization:** Implemented Multi-stage `Dockerfile` builds to drastically reduce image size. Successfully resolved deep-seated cryptographic dependency issues by cleanly upgrading the underlying Node.js runtime (v18 to v20) at the infrastructure level.
* **AI-Powered DevOps Automation:** Constructed a GitHub Actions CI/CD pipeline integrated with an LLM-based Code Review Agent. It automatically reviews Pull Requests, providing senior-level feedback on security, architecture, and performance.

## 🛠️ Tech Stack

* **Backend:** Node.js (v20), TypeScript, Mongoose
* **IoT Protocol:** MQTT (Eclipse Mosquitto)
* **Database:** MongoDB
* **DevOps & Cloud:** Docker, Kubernetes (Kind), GitHub Actions
* **AI Agent:** OpenAI API / ChatGPT-CodeReview Action

## 🚀 Quick Start

This project supports rapid local cluster validation using `kind` (Kubernetes in Docker).

```bash
# 1. Create a K8s cluster, build, and load the image
kind create cluster --name iot-cluster
docker build -t baby-monitor-hub:v4 .
kind load docker-image baby-monitor-hub:v4 --name iot-cluster

# 2. Deploy infrastructure and the application
kubectl apply -f k8s/

# 3. Port-forward the MQTT service and run the hardware simulator
kubectl port-forward svc/mqtt-svc 1883:1883 &
npm run sim

# 4. Monitor real-time microservice logs
kubectl logs -l app=hub -f

```