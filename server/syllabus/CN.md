---
track: Software Engineering Placement 2026
course: Computer Networks
total_modules: 4
status: Active
---

# Module 1: OSI Model & TCP/IP

## Core Paradigms & Protocol Invariants
* **Data Encapsulation Flow:** Application Data $\rightarrow$ Segment (L4) $\rightarrow$ Packet (L3) $\rightarrow$ Frame (L2) $\rightarrow$ Bits (L1).
* **Multiplexing & Demultiplexing:** Port numbers route traffic within the Transport Layer, while IP protocol fields route traffic down to the Network Layer.
* **Network Transparency:** Each protocol layer must function independently, treating the lower layer purely as an abstract transport container.

## Sub-Topics & Concepts
### 1. OSI Model Layers
* **Concepts:** 7-layer theoretical abstraction vs. 4-layer practical TCP/IP suite; specific hardware mappings (Routers at L3, Switches at L2, Hubs/Repeaters at L1).
* **Invariants:** Peer-to-peer communication across hosts is logically horizontal, but actual physical data traversal is strictly vertical down the stack, across the medium, and up the destination stack.

### 2. TCP vs UDP
* **Concepts:** Connection-oriented vs. connectionless transport; byte-stream delivery vs. independent datagram boundaries; TCP header complexity (minimum 20 bytes) vs. UDP lean profile (8 bytes).
* **Invariants:** TCP guarantees strict ordering, error checking, and flow control at the cost of latency; UDP prioritizes real-time speed, pushing handling of packet loss entirely onto the Application layer.

### 3. TCP 3-Way Handshake & Connection Teardown
* **Concepts:** Synchronization (`SYN`), Synchronize-Acknowledge (`SYN-ACK`), and Acknowledgment (`ACK`) state transitions; Initial Sequence Number (ISN) negotiation; `FIN-ACK` connection tear-down phases; `TIME_WAIT` socket retention states.
* **Invariants:** The initiator must pass through a strict `SYN_SENT` $\rightarrow$ `ESTABLISHED` state loop, while the receiver transitions from `LISTEN` $\rightarrow$ `SYN_RCVD` $\rightarrow$ `ESTABLISHED`.

### 4. Socket Programming Basics
* **Concepts:** POSIX socket primitives (`socket()`, `bind()`, `listen()`, `accept()`, `connect()`, `send()`, `recv()`); blocking vs. non-blocking I/O multiplexing (`select()`, `poll()`, `epoll()`); concurrent server architectures.
* **Invariants:** A server socket binds to a local IP and port to listen for requests, but the client connection returns a completely new, distinct file descriptor socket to handle active data exchanges.

---

# Module 2: IP Addressing & Routing

## Core Paradigms & Protocol Invariants
* **Hop-by-Hop Forwarding:** Routers look at the Destination IP header to determine the next network node, while modifying the underlying Link Layer MAC addresses at every physical hop.
* **Longest Prefix Match:** When checking a local routing table, the system must route packets using the rule that matches the highest number of leading bits in the subnet mask.

## Sub-Topics & Concepts
### 1. IPv4 Addressing & Subnetting
* **Concepts:** 32-bit logical address spaces; Classful vs. Classless network ranges; Network IDs vs. Host IDs; calculating exact valid host counts ($2^{32-n} - 2$, accounting for the subnet network prefix and the broadcast address).
* **Invariants:** The first address in any subnet block identifies the network itself, while the very last address acts as the dedicated broadcast address for that local collision domain.

### 2. CIDR Notation
* **Concepts:** Classless Inter-Domain Routing; variable-length subnet masking (VLSM); IP allocation aggregation blocks (e.g., `/24` vs `/22`); bitwise AND masks used to isolate destination networks instantly.
* **Invariants:** Smaller prefix integers indicate broader networks containing more host nodes, while higher prefix boundaries signify smaller, isolated subnets.

### 3. Routing Protocols (BGP, OSPF)
* **Concepts:** Interior Gateway Protocols (IGP) vs. Exterior Gateway Protocols (EGP); Distance Vector vs. Link-State algorithms; Dijkstra convergence in OSPF; Path Vector mechanics and Autonomous System (AS) hops in BGP.
* **Invariants:** OSPF focuses on maximizing local metric speed within a single network ecosystem, whereas BGP manages global internet routing based on administrative policies and geographic path steps.

### 4. NAT & Port Forwarding
* **Concepts:** Static, Dynamic, and Overloaded Network Address Translation (PAT); recycling single public IP pools across vast private networks using dynamic port mapping tables.
* **Invariants:** NAT modifies and re-maps IP and port headers on the fly, breaking strict end-to-peer IP trace visibility across the global web.

---

# Module 3: Application Layer Protocols

## Core Paradigms & Protocol Invariants
* **Request-Response & State Patterns:** Managing how application data handles application context (e.g., stateless protocols like HTTP vs. stateful storage frameworks like FTP).
* **Human-Readable Text vs. Optimized Binary Streams:** Balancing the easy debugging of plain-text headers against the high throughput and low parsing overhead of pure binary serialization models.

## Sub-Topics & Concepts
### 1. HTTP/HTTPS
* **Concepts:** HTTP/1.1 pipelining limitations (Head-of-Line blocking) vs. HTTP/2 multiplexed binary framing layers vs. HTTP/3 QUIC (UDP-based streams); idempotent vs. non-idempotent verbs; REST status code definitions.
* **Invariants:** HTTP is stateless at the transport layer; persistent session states must be simulated at the application layer using JWT tokens, cookies, or backend session caches.

### 2. DNS Query Resolution
* **Concepts:** Hierarchical lookup trees (Root Nameservers $\rightarrow$ TLD Nameservers $\rightarrow$ Authoritative Nameservers); Recursive vs. Iterative resolution modes; DNS record variants (`A`, `AAAA`, `CNAME`, `MX`, `TXT`); TTL cache settings.
* **Invariants:** Any DNS resolution loop will check the local machine's `/etc/hosts` file and system browser caches before sending a UDP request out to an external resolver.

### 3. SMTP & POP3/IMAP
* **Concepts:** Mail Transfer Agents (MTA) vs. Mail User Agents (MUA); text-based commands over SMTP; local message synchronization models (IMAP maintains centralized parity, while POP3 downloads and wipes remote storage).
* **Invariants:** SMTP handles outgoing mail transit between servers, whereas IMAP/POP3 deal exclusively with client retrieval from a specific mailbox storage file.

### 4. FTP & SFTP
* **Concepts:** Split-channel communication (FTP control channel on port 21, data channel on port 20); Active vs. Passive transport modes; SSH file transfer injection layers.
* **Invariants:** Traditional FTP passes credentials in unencrypted plain text, while SFTP wraps the entire control and data flow inside a single secure SSH connection block.

---

# Module 4: Network Security

## Core Paradigms & Protocol Invariants
* **The CIA Triad:** Securing transactions across open channels by guaranteeing Confidentiality (Encryption), Integrity (Hashing), and Availability (DDoS Protection).
* **Asymmetric to Symmetric Transition:** Leveraging expensive public-key cryptography solely to establish a shared key, then switching to fast symmetric encryption for ongoing data transfer.

## Sub-Topics & Concepts
### 1. SSL/TLS 1.2 & 1.3 Handshakes
* **Concepts:** Diffie-Hellman Key Exchange; Cipher Suite negotiation; Certificate Authority (CA) validation chains; Session Keys; TLS 1.3 1-RTT optimization vs. TLS 1.2 2-RTT overhead loops.
* **Invariants:** If the client cannot verify the CA's digital signature against its local trust store, the handshake aborts immediately before any session keys are generated.

### 2. Firewalls & Proxies
* **Concepts:** Packet Filtering (Stateless) vs. Stateful Inspection Firewalls; Forward Proxies (masking client identities) vs. Reverse Proxies (masking backend infrastructure layouts, handling load balancing and SSL termination).
* **Invariants:** Stateful firewalls keep track of active connection tables, meaning they can automatically allow returning traffic without needing explicit inbound rules.

### 3. VPN & Tunneling
* **Concepts:** IPSec vs. OpenVPN vs. WireGuard protocols; Encapsulating Security Payload (ESP) headers; Site-to-Site vs. Remote Access paths; Virtual Network Interface creation.
* **Invariants:** Tunneling wraps an encrypted packet completely inside a standard public transport packet header, hiding the original source and destination IPs from intermediate routers.

### 4. DDoS & Mitigation
* **Concepts:** Volumetric Attacks (DNS Amplification) vs. Protocol Attacks (SYN Floods exploiting connection queues) vs. Application Layer Attacks (HTTP Floods targeting database endpoints); Anycast routing; Rate Limiting; Scrubbing Centers.
* **Invariants:** Application layer attacks bypass standard firewall blocks because they look like legitimate HTTP traffic, requiring behavior-based anomaly detection to mitigate.