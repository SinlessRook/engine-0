---
track: Software Engineering Placement 2026
course: System Design
total_modules: 4
status: Active
---

# Module 1: Scalability & Load Balancing

## Core Paradigms & System Invariants
* **The Scalability Bottleneck:** Identifying and resolving structural resource limits across computing layers (CPU bounds, Network I/O limits, and Disk Read/Write congestion).
* **Stateless Application Tiers:** Offloading instance variables to remote data caches or persistent databases so that incoming requests can be routed to any active container seamlessly.
* **The Single Point of Failure (SPOF):** Ensuring high availability by removing single points of failure through redundant hardware clustering and automated health checking.

## Sub-Topics & Concepts
### 1. Horizontal vs. Vertical Scaling
* **Concepts:** Adding raw hardware capacity to a single server (Vertical) vs. provisioning a cluster of independent, commodity hardware machines (Horizontal); cost-to-performance curve ceilings.
* **Invariants:** Vertical scaling is bound by hard physical hardware limits, whereas horizontal scaling requires a distributed software network layer to manage data partitioning and routing.

### 2. Load Balancing Strategies
* **Concepts:** OSI Layer 4 (Transport layer TCP/UDP routing) vs. Layer 7 (Application layer content/HTTP routing) load balancing; algorithms (Round Robin, Weighted Least Connections, IP Hash); health monitoring.
* **Invariants:** Layer 4 balancers evaluate routing based entirely on raw packet headers, whereas Layer 7 balancers must parse the incoming HTTP body payload, increasing processing overhead but allowing granular route routing.

### 3. Caching Layers - Redis & Memcached
* **Concepts:** High-speed in-memory data storage; eviction policies (LRU, LFU, FIFO); invalidation strategies (Cache-Aside, Write-Through, Write-Behind); Cache Penetration, Stampede, and Cascading Cache Faults.
* **Invariants:** Caching significantly drops database read latencies but introduces immediate transactional synchronization challenges across temporary distributed storage boundaries.

### 4. Database Replication & Failover
* **Concepts:** Single-Leader (Master-Slave), Multi-Leader, and Leaderless configurations; Synchronous vs. Asynchronous data replication lag; Quorum configurations; Heartbeat monitoring and split-brain resolution.
* **Invariants:** Synchronous replication guarantees strict data durability across replica pairs at the cost of blocking concurrent write operations until network parity completes.

---

# Module 2: Distributed Systems Concepts

## Core Paradigms & System Invariants
* **The Network Fallacy:** Assuming networks are completely safe, zero-latency, and infinitely reliable.
* **Data Trade-Off Realities:** Managing data across distributed systems means you must balance low latency against absolute data consistency.

## Sub-Topics & Concepts
### 1. Consistency Models (Eventual vs. Strong)
* **Concepts:** Linearizability (Strong Consistency - all reads return the latest absolute write state) vs. Eventual Consistency (replicas converge over a window of time); Monotonic Reads, Read-Your-Own-Writes validation patterns.
* **Invariants:** Strong consistency requires expensive global locking or synchronization barriers, increasing write latency and reducing availability under high write loads.

### 2. Distributed Transactions (2PC vs. Saga)
* **Concepts:** Two-Phase Commit (2PC - Prepare phase and Commit phase) vs. The Saga Pattern (Choreography or Orchestration using a chain of localized individual transactions paired with roll-back Compensating Transactions).
* **Invariants:** 2PC is a blocking protocol that can hang an entire cluster if the coordinator coordinator node fails mid-execution, whereas Saga relies on asynchronous eventual consistency models.

### 3. Consensus Algorithms (Raft vs. Paxos)
* **Concepts:** Replicated State Machines; Raft execution roles (Leader, Follower, Candidate), Leader Election states, Log Replication synchronization, Term indexes; Multi-Paxos mechanics.
* **Invariants:** Raft simplifies complex consensus state tracking by enforcing a strict, top-down unidirectional data flow from an elected cluster leader to all passive follower nodes.

### 4. Microservices Architecture
* **Concepts:** Deconstructing monolithic applications into loosely coupled domain-driven bounded contexts; API Gateways (routing, rate limiting, authentication); Service Meshes; Distributed Tracing (Jaeger, Zipkin).
* **Invariants:** Microservices simplify team autonomy and isolated deployment scaling, but shift software complexity directly onto the underlying network communication and service discovery layers.

---

# Module 3: API Design & Communication

## Core Paradigms & System Invariants
* **The Network Contract:** Defining clean, version-controlled interface signatures that isolate client access routes from changing internal backend microservices.
* **Serialization Efficiency:** Minimizing CPU compute overhead and raw payload sizes during data translation phases before transmission across open network lines.

## Sub-Topics & Concepts
### 1. REST API Design Principles
* **Concepts:** Resource-oriented URI path models; safe and idempotent HTTP verbs (`GET`, `PUT`, `DELETE`, `POST`, `PATCH`); HATEOAS; standard REST status code error routing maps; pagination patterns.
* **Invariants:** `GET`, `PUT`, and `DELETE` requests must remain strictly idempotent, ensuring that executing identical requests repeatedly yields the exact same server state.

### 2. GraphQL vs. REST
* **Concepts:** Declarative data fetching vs. rigid endpoint definitions; Schema definition language (SDL), Queries, Mutations, Resolvers; solving the Over-fetching and Under-fetching architectural data traps.
* **Invariants:** GraphQL allows clients to specify exact data shapes in a single query request, but moves execution complexity to the backend resolver parsing layer, introducing N+1 database lookup risks.

### 3. Message Queues (RabbitMQ vs. Kafka)
* **Concepts:** AMQP smart broker model (RabbitMQ) vs. Distributed append-only commit log architectures (Apache Kafka); Publisher/Subscriber patterns; consumer groups, message partitions, offset tracking management.
* **Invariants:** RabbitMQ tracking states are purged immediately upon consumer acknowledgment receipt, whereas Kafka stores immutable raw log records sequentially on disk for defined retention windows.

### 4. gRPC & Protocol Buffers
* **Concepts:** HTTP/2 transport streaming configurations; Protocol Buffers (`.proto`) binary serialization encoding schemas; Client stub to Server execution bindings; Bidirectional streaming architectures.
* **Invariants:** gRPC bypasses human-readable text-parsing overhead (JSON/XML) by compiling structural payloads directly into packed binary encodings, maximizing internal microservice communication throughput.

---

# Module 4: Real-World System Design Case Studies

## Core Paradigms & System Invariants
* **The High-Availability Blueprint:** Mapping out end-to-end data pipelines from the initial DNS lookup to edge caching, load balancing, stateless routing, queue buffering, and write optimization.
* **Back-of-the-Envelope Estimates:** Calculating memory, storage, and bandwidth limits to size system clusters accurately before diving into diagram architectures.

## Sub-Topics & Concepts
### 1. Design Twitter
* **Concepts:** High-throughput read-to-write ratios ($100:1$); Fan-out write strategies (pushing updates directly to active user home timelines in Redis caches) vs. Fan-out read strategies (pulling tweets dynamically for celebrity accounts with massive follower counts).
* **Invariants:** Combining hybrid push/pull fan-out models prevents celebrity tweet generation runs from overwhelming the global database write queues.

### 2. Design Instagram
* **Concepts:** Large-scale media content delivery; Content Delivery Networks (CDNs) optimization routing; relational user mapping tables paired with distributed object storage blocks (S3); Timeline generation feeds.
* **Invariants:** Metadata storage pipelines must remain decoupled from actual binary image and video block file assets to scale read performance independently.

### 3. Design YouTube
* **Concepts:** High-bandwidth video ingestion streams; asynchronous chunked video file uploading pipelines; transcoding servers processing raw media files into multi-bitrate resolutions (HLS, DASH protocol streaming).
* **Invariants:** Adaptive Bitrate Streaming (ABR) lets client video players dynamically adjust video resolution streams on the fly based on real-time client network speed changes.

### 4. Design an Enterprise E-Commerce Platform
* **Concepts:** High-concurrency inventory flash sale locking patterns; strict database ACID isolation controls; shopping cart state management; payment integration processing loops.
* **Invariants:** Flash-sale inventory deductions must rely on atomic database counters or distributed Redis locks to prevent stock over-selling under massive, concurrent request bursts.