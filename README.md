# 🏦 Sistema de Eventos Bancarios en Tiempo Real (Saga Orquestada)

![Next JS](https://img.shields.io/badge/Next-black?style=flat-square&logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

Este proyecto simula el ciclo de vida de una transacción bancaria (iniciación, reserva de fondos, chequeo de fraude y notificación) utilizando una **Arquitectura Orientada a Eventos (EDA)**. 

La aplicación demuestra el **desacoplamiento** de servicios y la actualización **en tiempo real** del estado mediante **Kafka** y **WebSockets**.

## 📸 Vista Previa

> El sistema visualiza en tiempo real cómo la transacción pasa por los distintos microservicios simulados.

---

## 🛠️ 1. Tecnologías y Componentes Clave

| Componente | Archivo/Módulo | Rol en el Flujo |
| :--- | :--- | :--- |
| **Plataforma** | Next.js (App Router) | Front-end y base del servidor personalizado. |
| **Infraestructura** | **Docker Compose** | Levanta Kafka y Zookeeper. |
| **Bus de Eventos** | **Kafka** | Canales asincrónicos (`txn.commands`, `txn.events`). |
| **Lanzador** | `server.js` | Inicia Next.js, el Orquestador y el Gateway en un solo proceso. |
| **Cerebro (Saga)** | `lib/orchestrator.ts` | Consume comandos, ejecuta la lógica de negocio y toma decisiones (ej. Reversión/Rollback). |
| **Gateway WS** | `lib/websocket-server.ts` | Escucha eventos de Kafka y los empuja (push) al navegador. |
| **Cliente WS** | `lib/use-websocket.ts` | El "Walkie-Talkie" del Front-end que recibe y almacena eventos en tiempo real. |
| **Puerta de Entrada** | `app/api/transactions/route.ts` | Recibe `POST` del formulario y publica la ORDEN inicial. |

---

## 🔁 2. El Flujo Asincrónico Completo

El proyecto se basa en el principio de que la **API no espera al procesamiento** (asincronía).

1.  **INICIO (Front-end):** El `TransactionForm` envía una orden `POST` a `/api/transactions`.
2.  **ORDEN (API):** `route.ts` recibe la orden, la valida, y publica un **Comando** (`txn.TransactionInitiated`) en el tópico **`txn.commands`**. Responde `202 Accepted` al instante.
3.  **PROCESAMIENTO (Orquestador):** El `orchestrator.ts` escucha `txn.commands`, inicia la Saga (simula Reserva, Fraude, etc.).
4.  **PROGRESO (Orquestador):** Después de cada paso, el Orquestador **publica un Evento** (ej. `txn.FundsReserved`, `txn.Committed`) en el tópico **`txn.events`**.
5.  **NOTIFICACIÓN (Gateway):** El `websocket-server.ts` escucha `txn.events` y al instante, **empuja** el evento al navegador a través de la conexión WebSocket.
6.  **PANTALLA (Front-end):** El `TransactionTimeline` recibe el evento y actualiza el estado en vivo.

---

## 🚀 3. Cómo Ejecutar el Proyecto

Este proyecto requiere que **Docker Desktop** esté activo para correr la infraestructura de Kafka.

### Prerrequisitos

* **Node.js** (versión 18 o superior)
* **Docker Desktop** (Activo y funcionando)

### Pasos de Arranque

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar la Infraestructura (Kafka/Zookeeper):**
    Ejecuta este comando para levantar los contenedores.
    ```bash
    docker-compose up -d
    ```

3.  **Iniciar la Aplicación (Servidor Next.js y Backend):**
    Este comando ejecuta nuestro `server.js` y enciende todos los servicios de Kafka Consumers (Orquestador y Gateway).
    ```bash
    npm run dev
    ```

4.  **Acceder:**
    * Abre tu navegador en: **`http://localhost:3000`**

---

## 🛑 Flujo de Prueba de Rollback (Saga)

* Inicia varias transacciones con los valores por defecto.
* Aproximadamente **1 de cada 10** transacciones mostrará la secuencia de reversión en el Timeline:
    * `txn.FundsReserved`
    * `txn.FraudChecked` (risk: **HIGH**)
    * `txn.Reversed` ⬅️ **(Muestra el rollback y termina la Saga)**

---
**Desarrollado por Tobías Carballo**
*Estudiante de Licenciatura en Sistemas | UADER*
[LinkedIn](https://www.linkedin.com/in/tobias-carballo/)