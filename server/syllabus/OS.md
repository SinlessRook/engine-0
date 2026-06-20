---
track: Software Engineering Placement 2026
course: Operating Systems
total_modules: 4
status: Active
---

# Module 1: Processes & Threads

## Core Paradigms & Hardware Invariants
* **The Process Abstraction:** An isolated execution environment with its own private address space, managed entirely via kernel-level Process Control Blocks (PCBs).
* **Concurrency vs. Parallelism:** Interleaving multiple tasks on a single processing core via rapid time-slicing vs. executing independent instructions simultaneously across multiple physical CPU cores.
* **Kernel vs. User Space:** The fundamental hardware boundary enforced by the CPU mode bit; system calls smoothly transition execution from User Mode (Ring 3) to Kernel Mode (Ring 0).

## Sub-Topics & Concepts
### 1. Process vs. Thread
* **Concepts:** Heavyweight processes vs. lightweight threads; shared memory segments (Code, Data, Files) vs. isolated per-thread resources (Stack, Registers, Program Counter); Thread Control Blocks (TCBs).
* **Invariants:** Thread-level crashes (e.g., a segmentation fault) corrupt shared memory and terminate the entire parent process, whereas process crashes are strictly contained by kernel boundaries.

### 2. Process Scheduling Algorithms
* **Concepts:** Non-preemptive vs. preemptive strategies; First-Come First-Served (FCFS), Shortest Job First (SJF), Round Robin (RR), and Multi-Level Feedback Queues (MLFQ); metrics like Turnaround Time, Waiting Time, and Response Time.
* **Invariants:** Round Robin scheduling prevents starvation by allocating fixed time slices (quanta), but its throughput depends heavily on minimizing context-switching overhead.

### 3. Context Switching
* **Concepts:** Saving the hardware state of an active process (registers, flags, stack pointers) to its PCB and loading a new state; Translation Lookaside Buffer (TLB) flushing penalties.
* **Invariants:** Context switching is pure computational overhead; during the transition, the CPU executes zero useful user-space instructions.

### 4. Thread Synchronization
* **Concepts:** Race conditions in shared memory blocks; the Critical Section problem and its three structural mandates (Mutual Exclusion, Progress, Bounded Waiting); Peterson's solution.
* **Invariants:** Thread synchronization primitives rely on atomic hardware assembly instructions (such as `Test-and-Set` or `Compare-and-Swap`) to prevent multi-threaded execution interleaving.

---

# Module 2: Memory Management

## Core Paradigms & Hardware Invariants
* **The Memory Abstraction:** Decoupling an application's logical address space from the computer's actual physical RAM layout.
* **Hardware Translation Layers:** The Memory Management Unit (MMU) intercepting logical CPU pointers and converting them to physical locations via high-speed lookups.

## Sub-Topics & Concepts
### 1. Virtual Memory & Paging
* **Concepts:** Slicing logical memory into fixed-size Pages and physical RAM into Frames; Page Tables and multi-level page table architectures; Translation Lookaside Buffers (TLB) serving as hardware caches; Page Fault handling loops.
* **Invariants:** Every virtual memory lookup requires a fast TLB check; a TLB miss forces a slow manual walk through multi-level page tables stored in main memory.

### 2. Page Replacement Algorithms
* **Concepts:** Managing restricted physical frames when a page fault occurs; First-In-First-Out (FIFO) and Belady's Anomaly; Optimal (OPT); Least Recently Used (LRU) approximations; Thrashing and the Working Set Model.
* **Invariants:** Thrashing occurs when a process's active working pages exceed available physical memory, forcing the OS to spend more time swapping blocks to disk than executing code.

### 3. Segmentation
* **Concepts:** Variable-length logical partitioning matching user-view architectural concepts (Code, Stack, Heap, Global variables); Segmentation Tables tracking base addresses and strict segment length limits.
* **Invariants:** Paging eliminates external memory fragmentation by utilizing uniform blocks, whereas segmentation can leave variable-sized gaps of unused RAM across the system heap.

### 4. Memory Allocation Strategies
* **Concepts:** Contiguous memory partitioning designs; First-Fit, Best-Fit, and Worst-Fit algorithms; Internal fragmentation (wasted space within a fixed block) vs. External fragmentation (scattered free space).
* **Invariants:** Best-Fit minimizes immediate internal fragmentation but can leave behind tiny, unusable memory gaps across the global allocation table.

---

# Module 3: Synchronization & Deadlocks

## Core Paradigms & Hardware Invariants
* **The Deadlock Trap:** A state where a set of processes are permanently blocked because each process holds a resource while waiting for another resource held by someone else in the same loop.
* **Atomic Isolation:** Enforcing predictable resource execution ordering across non-deterministic multi-threaded systems.

## Sub-Topics & Concepts
### 1. Semaphores & Mutexes
* **Concepts:** Binary Semaphores vs. Counting Semaphores; Mutex ownership rules; signaling primitives (`wait()` / `P` and `signal()` / `V`); Priority Inversion hazards and the Priority Inheritance Protocol.
* **Invariants:** A Mutex can only be unlocked by the specific thread that locked it, whereas a Semaphore can have its count incremented by any thread executing a signal command.

### 2. Deadlock Detection & Avoidance
* **Concepts:** The 4 Coffman conditions required for deadlocks to occur (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait); Resource Allocation Graphs (RAG); Safe vs. Unsafe system states.
* **Invariants:** Deadlock *prevention* actively breaks one of the 4 Coffman conditions, whereas deadlock *avoidance* monitors dynamic resource allocation requests to ensure the system stays in a safe state.

### 3. Reader-Writer Problem
* **Concepts:** Classic synchronization challenge balancing multiple concurrent readers against isolated writers; First variation (favoring readers, risking writer starvation) vs. Second variation (favoring writers, risking reader starvation).
* **Invariants:** Multiple reader threads can safely access shared resources simultaneously, but an active writer requires an exclusive lock that blocks all other threads.

### 4. Banker's Algorithm
* **Concepts:** Multi-resource deadlock avoidance for bounded allocation matrix tracking; modeling system metrics: `Available` vectors, `Max` demand matrices, `Allocation` matrices, and calculating the remaining `Need` matrices.
* **Invariants:** The Banker's Algorithm tests if allocating resources will land the system in an unsafe state; if no valid execution sequence exists to guarantee all processes can finish, the request is denied.

---

# Module 4: File Systems & I/O

## Core Paradigms & Hardware Invariants
* **The File Abstraction:** A logical collection of contiguous or non-contiguous records mapped by the operating system onto physical sectors of non-volatile storage.
* **I/O Communication Models:** Managing the massive speed gap between fast CPU execution loops and slow external hardware devices via Polling, Interrupts, and Direct Memory Access (DMA).

## Sub-Topics & Concepts
### 1. File Allocation Methods
* **Concepts:** Contiguous allocation (risks fragmentation) vs. Linked allocation (suffers from slow random access pointer chases) vs. Indexed allocation (UNIX Inodes utilizing direct, single-indirect, and double-indirect pointer configurations).
* **Invariants:** Indexed allocation stores block pointers in a centralized index block, providing fast random access without suffering from external fragmentation.

### 2. Disk Scheduling Algorithms
* **Concepts:** Minimizing mechanical head movement overhead on spinning hard drives; First-Come First-Served (FCFS), Shortest Seek Time First (SSTF), SCAN (Elevator Algorithm), and C-SCAN (Circular SCAN).
* **Invariants:** SSTF selects the request closest to the current head position to reduce seek times, but it can cause starvation for requests far away from the active sector track.

### 3. File Permissions & Access Control
* **Concepts:** UNIX permission ownership structures (User, Group, Others) mapped to bit-masks (`Read=4`, `Write=2`, `Execute=1`); Access Control Lists (ACLs) for granular user permissions.
* **Invariants:** The OS cross-references an open file command's Process User ID against the file's permission bitmask before assigning a valid file descriptor.

### 4. RAID Concepts
* **Concepts:** Redundant Array of Independent Disks; RAID 0 (Striping - high performance, zero redundancy), RAID 1 (Mirroring - high redundancy, high cost), RAID 5 (Block-level striping with distributed parity), and RAID 10 (A stripe of mirrors).
* **Invariants:** RAID 5 can survive the complete mechanical failure of a single drive in the array by calculating lost data on the fly using its distributed parity blocks.