---
track: Software Engineering Placement 2026
course: Database Management Systems
total_modules: 4
status: Active
---

# Module 1: Relational Model & SQL Basics

## Core Paradigms & Structural Invariants
* **Data Independence:** Physical storage organization remains isolated from logical schema design representations.
* **Relational Algebra Foundations:** Map structures rely on mathematical set theory closures—the input is a relation, and the operation output is strictly a new relation.
* **Data Integrity Restrictions:** Enforcing strict Entity Integrity (Primary Keys cannot be Null) and Referential Integrity (Foreign Keys must point to valid referencing targets).

## Sub-Topics & Concepts
### 1. ER Model & Schema Design (Medium)
* **Concepts:** Entities, Attributes (Derived, Composite, Multi-valued), Cardinality ratios (1:1, 1:N, M:N), Participation constraints (Total vs. Partial); converting ER diagrams into physical tables.
* **Invariants:** Many-to-Many relationships require a separate junction associative bridge table to resolve mapping dependencies without redundancy.

### 2. Normalization (1NF to BCNF) (Hard)
* **Concepts:** Functional Dependencies ($X \rightarrow Y$), Closure of Attribute Sets ($X^+$); 1NF (Atomic values), 2NF (No partial dependencies), 3NF (No transitive dependencies), BCNF (For every dependency $X \rightarrow Y$, $X$ must be a super key).
* **Invariants:** Normalization optimizes write paths by eliminating update anomalies at the expense of read paths, which now require multi-table JOIN computational steps.

### 3. SQL Queries & Joins (Medium)
* **Concepts:** Nested executions, Aggregations (`GROUP BY`, `HAVING`); Logical operators vs. Physical operations; Inner, Left/Right Outer, Full Outer, and Cross Joins.
* **Invariants:** `WHERE` filters out raw underlying rows *before* aggregation processing; `HAVING` filters out summary metric sets *after* aggregation processing.

### 4. Indexes & Query Optimization (Medium)
* **Concepts:** B-Trees vs. B+ Trees layouts, LSM Trees (Log-Structured Merge); Clustered Indexes (determines physical row storage order) vs. Non-Clustered Indexes (secondary pointers file lookup mapping).
* **Invariants:** B+ Trees store all actual underlying data records exclusively in leaf nodes linked horizontally, guaranteeing $O(\log n)$ search, insertion, and deletion overheads alongside rapid range scans.

## High-Yield Reference Questions
* **LeetCode / Interview Classic:** Given an un-indexed millions-row user history database, write a query to fetch top metrics while detailing how database engine performance drops when forcing a Full Table Scan vs. an Index Seek.
* **Schema Design Challenge:** Design a clean, normalized relational model schema for an international ecommerce platform that isolates order states, checkout pricing histories, and changing product inventories without tracking anomalies.

---

# Module 2: Advanced SQL & Transaction Management

## Core Paradigms & Structural Invariants
* **The ACID Contract:** Ensuring database state transitions remain completely safe across concurrent transaction threads.
* **Declarative Set Processing:** Operating over complete data vectors simultaneously instead of relying on procedural line-by-line pointer checking loops.

## Sub-Topics & Concepts
### 1. Subqueries & CTEs (Medium)
* **Concepts:** Correlated subqueries (inner execution loops repeatedly for every outer row) vs. Non-correlated executions; Common Table Expressions (`WITH` syntax), Recursive CTEs.
* **Invariants:** Recursive CTEs require an initial base anchor query unioned with a recursive step execution that runs continually until the result set returns empty.

### 2. Window Functions (Medium)
* **Concepts:** Over-partitioning patterns (`PARTITION BY`, `ORDER BY`); analytic functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`).
* **Invariants:** Window functions output row calculations over specified subsets without reducing the structural cardinality of the final query results table.

### 3. Stored Procedures & Triggers (Medium)
* **Concepts:** Pre-compiled database execution code vs. ad-hoc scripting; dynamic compilation advantages; Automated Triggers (`BEFORE`/`AFTER` state execution hooks for `INSERT`/`UPDATE`/`DELETE`).
* **Invariants:** Triggers execute implicitly inside the transactional execution bounds of the modifying command, making long-running trigger tasks block client response states.

### 4. Transaction Management & ACID (Medium)
* **Concepts:** Atomicity (All or nothing via undo logs), Consistency (State constraints compliance), Isolation (Lock visibility barriers), Durability (Write-Ahead Logging / WAL commits to non-volatile disks); Transaction states (`Active`, `Partially Committed`, `Committed`, `Failed`, `Aborted`).
* **Invariants:** Committing a transaction ensures data durability by guaranteeing that changes are written to the Write-Ahead Log on disk before the database states are altered in memory.

## High-Yield Reference Questions
* **LeetCode 185:** Department Top Three Salaries (Advanced Window Function application checking handling of rank gaps).
* **Concurrency Trade-offs:** Explain the structural mechanics of Write-Ahead Logging (WAL) and details how the database engine runs a recovery loop to re-apply changes if the server container crashes mid-transaction.

---

# Module 3: NoSQL & Distributed Database Design

## Core Paradigms & Structural Invariants
* **Horizontal Scaling Partitioning:** Distributing massive transactional read/write workloads across a cluster of independent server nodes instead of upgrading a single machine's hardware.
* **Schema on Read vs. Schema on Write:** Shifting structural layout enforcement from the storage engine validation phase (Relational) straight to the application logic layer (NoSQL).

## Sub-Topics & Concepts
### 1. MongoDB Fundamentals (Medium)
* **Concepts:** BSON document structures, ObjectIDs structure, embedded sub-documents vs. normalized DBRefs pointers; indexing layouts over nested arrays.
* **Invariants:** Embedding data minimizes network overhead by fetching related records in a single read step, but it is constrained by MongoDB's strict 16MB document size limit.

### 2. Sharding & Replication (Hard)
* **Concepts:** Replica Sets (Primary-Secondary replication loops), automated failover elections; Sharding mechanisms (Range-based, Hash-based, Tag-based routing), Shard Key selection, Shard Router (`mongos`).
* **Invariants:** Poor shard key selection can lead to hot-spotting, where a single node processes the entire application workload while the rest of the cluster sits idle.

### 3. CAP Theorem (Medium)
* **Concepts:** Consistency (All nodes see same data simultaneously), Availability (Every non-failing node returns a response), Partition Tolerance (System operates despite network link drops).
* **Invariants:** In the event of an active network partition, a distributed system must explicitly choose between Consistency (CP, rejecting requests to avoid dirty reads) or Availability (AP, serving stale local data).

### 4. Document Databases vs. Relational (Medium)
* **Concepts:** Denormalized star configurations vs. 3NF entity tables; scaling profiles; ACID support comparisons.
* **Invariants:** Relational models prioritize strong global data consistency and precise schema controls, whereas NoSQL architectures prioritize high horizontal write throughput and dynamic schema flexibility.

## High-Yield Reference Questions
* **System Design Classic:** Design an enterprise logging system that processes billions of active events per day. Select the optimal storage backend (Relational vs NoSQL) and defend your choice using the CAP theorem.
* **Distributed Failures:** What is a "Split-Brain" scenario in a replica set during a network partition, and how does consensus voting prevent multiple nodes from claiming the Primary role simultaneously?

---

# Module 4: Query Optimization & Concurrency Control

## Core Paradigms & Structural Invariants
* **The Serializability Metric:** Ensuring that executing multiple transactions concurrently produces the exact same database state as running them one after another in a strict, non-overlapping sequence.
* **Cost-Based Optimization (CBO):** Evaluating query execution vectors based on table statistics, disk I/O metrics, and index cardinalities to find the cheapest execution path.

## Sub-Topics & Concepts
### 1. Query Execution Plans (Medium)
* **Concepts:** Cost estimation formulas, parsing outputs (`EXPLAIN ANALYZE` readouts); execution strategies: Index Scan vs. Index Seek, Nested Loop Join vs. Hash Join vs. Merge Join.
* **Invariants:** Hash Joins build an in-memory hash table out of the smaller input table to match records from the larger table, making them highly efficient for large, un-indexed datasets.

### 2. Locking & Concurrency Control (Hard)
* **Concepts:** Shared Locks (`S`), Exclusive Locks (`X`), Intent Locks (`IS`, `IX`); Granularity levels (Row, Page, Table locks); Two-Phase Locking Protocol (2PL - Growing phase vs. Shrinking phase), Strict 2PL; Deadlock Detection (Wait-For Graphs) and Deadlock Prevention (Wait-Die vs. Wound-Wait schemas).
* **Invariants:** Basic 2PL guarantees serializability but can still allow cascading rollbacks; Strict 2PL prevents cascading rollbacks by holding all exclusive locks until the transaction fully commits.

### 3. MVCC - Multi-Version Concurrency Control (Hard)
* **Concepts:** Snapshot Isolation, transaction visibility timestamps ($T_{\text{start}}$, $T_{\text{commit}}$); pointer chains linking to historical row variations in undo logs (`rollback segments`); ghost record garbage collection.
* **Invariants:** MVCC ensures that readers never block writers and writers never block readers by serving historical snapshots to read queries while active writes modify new versions concurrently.

### 4. Database Scaling Techniques (Medium)
* **Concepts:** Read Replicas (offloading read operations), CQRS architectural patterns; Database Connection Pooling; Vertical Partitioning (slicing columns) vs. Horizontal Partitioning (slicing rows/tables).
* **Invariants:** Read replicas expand read capacity horizontally, but introduce eventual consistency windows due to replication lag from the primary write node.

## High-Yield Reference Questions
* **Transaction Deep-Dive:** Walk through the 4 standard ANSI SQL isolation levels (`Read Uncommitted`, `Read Committed`, `Repeatable Read`, `Serializable`). Explain the exact lock configurations or MVCC visibility rules required to eliminate dirty reads, non-repeatable reads, and phantom reads.
* **Performance Analysis:** You spot a slow-running query in production that uses multiple nested loops. Explain how you would interpret its `EXPLAIN` plan, check for stale table statistics, and resolve the bottleneck using an index or query refactor.