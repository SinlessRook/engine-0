---
track: Software Engineering Placement 2026
course: Advanced Algorithm Design
total_modules: 4
status: Active
---

# Module 1: Divide and Conquer

## Core Paradigms & Mathematical Invariants
* **Master Theorem Recurrence Shapes:** $T(n) = aT(n/b) + f(n)$ evaluation profiles.
* **Divide:** Splitting the spatial domain or index array bounds into symmetric or asymmetric sub-problems.
* **Conquer:** Recursive solution convergence and post-split linear/logarithmic combination overhead calculations.

## Sub-Topics & Concepts
### 1. Merge Sort (Medium)
* **Concepts:** Two-pointer array merging strategy, stable sorting validation, extra auxiliary space complexity requirements.
* **Invariants:** Space complexity is $O(n)$; time complexity is strictly $\Theta(n \log n)$ in all cases.

### 2. Quick Sort (Medium)
* **Concepts:** Partitioning schema (Lomuto vs. Hoare), pivot selection vulnerabilities, randomized quicksort execution patterns.
* **Invariants:** Worst-case recursion degradation to $O(n^2)$ when arrays are already sorted or pivot choices are highly skewed.

### 3. Count Inversions (Hard)
* **Concepts:** Modified Merge Sort combination step, mapping tracking pairs where $i < j$ and $A[i] > A[j]$.
* **Invariants:** Piggybacks on the stable merge step to log split inversions in $O(n \log n)$ runtime instead of brute-force $O(n^2)$.

### 4. Closest Pair of Points (Hard)
* **Concepts:** 2D Cartesian divide-and-conquer strategy, mid-line delta ($\delta$) strip sorting, checking a constant bounded window of 7 adjacent points.
* **Invariants:** Reduces spatial geometric distance checks from a naive combinations loop to an optimized $O(n \log n)$ execution.

## High-Yield Reference Questions
* **LeetCode 912:** Sort an Array (Strict runtime bounds verification)
* **LeetCode 315:** Count of Smaller Numbers After Self (Advanced inversion variants)
* **Standard Placement Classic:** Find the closest pair of geometric coordinates in a defined 2D plane spatial block.

---

# Module 2: Greedy Algorithms

## Core Paradigms & Mathematical Invariants
* **Greedy Choice Property:** Constructing a globally optimal solution by making locally optimal choices at each sequential step.
* **Optimal Substructure:** An optimal solution to the overarching problem contains within it the optimal solutions to all nested sub-problems.
* **Matroid Theory Foundations:** Ensuring greedy proof correctness using exchange arguments and staying clear of local minima traps.

## Sub-Topics & Concepts
### 1. Activity Selection / Interval Scheduling (Easy)
* **Concepts:** Sorting jobs strictly by earliest finish times ($f_i$), maximizing mutual non-overlapping intervals.
* **Invariants:** Sorting by duration, start time, or value yields suboptimal edge-case failures.

### 2. Huffman Coding (Medium)
* **Concepts:** Prefix-free binary tree assembly, frequency-based prioritization, variable-length optimal character map bit-allocation.
* **Invariants:** Greedy selection joins the two lowest-frequency nodes at each parent branch level.

### 3. Fractional Knapsack (Easy)
* **Concepts:** Value-to-weight density ratios ($v_i / w_i$), sorting in descending order, partial item slicing allocation.
* **Invariants:** Does not generalize to the strict binary (0/1) Knapsack problem due to integer combinatorial lock boundaries.

### 4. Job Sequencing with Deadlines (Medium)
* **Concepts:** Deadline allocation matrix slots, maximizing point-in-time value, back-tracking array indexes to schedule high-yield items late.
* **Invariants:** Worst-case program array bounds map to $O(n^2)$ using array allocations, reducible using Disjoint Set Union (DSU).

## High-Yield Reference Questions
* **LeetCode 435:** Non-overlapping Intervals
* **LeetCode 1717:** Maximum Score From Removing Substrings
* **Standard Placement Classic:** Implement Huffman compression encoding schemas given raw text frequency tables.

---

# Module 3: Backtracking

## Core Paradigms & Mathematical Invariants
* **State-Space Tree Traversal:** Depth-First Search (DFS) modification across explicit combinatoric possibilities.
* **Pruning Conditions:** Evaluating constraint bounding parameters at the current path depth to abandon dead branches before descending.
* **Call Stack Telemetry:** Managing memory footprints on implicit system recursion structures.

## Sub-Topics & Concepts
### 1. N-Queens Problem (Hard)
* **Concepts:** Matrix rows, columns, and diagonal constraint hashing ($r+c$ and $r-c$), safe geometric position validations.
* **Invariants:** Spatial state pruning drops the combinatorial complexity significantly below the baseline $O(N!)$ space barrier.

### 2. Permutations (Medium)
* **Concepts:** Swap-based elements permutation loops, array tracking tracking indices, backtracking rollback states.
* **Invariants:** Generates exactly $n!$ unique paths; requires distinct boolean state arrays or sorting to prune duplicate inputs.

### 3. Subsets / Power Set Generation (Medium)
* **Concepts:** Cascading pick/don't-pick binary decision paths, bitmask mapping states ($0$ to $2^n - 1$).
* **Invariants:** Power set cardinality matches a strict mathematical upper bound of exactly $2^n$ distinct structures.

### 4. Word Search (Medium)
* **Concepts:** 2D grid matrix lookups, 4-directional or 8-directional recursive matrix searches, temporary byte masking to prevent reuse.
* **Invariants:** Memory constraints match recursive call bounds corresponding to string literal length constraints.

## High-Yield Reference Questions
* **LeetCode 51:** N-Queens (State array pruning validation)
* **LeetCode 46:** Permutations
* **LeetCode 78:** Subsets
* **LeetCode 79:** Word Search

---

# Module 4: Advanced Graph Algorithms

## Core Paradigms & Mathematical Invariants
* **Graph Topology Representations:** Adjacency lists vs. dense cost matrices.
* **Relaxation Principle:** Continually updating the upper bounds of shortest path paths until optimal convergence matches the actual distance.
* **Cycle Limitations:** Detecting system behaviors when tracking positive vs. negative cost routing paths.

## Sub-Topics & Concepts
### 1. Dijkstra's Algorithm (Medium)
* **Concepts:** Priority Queue (Min-Heap) optimization, single-source shortest path tracking, greedy vertex selection.
* **Invariants:** Time complexity drops to $O((V + E) \log V)$ with heaps; completely fails or enters infinite loops on graphs with negative edge weights.

### 2. Floyd-Warshall Algorithm (Medium)
* **Concepts:** All-pairs shortest path calculations, dynamic programming matrix state transitions ($A[i][j] = \min(A[i][j], A[i][k] + A[k][j])$).
* **Invariants:** Relies on a strict 3-nested loop structure running in $O(V^3)$ time and $O(V^2)$ auxiliary memory space.

### 3. Bellman-Ford Algorithm (Medium)
* **Concepts:** Structural edge relaxation loops running exactly $V-1$ times, checking for negative cost loop structures on the final $V$-th cycle.
* **Invariants:** Safely resolves graphs with negative weights in $O(V \cdot E)$ time; flags infinite deduction structures cleanly.

### 4. Topological Sort (Medium)
* **Concepts:** Directed Acyclic Graphs (DAG) mapping sequences, Kahn’s Algorithm (In-degree array queues), DFS-based tracking stacks.
* **Invariants:** Fails immediately if the graph topology contains a closed feedback loop or circular dependencies.

## High-Yield Reference Questions
* **LeetCode 743:** Network Delay Time (Standard Dijkstra prioritization check)
* **LeetCode 1334:** Find the City With the Smallest Number of Neighbors at a Threshold Distance (Floyd-Warshall variant)
* **LeetCode 207:** Course Schedule (Topological sort cycle detection)