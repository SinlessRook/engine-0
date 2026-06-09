---
track: Software Engineering Placement 2026
course: Object-Oriented Programming
total_modules: 4
status: Active
---

# Module 1: Core OOP Concepts

## Core Paradigms & Structural Invariants
* **Data Abstraction:** Separating an object's essential behavioral contract from its underlying implementation details to reduce cognitive load and limit ripple effects during refactoring.
* **The Blueprint Contract:** A Class defines an immutable structural layout and a virtual method table in memory, whereas an Object represents a concrete, mutable instance allocated on the system heap.
* **The Substitution Principle:** Subclasses must extend superclasses in a way that allows them to be passed into methods expecting the base type without breaking application stability.

## Sub-Topics & Concepts
### 1. Classes & Objects (Easy)
* **Concepts:** Heap vs. Stack allocation footprints; constructor chaining execution sequences; object lifecycle events; destructors and garbage collection tracking hooks.
* **Invariants:** Class variables (static fields) are loaded exactly once into the application's global metadata/method memory area, whereas instance variables are newly allocated every time an object is instantiated via the `new` keyword.

### 2. Encapsulation & Access Modifiers (Easy)
* **Concepts:** Data hiding principles; Access Levels (`private`, `protected`, `public`, `default`/`package-private`); designing immutable state modifications via explicit mutators and accessors (getters/setters).
* **Invariants:** Fields should be declared with the most restrictive access modifier possible to isolate an object's internal state and prevent external components from creating invalid object properties.

### 3. Inheritance & Polymorphism (Medium)
* **Concepts:** Single vs. Hierarchical object classification models; Runtime (Dynamic) Polymorphism vs. Compile-time (Static) Polymorphism; Base-type pointer casting up and down class hierarchies.
* **Invariants:** Runtime polymorphism relies on dynamic dispatch, parsing the object's actual heap type at execution time rather than the static pointer type defined in the source code.

### 4. Method Overloading & Overriding (Medium)
* **Concepts:** Signature rules (method name + parameter type list); static method early binding vs. instance method late binding; utilizing language override annotations to catch compilation errors.
* **Invariants:** Overloading is resolved entirely at compile-time based on static method signatures, whereas overriding handles behavioral selection dynamically at runtime using an object's Virtual Method Table (VMT).

## High-Yield Reference Questions
* **System Simulation:** Model an payroll administration application system. Apply proper encapsulation controls and access modifiers to protect private salary parameters from unauthorized, arbitrary modifications.
* **Memory Analysis:** Sketch the step-by-step memory changes across the System Stack and JVM/V8 Heap when a subclass constructor executes, highlighting how parent fields are initialized before child parameters are mapped.

---

# Module 2: Advanced Inheritance & Structural Composition

## Core Paradigms & Structural Invariants
* **The "Is-A" vs. "Has-A" Dichotomy:** Preferring loose composition over rigid inheritance hierarchies to build adaptable, maintainable codebases.
* **Interface Abstraction Layers:** Decoupling software components entirely by coding to abstract behavioral contracts rather than concrete implementation definitions.

## Sub-Topics & Concepts
### 1. Abstract Classes & Interfaces (Medium)
* **Concepts:** Partial implementation skeletons vs. pure behavioral specifications; interface default/static methods; multiple interface compliance vs. single class inheritance restrictions.
* **Invariants:** Abstract classes can hold stateful instance variables and private fields, whereas Interfaces are stateless structures whose variables are implicitly declared as public, static, and final.

### 2. Multiple Inheritance & The Diamond Problem (Medium)
* **Concepts:** Ambiguous method resolution paths in multiple inheritance hierarchies; virtual base inheritance overrides; how interfaces resolve conflict resolution rules using language-specific dispatch paths.
* **Invariants:** The diamond problem occurs when a subclass inherits two parent classes that implement the same method signature from a shared grandparent class, causing a compilation or runtime collision.

### 3. Super & This Keywords (Easy)
* **Concepts:** Local execution contexts (`this`) vs. parent structural wrappers (`super`); explicit constructor redirection loops within the same class (`this()`) or up to the base class constructor (`super()`).
* **Invariants:** Calls to `super()` or `this()` inside a constructor must occupy the very first line of execution to guarantee an orderly, predictable object allocation sequence.

### 4. Composition vs. Inheritance (Medium)
* **Concepts:** Tight structural coupling (Inheritance) vs. loose component wiring (Composition); runtime behavior swapping; avoiding deep class inheritance explosion traps.
* **Invariants:** Inheritance breaks encapsulation boundaries by exposing parent class internals to subclasses, while composition enforces encapsulation by interacting with components solely through their public interfaces.

## High-Yield Reference Questions
* **Architectural Refactoring:** Take a deep, broken geometric rendering application that is trapped in a complex multi-level inheritance tree and refactor its modules to use a clean, strategy-based composition layout.
* **Language Internals:** Explain how languages like C++ use virtual tables (`vtables`) to resolve method conflicts in multiple inheritance scenarios, and contrast this with how Java uses interfaces to avoid the Diamond Problem entirely.

---

# Module 3: Object-Oriented Design Principles

## Core Paradigms & Structural Invariants
* **The Clean Code Metrics:** Maximizing Cohesion (keeping a module highly focused on a single task) while minimizing Coupling (reducing structural dependencies between independent modules).
* **Defensive Architecture:** Designing components that protect their internal state from outside interference through immutability and precise access controls.

## Sub-Topics & Concepts
### 1. SOLID Principles (Medium)
* **Concepts:** Single Responsibility (SRP), Open-Closed (OCP), Liskov Substitution (LSP), Interface Segregation (ISP), and Dependency Inversion (DIP).
* **Invariants:** OCP mandates that software components should be open for extension (adding new behaviors via polymorphism) but closed for modification (preventing edits to tested production source code).

### 2. DRY & KISS (Easy)
* **Concepts:** Don't Repeat Yourself (abstracting duplicate execution paths into centralized helpers) and Keep It Simple, Stupid (avoiding premature optimization and over-engineered abstractions).
* **Invariants:** Over-abstracting code to satisfy DRY can inadvertently introduce tight coupling, requiring you to balance duplication cleanup against the KISS principle's focus on readability and simplicity.

### 3. Coupling & Cohesion (Medium)
* **Concepts:** Content, Common, and Control coupling dependencies; Functional vs. Coincidental cohesion categorization; patterns for building loosely coupled messaging loops.
* **Invariants:** High internal cohesion ensures that a class contains only fields and methods directly related to its core purpose, making it easier to test, maintain, and reuse.

### 4. Immutability & Immutable Objects (Medium)
* **Concepts:** Design rules for immutable classes (declaring classes as `final`, making fields `private final`, performing deep defensive copying inside constructors and getters).
* **Invariants:** True immutable objects can be safely shared across concurrent execution threads without requiring explicit synchronization synchronization wrappers or thread locks.

## High-Yield Reference Questions
* **Code Review Challenge:** Analyze a provided notification service class code snippet. Identify specific violations of the Liskov Substitution Principle (LSP) and the Single Responsibility Principle (SRP), and write a refactored version that resolves them.
* **Design Validation:** Explain the architectural difference between a deep copy and a shallow copy. Detail how failing to perform a deep copy inside an immutable object's constructor can break its data integrity contract.

---

# Module 4: Design Patterns & Anti-Patterns

## Core Paradigms & Structural Invariants
* **Creational Patterns:** Standardizing and isolating the complex allocation steps needed to instantiate objects.
* **Structural Patterns:** Grouping disparate classes and components into larger, highly flexible structural blueprints.
* **Behaviorable Patterns:** Organizing and optimizing the data transit and execution responsibilities between interacting objects.

## Sub-Topics & Concepts
### 1. Creational Patterns (Singleton, Factory, Builder) (Medium)
* **Concepts:** Thread-safe Singleton locks (Double-Checked Locking); Abstract Factory decoupling layers; step-by-step variable validation configurations using the Builder pattern.
* **Invariants:** The Builder pattern isolates complex multi-parameter object validation steps, returning a fully validated, immutable instance only during the final `.build()` execution call.

### 2. Structural Patterns (Adapter, Decorator, Proxy) (Medium)
* **Concepts:** Interface bridging (Adapter); runtime behavioral additions via wrapped structural chains (Decorator); access control and lazy-loading validation layers (Proxy).
* **Invariants:** The Decorator pattern dynamically adds responsibilities to an object at runtime by wrapping it in matching interface types, providing a flexible alternative to subclass inheritance.

### 3. Behavioral Patterns (Observer, Strategy, State) (Hard)
* **Concepts:** One-to-many publish-subscribe notification loops (Observer); runtime algorithm swapping (Strategy); encapsulate phase variations into independent behavioral objects (State).
* **Invariants:** The State pattern allows an object to change its behavior when its internal state shifts, making it appear as if the object dynamically swapped its entire class type at runtime.

### 4. Anti-Patterns to Avoid (Easy)
* **Concepts:** The God Object (monolithic classes absorbing all application logic); Spaghetti Code (tangled dependencies); Golden Hammer (forcing a single familiar tool onto every design challenge); Premature Optimization.
* **Invariants:** Mitigating the God Object anti-pattern requires breaking down its clustered responsibilities into independent, highly cohesive classes that interact through clean abstractions.

## High-Yield Reference Questions
* **System Design / Interview Classic:** Implement an item checkout billing pipeline using the Strategy pattern to handle dynamic, changing tax evaluations (e.g., VAT, US State Tax, Holiday Discounts) without altering the main checkout execution loop.
* **Pattern Comparison:** Contrast the Proxy pattern against the Decorator pattern. Even though their structural class diagrams look identical (both wrap a target interface component), explain how their architectural intents and lifecycle controls differ completely.