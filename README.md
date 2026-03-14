# Distributed URL Shortener – Kubernetes Architecture

This project demonstrates a **cloud-native URL shortening service** deployed on Kubernetes with a production-style architecture.

## Architecture Overview

The system is designed to handle high traffic with scalable backend services, caching, and a highly available database.

### Core Components

- **NGINX Ingress Controller** – external traffic entry point
- **Node.js Backend APIs** – horizontally scalable pods
- **Redis Cache** – reduces database load and speeds up redirects
- **PostgreSQL HA Cluster** – managed by Zalando Postgres Operator
- **Kubernetes Services** – internal service discovery and load balancing

### Request Flow

1. Client sends request to the **Ingress Controller**
2. Ingress routes traffic to the **Kubernetes Service**
3. Service load balances requests across **multiple backend API pods**
4. Backend first checks **Redis cache**
5. If cache miss occurs:
   - Query **Postgres Primary**
6. Postgres replicates data to **Replica node for high availability**

## Architecture Diagram

```mermaid
flowchart TD

User[Client / Browser]

Ingress[NGINX Ingress Controller]

Service[Kubernetes Service]

subgraph Backend
API1[Node API Pod]
API2[Node API Pod]
API3[Node API Pod]
end

Redis[(Redis Cache)]

subgraph Postgres
Primary[(Primary DB)]
Replica[(Replica DB)]
end

User --> Ingress
Ingress --> Service

Service --> API1
Service --> API2
Service --> API3

API1 --> Redis
API2 --> Redis
API3 --> Redis

API1 --> Primary
API2 --> Primary
API3 --> Primary

Primary --> Replica
````

## Key Features

* Horizontal scaling using Kubernetes Deployments
* High availability PostgreSQL cluster
* Redis caching for fast redirects
* Kubernetes service load balancing
* Ingress-based external access
* Cloud-native microservice architecture

