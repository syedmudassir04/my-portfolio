/* ==========================================================================
   0. THEME TOGGLE (LIGHT/DARK MODE), LOGO SCROLL & TOUCH-ACCESSIBLE POPUPS
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const nextTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('portfolio_theme', nextTheme);
  applyTheme(nextTheme);
  if (typeof renderSandboxChart === 'function' && currentSandboxTab) {
    renderSandboxChart(currentSandboxTab);
  }
}

function applyTheme(theme) {
  const iconEl = document.getElementById('theme-toggle-icon');
  const labelEl = document.getElementById('theme-toggle-label');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    if (iconEl) iconEl.innerHTML = '&#9728;';
    if (labelEl) labelEl.textContent = 'Light';
  } else {
    document.documentElement.classList.remove('dark');
    if (iconEl) iconEl.innerHTML = '&#9789;';
    if (labelEl) labelEl.textContent = 'Dark';
  }
}

function scrollToTop(event) {
  if (event) event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, null, ' ');
}

function isTouchDevice() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function closeAllTouchPopups(exceptEl = null) {
  document.querySelectorAll('.node-group.touch-open').forEach((el) => {
    if (el !== exceptEl) el.classList.remove('touch-open');
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.node-group')) {
    closeAllTouchPopups();
  }
});

window.addEventListener('scroll', () => {
  closeAllTouchPopups();
}, { passive: true });

/**
 * Positions every .node-popup using fixed viewport coordinates (width: 320px)
 * and provides a full tap-toggle fallback on mobile & touchscreens.
 */
function bindDynamicPopup(triggerEl, options = {}) {
  const popup = triggerEl.querySelector('.node-popup');
  if (!popup) return;

  const updatePosition = () => {
    const triggerRect = triggerEl.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = popup.offsetHeight || 220;
    const navbarHeight = 74;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 12;

    const spaceAbove = triggerRect.top - navbarHeight;
    let topPos;
    if (spaceAbove < popupHeight + gap) {
      topPos = Math.min(triggerRect.bottom + gap, viewportHeight - popupHeight - 12);
    } else {
      topPos = Math.max(navbarHeight, triggerRect.top - popupHeight - gap);
    }

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let leftPos = triggerCenterX - popupWidth / 2;
    const edgeMargin = 12;

    if (leftPos < edgeMargin) leftPos = edgeMargin;
    if (leftPos + popupWidth > viewportWidth - edgeMargin) {
      leftPos = viewportWidth - popupWidth - edgeMargin;
    }

    popup.style.top = `${topPos}px`;
    popup.style.left = `${leftPos}px`;
  };

  triggerEl.addEventListener('mouseenter', updatePosition);

  // Touch accessibility handler (Image 2 fix)
  triggerEl.addEventListener('click', (e) => {
    if (isTouchDevice() && !options.alwaysTriggerClickOnTouch) {
      if (!triggerEl.classList.contains('touch-open')) {
        e.preventDefault();
        e.stopPropagation();
        closeAllTouchPopups(triggerEl);
        updatePosition();
        triggerEl.classList.add('touch-open');
      }
    }
  });
}

// Universal Deep-Dive Modal Controller
const inspectionModal = document.getElementById('inspection-modal');
const modalMeta = document.getElementById('modal-meta');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalBody = document.getElementById('modal-body');
const modalFooterCount = document.getElementById('modal-footer-count');
const modalExternalLink = document.getElementById('modal-external-link');

function openInspectionModal({ meta, title, subtitle, bodyHTML, footerText, externalUrl }) {
  closeAllTouchPopups();
  modalMeta.textContent = meta;
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
  modalBody.innerHTML = bodyHTML;
  modalFooterCount.textContent = footerText || 'Click any item row to expand its topics in depth';

  if (externalUrl) {
    modalExternalLink.href = externalUrl;
    modalExternalLink.classList.remove('hidden');
  } else {
    modalExternalLink.classList.add('hidden');
  }

  inspectionModal.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

function closeInspectionModal(event) {
  if (event && event.target !== inspectionModal) return;
  inspectionModal.classList.remove('modal-open');
  document.body.style.overflow = '';
}

function toggleTopicDrawer(drawerId) {
  const el = document.getElementById(drawerId);
  if (!el) return;
  el.classList.toggle('hidden');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeInspectionModal();
    closeAllTouchPopups();
  }
});


/* ==========================================================================
   1. WHO AM I ? -> MY TRAITS (7 Traits · STAR Format · Short Metadata Tags)
   ========================================================================== */
const myTraitsData = [
  {
    title: "Resilience",
    meta: "Adaptability",
    summary: "Sustaining analytical momentum through complex data obstacles.",
    star: {
      s: "Faced noisy, incomplete multi-source datasets and shifting schema requirements during project sprints.",
      t: "Needed to deliver clean, validated analytical pipelines without delaying downstream reporting.",
      a: "Iteratively refactored data-cleaning scripts, documented edge-case anomalies, and rebuilt broken ingestion steps.",
      r: "Delivered 100% schema-compliant tables on schedule while strengthening pipeline fault tolerance."
    }
  },
  {
    title: "Crisis Management",
    meta: "High Composure",
    summary: "Clear, methodical root-cause resolution under pressure.",
    star: {
      s: "Critical pipeline and integration failures surfaced shortly before stakeholder review checkpoints.",
      t: "Required immediate root-cause isolation and recovery without introducing hotfix regressions.",
      a: "Maintained calm composure, traced logs systematically across SQL and Python layers, and patched the bottleneck.",
      r: "Restored full pipeline operations ahead of the presentation window with zero data loss."
    }
  },
  {
    title: "Focus",
    meta: "Deep Execution",
    summary: "Unbroken concentration on complex architecture and logic.",
    star: {
      s: "Tasked with balancing simultaneous engineering coursework, certifications, and intensive data internships.",
      t: "Needed to maintain high code quality and deep analytical accuracy across every deliverable.",
      a: "Applied structured calendar timeboxing and eliminated context-switching during deep-work blocks.",
      r: "Graduated First Division in B.E. CSE while shipping production-grade internships and AI systems."
    }
  },
  {
    title: "Professionalism",
    meta: "Executive Standard",
    summary: "Structured communication, punctuality, and ownership.",
    star: {
      s: "Collaborated with senior leads and consulting stakeholders at APSS and Faalih Consulting Services.",
      t: "Expected to translate raw technical metrics into executive-ready reports and governed documentation.",
      a: "Standardized report templates, communicated progress proactively, and incorporated feedback systematically.",
      r: "Earned full stakeholder trust and sign-off across all governance dashboards and technical reports."
    }
  },
  {
    title: "Discretion",
    meta: "Data Confidentiality",
    summary: "Strict stewardship of sensitive clinical and enterprise records.",
    star: {
      s: "Worked with governed enterprise catalogs, role-based SQL schemas, and HL7 FHIR healthcare data standards.",
      t: "Had to ensure sensitive records and proprietary business logic remained strictly protected.",
      a: "Enforced DCL/RBAC permission sets, anonymized test payloads, and adhered to strict data governance protocols.",
      r: "Maintained zero privacy or access-control breaches across all academic and industry environments."
    }
  },
  {
    title: "Collaborator",
    meta: "Team Synergy",
    summary: "Frictionless alignment across engineering and business teams.",
    star: {
      s: "Cross-functional projects required syncing frontend web developers, data analysts, and domain leads.",
      t: "Needed to bridge technical gaps so API contracts, database schemas, and UI views stayed unified.",
      a: "Practiced active listening, shared reproducible Jupyter/Git documentation, and supported teammates during blockers.",
      r: "Accelerated team sprint velocity and delivered cohesive full-stack and analytics solutions."
    }
  },
  {
    title: "Ethics",
    meta: "Data Integrity",
    summary: "Uncompromising honesty in reporting, modeling, and governance.",
    star: {
      s: "Encountered skewed sample distributions and outlier biases during exploratory data analysis and ML modeling.",
      t: "Needed to ensure predictive models and BI charts reflected objective truth rather than vanity metrics.",
      a: "Applied rigorous statistical hypothesis testing, documented model limitations transparently, and audited training data.",
      r: "Produced trustworthy, bias-audited insights that enabled accurate, purpose-driven decisions."
    }
  }
];

function initTraitsGrid() {
  const container = document.getElementById('traits-grid');
  if (!container) return;
  container.innerHTML = '';

  myTraitsData.forEach((trait) => {
    const el = document.createElement('div');
    el.className = 'node-group relative pt-3 pb-2 border-t border-gray-100 cursor-pointer group hover:z-50';

    el.innerHTML = `
      <!-- FIXED-WIDTH STAR HOVER/TAP POPUP -->
      <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
        <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-gray-100">
          <h4 class="font-heading text-sm font-bold text-charcoal">${trait.title}</h4>
          <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${trait.meta}</span>
        </div>
        <div class="space-y-1.5 font-body text-xs text-ashGray leading-relaxed">
          <p><strong class="text-charcoal font-semibold">Situation:</strong> ${trait.star.s}</p>
          <p><strong class="text-charcoal font-semibold">Task:</strong> ${trait.star.t}</p>
          <p><strong class="text-charcoal font-semibold">Action:</strong> ${trait.star.a}</p>
          <p><strong class="text-trustBlue font-semibold">Result:</strong> ${trait.star.r}</p>
        </div>
      </div>

      <!-- VISIBLE TRAIT ITEM -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <h4 class="font-heading text-sm font-bold text-charcoal group-hover:text-trustBlue transition-colors">
            ${trait.title}
          </h4>
          <span class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-trustBlue transition-colors shrink-0"></span>
        </div>
        <p class="text-xs text-ashGray leading-relaxed">
          ${trait.summary}
        </p>
      </div>
    `;

    bindDynamicPopup(el);
    container.appendChild(el);
  });
}


/* ==========================================================================
   2. MY KNOWLEDGE (Unbundled Relevant Coursework · Courses & Verified Certificates)
   ========================================================================== */
const icseSubjectsArchive = [
  {
    meta: "ICSE · Computing Core",
    name: "Computer Applications (Java)",
    desc: "Core topics learnt: Object-Oriented Programming principles, Java syntax, class design, conditional control structures, arrays, string manipulation, and modular methods.",
    topics: ["Object-Oriented Programming Principles (Encapsulation, Inheritance, Polymorphism)", "Java Data Types, Operators, Wrapper Classes & Type Casting", "Control Structures, Nested Loops & Menu-Driven Programs", "Single & Double Dimensional Arrays (Bubble/Selection Sort, Linear/Binary Search)", "String Manipulation Methods, Constructors & User-Defined Functions"]
  },
  {
    meta: "ICSE · Quantitative Core",
    name: "Mathematics",
    desc: "Core topics learnt: Commercial arithmetic, linear and quadratic algebra, matrix operations, coordinate geometry, trigonometry, mensuration, descriptive statistics, and probability.",
    topics: ["Commercial Mathematics (GST, Banking, Shares & Dividends)", "Algebra (Quadratic Equations, Matrices, Arithmetic & Geometric Progressions)", "Coordinate Geometry (Reflection, Section Formula & Equation of a Line)", "Geometry (Similarity, Circles, Tangents & Loci)", "Trigonometric Identities, Heights & Distances & 3D Mensuration", "Statistics (Mean, Median, Ogive Curves) & Probability"]
  },
  {
    meta: "ICSE Paper 1 · Language",
    name: "English Grammar & Composition",
    desc: "Core topics learnt: Structural grammar transformation, formal business correspondence, précis writing, unseen comprehension analysis, and argumentative/descriptive essay composition.",
    topics: ["Descriptive, Narrative & Argumentative Composition", "Formal & Informal Business Letters & Notices", "Unseen Passage Comprehension & Summary / Précis Writing", "Sentence Transformation, Prepositions, Tenses & Synthesis", "Active/Passive Voice & Direct-to-Indirect Speech"]
  },
  {
    meta: "ICSE Paper 2 · Literature",
    name: "English Literature",
    desc: "Core topics learnt: Critical textual interpretation, thematic analysis, character psychology, and rhetorical evaluation across classic drama, anthology prose, and poetry.",
    topics: ["Shakespearean Drama Structure, Character & Theme Analysis", "Anthology Short Stories & Narrative Prose Analysis", "Lyric, Narrative & Metaphorical Poetry Interpretation", "Rhetorical Devices, Imagery & Contextual Critique"]
  },
  {
    meta: "ICSE · Second Language",
    name: "Hindi Language & Literature",
    desc: "Core topics learnt: Hindi Vyakaran (grammar syntax, idioms, sentence correction), formal correspondence (Patra Lekhan), essay composition, and Sahitya Sagar prose/poetry comprehension.",
    topics: ["Sahitya Sagar: Short Stories & Modern Hindi Prose", "Padya (Poetry) Interpretation & Themes", "Vyakaran: Muhavare (Idioms), Vilom, Paryayvachi & Vakya Shuddhi", "Formal Patra Lekhan (Letter Writing) & Nibandh (Essay Writing)"]
  },
  {
    meta: "ICSE · Regional Language",
    name: "Telugu Language & Comprehension",
    desc: "Core topics learnt: Telugu script fluency, Vyakaranam (Sandhulu, Samasamulu), formal letter writing, reading comprehension, and prose/poetry interpretation.",
    topics: ["Telugu Gadyam (Prose) & Padyam (Poetry)", "Sandhulu, Samasamulu & Alankaramulu (Grammar Foundations)", "Lekha Rachana (Letter Writing) & Comprehension Passages", "Regional Professional & Conversational Fluency"]
  }
];

const mpcSubjectsArchive = [
  {
    meta: "Maths 1A · TSBIE Intermediate",
    name: "Algebra, Vector Algebra & Trigonometry",
    desc: "Core topics learnt: Functional mappings, matrix determinants and Gauss-Jordan inversion, 3D vector dot/cross products, compound trigonometric angles, and hyperbolic functions.",
    topics: ["Functions, Domain/Range & Mathematical Induction", "Matrices, Determinants, Gauss-Jordan Inversion & Linear Equations", "Addition of Vectors, Scalar (Dot) & Vector (Cross) Products in 3D Space", "Trigonometric Ratios, Compound Angles & Inverse Trigonometric Functions", "Hyperbolic Functions & Properties of Triangles"]
  },
  {
    meta: "Maths 1B · TSBIE Intermediate",
    name: "Coordinate Geometry & Differential Calculus",
    desc: "Core topics learnt: 2D and 3D coordinate geometry, direction cosines and planes, limits, continuity, differentiation rules, tangents/normals, and maxima/minima optimization.",
    topics: ["Locus, Transformation of Axes & Straight Line Systems", "Pair of Straight Lines, 3D Coordinates, Direction Cosines & Planes", "Limits, Continuity & Differentiation Rules (Chain, Implicit, Logarithmic)", "Tangents & Normals, Rate Measure & Mean Value Theorems (Rolle's, Lagrange's)", "Increasing/Decreasing Functions & Maxima/Minima Optimization"]
  },
  {
    meta: "Maths 2A · TSBIE Intermediate",
    name: "Complex Numbers, Probability & Statistical Distributions",
    desc: "Core topics learnt: Complex number algebra, De Moivre's theorem, permutations and combinations, measures of dispersion (variance/standard deviation), Bayes' theorem, and Binomial/Poisson distributions.",
    topics: ["Complex Numbers, Argand Plane & De Moivre's Theorem", "Quadratic Expressions, Theory of Equations & Partial Fractions", "Permutations, Combinations & Binomial Theorem", "Measures of Dispersion (Variance & Standard Deviation)", "Probability Axioms, Conditional Probability & Bayes' Theorem", "Random Variables, Binomial & Poisson Probability Distributions"]
  },
  {
    meta: "Maths 2B · TSBIE Intermediate",
    name: "Conic Sections, Integral Calculus & Differential Equations",
    desc: "Core topics learnt: Analytical geometry of circles and conic sections (parabola, ellipse, hyperbola), indefinite/definite integration, area under curves, and first-order differential equations.",
    topics: ["Circles, System of Circles (Radical Axis & Orthogonality)", "Conic Sections: Parabola, Ellipse & Hyperbola Tangents/Normals", "Indefinite Integration (Substitution, Integration by Parts & Partial Fractions)", "Definite Integrals, Reduction Formulae & Area Under Curves", "First-Order Differential Equations (Variable Separable, Homogeneous & Linear)"]
  },
  {
    meta: "Arabic I & II · Second Language",
    name: "Arabic Language, Classical Grammar & Literary Texts",
    desc: "Core topics learnt: Arabic script orthography, syntax (Al-Nahw), morphology (Al-Sarf), nominal/verbal sentence construction, prose comprehension, and bilingual translation.",
    topics: ["Arabic Orthography, Phonetics & Sentence Construction (Jumla Ismiyyah & Fi'liyyah)", "Grammar (Al-Nahw & Al-Sarf): Nouns, Pronouns, Verb Conjugations & Prepositions", "Classical & Modern Prose Selections & Comprehension", "Bilingual Translation (Arabic-to-English & English-to-Arabic)"]
  },
  {
    meta: "English I & II · First Language",
    name: "Intermediate English, Analytical Writing & Data Interpretation",
    desc: "Core topics learnt: Translating visual charts/tables into analytical prose, CV drafting, formal correspondence, note-making, phonetic transcription, and structural grammar.",
    topics: ["Data Interpretation (Translating Pie Charts, Bar Graphs & Tables into Analytical Prose)", "Curriculum Vitae (CV) Drafting, Formal Correspondence & Note-Making", "Prose & Poetry Critical Comprehension", "Phonetic Transcription, Stress Patterns & Structural Grammar"]
  }
];

const cseSubjectsArchive = [
  {
    meta: "M1 · Sem I · 4 Credits",
    name: "Differential Calculus, Linear Algebra & Multivariable Calculus",
    desc: "Core topics learnt: Matrix rank, eigenvalues and eigenvectors, infinite series convergence, partial differentiation, Jacobians, multivariable optimization, and multiple integrals.",
    topics: ["Matrices, Rank, System of Linear Equations, Eigenvalues & Eigenvectors (Cayley-Hamilton)", "Sequence & Series Convergence Tests (Comparison, Ratio, Root, Alternating)", "Mean Value Theorems, Taylor's/Maclaurin's Series & Curvature", "Partial Differentiation, Jacobian, Maxima & Minima of Functions of Two Variables", "Double & Triple Integrals, Change of Order of Integration"]
  },
  {
    meta: "PPS · Sem I · 4 Credits (With Lab · Grade A)",
    name: "C Programming, Algorithmic Logic & Structured Problem Solving (& Lab)",
    desc: "Core topics learnt: Flowchart and pseudocode design, procedural C programming, arrays, modular functions, recursion, pointers, dynamic memory allocation, structures, and file I/O.",
    topics: ["Algorithms, Flowcharts, Pseudocode & C Compilation Pipeline", "Control Structures, Arrays, Strings & Modular Functions", "Recursion, Pointers, Pointer Arithmetic & Dynamic Memory (malloc/calloc/free)", "Structures, Unions, File Handling & Basic Sorting/Searching Algorithms"]
  },
  {
    meta: "M2 · Sem II · 4 Credits",
    name: "Differential Equations, Vector Calculus & Laplace Transforms",
    desc: "Core topics learnt: Ordinary and partial differential equations, Legendre/Bessel polynomials, vector gradient/divergence/curl, Green/Stokes/Gauss theorems, and Laplace transforms.",
    topics: ["First-Order & Higher-Order Linear Differential Equations", "Series Solutions, Legendre Polynomials & Bessel Functions", "Vector Differentiation (Gradient, Divergence, Curl) & Line/Surface/Volume Integrals", "Green's, Gauss Divergence & Stokes' Integral Theorems", "Laplace & Inverse Laplace Transforms"]
  },
  {
    meta: "English · Sem II · 3 Credits (With Lab · Grade A)",
    name: "Professional English Communication, Phonetics & Technical Vocabulary (& Lab)",
    desc: "Core topics learnt: Phonetic pronunciation, oral presentation fluency, technical vocabulary, reading comprehension, summarizing, formal email etiquette, and report writing.",
    topics: ["Phonetics, Intonation, Syllable Stress & Oral Fluency Lab", "Vocabulary Building (Roots, Prefixes, Synonyms, Technical Idioms)", "Reading Comprehension, Summarizing & Information Transfer", "Formal Email Etiquette, Report Structuring & Essay Composition"]
  },
  {
    meta: "DSA · Sem II · 4 Credits (With Lab · Grade A)",
    name: "Linear & Non-Linear Data Structures, Trees, Graphs & Hashing (& Lab)",
    desc: "Core topics learnt: Linked lists, stacks, queues, binary search trees, AVL and B-trees, heaps, hash tables, BFS/DFS graph traversals, shortest-path algorithms, and sorting complexity.",
    topics: ["Arrays, Sparse Matrices, Singly/Doubly/Circular Linked Lists", "Stacks & Queues (Infix-to-Postfix, Priority Queues, Deques)", "Binary Search Trees (BST), AVL Balanced Trees, B-Trees & Heaps", "Graph Representations, BFS, DFS, Minimum Spanning Trees (Prim's/Kruskal's) & Dijkstra", "Hashing Functions, Collision Resolution & Sorting (Quick, Merge, Radix, Heap)"]
  },
  {
    meta: "P&S · Sem III · 3BS305HS · 4 Credits",
    name: "Probability Distributions, Statistical Inference & Regression Analysis",
    desc: "Core topics learnt: Discrete and continuous probability distributions, skewness/kurtosis, Pearson and Spearman correlation, linear regression, and Z/t/F/Chi-Square hypothesis testing.",
    topics: ["Random Variables, Discrete (Binomial, Poisson) & Continuous (Normal, Exponential) Distributions", "Measures of Central Tendency, Skewness, Kurtosis & Moments", "Karl Pearson's Correlation, Spearman's Rank Correlation & Linear Regression", "Large Sample Tests (Z-test) & Small Sample Tests (Student's t-test, F-test, Chi-Square)"]
  },
  {
    meta: "STLD · Sem III · 3ES301EC · 3 Credits",
    name: "Boolean Algebra, Combinational & Sequential Digital Logic Design",
    desc: "Core topics learnt: Binary number systems, Boolean algebra, K-Map and Quine-McCluskey gate minimization, multiplexers/decoders, flip-flops, counters, and Mealy/Moore state machines.",
    topics: ["Number Systems, Binary Codes, Boolean Algebra & Logic Gates", "K-Map & Quine-McCluskey Tabular Minimization", "Combinational Circuits: Adders, Subtractors, Multiplexers, Demultiplexers, Encoders & Decoders", "Sequential Logic: Latches, SR/JK/D/T Flip-Flops, Shift Registers & Counters", "Mealy & Moore Finite State Machines & Programmable Logic Devices"]
  },
  {
    meta: "DBMS · Sem III · 3PC301CS & 3PC351CS · 4 Credits (Lab Grade A)",
    name: "Relational Database Architecture, SQL, Normalization & ACID Transactions (& Lab)",
    desc: "Core topics learnt: Entity-Relationship modeling, relational algebra, full-spectrum SQL (DDL, DML, DQL, DCL, TCL), views/triggers/procedures, 1NF–BCNF normalization, ACID locking, and B+ tree indexing.",
    topics: ["ER Modeling, Relational Algebra & Relational Calculus", "SQL: DDL, DML, DQL, DCL, TCL, Complex Joins, Subqueries, Views, Triggers & Stored Procedures", "Functional Dependencies & Schema Normalization (1NF, 2NF, 3NF, BCNF, 4NF)", "Transaction Processing, ACID Properties, Serializability & Two-Phase Locking (2PL)", "ARIES Crash Recovery, RAID Storage & B/B+ Tree File Indexing"]
  },
  {
    meta: "Discrete Maths · Sem III · 3PC302CS · 3 Credits",
    name: "Mathematical Logic, Set Theory, Combinatorics, Recurrence & Graph Theory",
    desc: "Core topics learnt: Propositional and predicate logic, rules of inference, equivalence relations, lattices, combinatorics, recurrence relations, algebraic groups, and Euler/Hamiltonian graph theory.",
    topics: ["Propositional & Predicate Logic, Truth Tables, Normal Forms & Rules of Inference", "Sets, Relations, Posets, Hasse Diagrams, Lattices & Boolean Algebra", "Combinatorics, Pigeonhole Principle, Generating Functions & Linear Recurrence Relations", "Algebraic Structures: Groups, Semigroups, Monoids & Homomorphisms", "Graph Theory: Isomorphism, Eulerian/Hamiltonian Paths, Planar Graphs & Graph Coloring"]
  },
  {
    meta: "CO&MP · Sem III · 3PC303CS & 3PC352CS · 4 Credits (Grade B)",
    name: "Computer Architecture, 8086 Microprocessor Assembly & Memory Hierarchy (& Lab)",
    desc: "Core topics learnt: CPU instruction cycles, 8086 microprocessor architecture, assembly language programming, ALU arithmetic, cache/virtual memory mapping, interrupts, DMA, and instruction pipelining.",
    topics: ["Basic Computer Organization, Instruction Cycle & Bus Architecture", "8086 Microprocessor Architecture, Register Organization & Addressing Modes", "8086 Assembly Language Programming (Arithmetic, Logical, String, Branch & Call Instructions)", "Computer Arithmetic & Memory Hierarchy (Cache Mapping, Virtual Memory)", "I/O Interfaces (8255 PPI, 8259 Interrupt Controller, DMA) & Instruction Pipelining"]
  },
  {
    meta: "Python Lab & SDC-I · Sem III · 3PC353CS & 3PW354CS · 3 Credits",
    name: "Python Programming Lab & Cisco Connected IoT Prototyping (Grade A)",
    desc: "Core topics learnt: Python data structures, list/dictionary comprehensions, object-oriented scripting, regular expressions, file handling, SQLite connectivity, and connected IoT sensor prototyping.",
    topics: ["Python Data Types, List/Dict Comprehensions, File I/O & Exception Handling", "Object-Oriented Python (Classes, Inheritance) & Regular Expressions", "GUI Programming with Tkinter & SQLite Database Connectivity", "Cisco Introduction to IoT: Actuators, Microcontrollers, Python Automation & Big Data Telemetry"]
  },
  {
    meta: "OPST · Sem IV · 3HS404HS · 3 Credits",
    name: "Linear Programming, Simplex, Transportation & Operations Research",
    desc: "Core topics learnt: Mathematical optimization, Linear Programming (Simplex/Big-M), transportation (MODI) and assignment (Hungarian) algorithms, job sequencing, queueing models, and dynamic programming.",
    topics: ["Linear Programming Formulation, Simplex, Big-M & Two-Phase Methods", "Duality Theory & Sensitivity Analysis", "Transportation Problems (NWCR, Least Cost, Vogel's Approximation & MODI Optimality)", "Assignment Problems (Hungarian Algorithm) & Travelling Salesman Problem", "Sequencing Models (Johnson's Rule), Queueing Theory & Bellman's Dynamic Programming"]
  },
  {
    meta: "Data Mining · Sem IV · 3PC404CS · 4 Credits",
    name: "Association Rules, Classification, Clustering & Pattern Discovery",
    desc: "Core topics learnt: Knowledge Discovery in Databases (KDD), data preprocessing, Apriori and FP-Growth association rule mining, Decision Tree/Naïve Bayes/SVM classification, and K-Means/DBSCAN clustering.",
    topics: ["Data Mining KDD Process, Data Cleaning, Normalization & Attribute Selection", "Association Rule Mining: Apriori Algorithm, FP-Growth Tree & Frequent Itemsets", "Classification: Decision Tree Induction, KNN, Naïve Bayes & SVM", "Cluster Analysis: K-Means, Agglomerative Hierarchical Clustering & DBSCAN", "Outlier Detection & Web/Spatial Data Mining"]
  },
  {
    meta: "OS · Sem IV · 3PC405CS & 3PC455CS · 4 Credits (With Lab)",
    name: "Kernel Architecture, Process Scheduling, Concurrency & Linux System Calls (& Lab)",
    desc: "Core topics learnt: Operating system kernels, Linux system calls (fork/exec), CPU scheduling algorithms, thread synchronization (semaphores/mutexes), Banker's deadlock avoidance, and virtual memory paging.",
    topics: ["OS Structures, System Calls (fork, exec, wait) & Process Control Blocks", "CPU Scheduling (FCFS, SJF, Priority, Round Robin) & Thread Concurrency", "Process Synchronization: Critical Section, Semaphores & Classic Concurrency Problems", "Deadlocks: Resource-Allocation Graphs, Banker's Algorithm, Detection & Recovery", "Memory Management: Paging, Segmentation, Page Replacement (LRU, Optimal) & Disk Scheduling"]
  },
  {
    meta: "CN · Sem IV · 3PC406CS & 3PC456CS · 4 Credits (With Lab)",
    name: "OSI/TCP-IP Stack, Packet Routing, Subnetting & Socket Programming (& Lab)",
    desc: "Core topics learnt: OSI and TCP/IP layered architectures, framing and CRC error detection, IPv4/IPv6 CIDR subnetting, OSPF/BGP packet routing, TCP flow/congestion control, and client-server socket programming.",
    topics: ["OSI & TCP/IP Reference Models & Data Link Framing", "Error Detection (CRC), Flow Control (Stop-and-Wait, Go-Back-N) & CSMA/CD", "Network Layer: IPv4/IPv6 Subnetting, CIDR, Distance Vector, Link State, OSPF, BGP & ARP", "Transport Layer: UDP, TCP 3-Way Handshake, Flow Control & Congestion Control", "Application Layer: DNS, HTTP, SMTP, FTP & C Socket Programming Lab"]
  },
  {
    meta: "Java Lab, HVPE & SDC-II · Sem IV · 3PC457CS, 3HS403HS & 3PW458CS · 4 Credits",
    name: "Object-Oriented Java Lab, Cisco CCNAv7 Routing & Professional Engineering Ethics",
    desc: "Core topics learnt: Java OOP, exception handling, multithreading, collections, and JDBC connectivity alongside Cisco IOS switch/router configuration and professional engineering ethics.",
    topics: ["Java OOP: Inheritance, Interfaces, Packages, Exception Handling & Multithreading", "Java Collections Framework (ArrayList, HashMap), File I/O & JDBC Database Connectivity", "Cisco CCNAv7 Module I: Switch/Router CLI Configuration, VLANs & Inter-VLAN Routing", "Human Values & Professional Ethics: Engineering Integrity & Workplace Responsibility"]
  },
  {
    meta: "AI · Sem V · 3PC507CS & 3PC559CS · 5 Credits (With Lab)",
    name: "Heuristic Search, Knowledge Representation, Bayesian Reasoning & AI Planning (& Lab)",
    desc: "Core topics learnt: Intelligent agent design, uninformed and heuristic search (A*, Minimax alpha-beta), first-order predicate logic inference, automated planning, and probabilistic Bayesian networks.",
    topics: ["Intelligent Agents, Uninformed Search (BFS, DFS) & Heuristic Search (A*, Hill Climbing)", "Adversarial Search: Minimax Algorithm & Alpha-Beta Pruning", "Knowledge Representation: Propositional & First-Order Predicate Logic, Unification & Resolution", "Classical Planning, Partial-Order Planning & Non-Monotonic Reasoning", "Uncertain Knowledge: Bayesian Networks, Dempster-Shafer Theory, Fuzzy Logic & Pandas/NumPy AI Lab"]
  },
  {
    meta: "DIP · Sem V · 3ES501CS & 3ES551CS · 4 Credits (With Lab)",
    name: "Spatial Filtering, Edge Detection, Segmentation, OpenCV & YOLOv8 Vision (& Lab)",
    desc: "Core topics learnt: Digital image matrix representation, histogram equalization, spatial/Fourier filtering, morphological operations, Canny/Otsu segmentation, and real-time OpenCV/YOLOv8 computer vision.",
    topics: ["Digital Image Fundamentals, Sampling, Quantization & Pixel Relationships", "Histogram Equalization, Spatial Filtering & 2D Fourier/Wavelet Transforms", "Image Restoration, Noise Filtering & Color Image Processing", "Morphological Operations & Image Segmentation (Sobel, Prewitt, Canny, Otsu)", "Image Compression & OpenCV / Ultralytics YOLOv8 Practical Vision Lab"]
  },
  {
    meta: "SE & PPL · Sem V · 3PC508CS & 3PE504CS · 6 Credits",
    name: "Agile & Waterfall SDLC, UML System Design & Principles of Programming Languages",
    desc: "Core topics learnt: Agile Scrum and Waterfall software lifecycles, SRS requirements engineering, UML architectural modeling, QA testing, BNF grammar syntax, static/dynamic scoping, and runtime memory management.",
    topics: ["Software Development Life Cycle (SDLC): Waterfall, Incremental, Spiral & Agile Scrum", "Requirements Engineering (SRS), UML Diagrams (Use Case, Class, Sequence) & Architecture", "Black-Box/White-Box Testing, Software Quality Assurance & Risk Management", "Programming Language Paradigms: Syntax (BNF), Static/Dynamic Scope, Type Checking & Activation Stack", "Abstract Data Types, Concurrency & Functional/Logic Programming"]
  },
  {
    meta: "Soft Skills Lab & SDC-III · Sem V · 3HS553HS & 3PW560CS · 2 Credits (Grade A)",
    name: "Executive Soft Skills Lab (Grade A) & Mobile Application Architecture (Grade A)",
    desc: "Core topics learnt: Active listening, structured oral presentations, reading comprehension, group discussions, interview etiquette, SWOT time management, and mobile OS/SQLite application architecture.",
    topics: ["Soft Skills Lab-I: Active Listening, Oral Presentations & Pecha Kucha Delivery", "Reading Comprehension (Skimming, Scanning, Paraphrasing), Group Discussions & Interview Skills", "Time Management, Goal Setting (SWOT) & High-Pressure Decision Making", "Skill Development Course-III: Mobile OS Architecture, UI Layouts, Services & SQLite Providers"]
  },
  {
    meta: "DAA · Sem VI · 3PC609CS · 3 Credits",
    name: "Asymptotic Complexity, Divide & Conquer, Dynamic Programming & Backtracking",
    desc: "Core topics learnt: Big-O asymptotic complexity, recurrence relations, Divide and Conquer, Greedy algorithms, Dynamic Programming, Backtracking, Branch and Bound, and NP-Completeness.",
    topics: ["Asymptotic Notation (Big-O, Omega, Theta), Recurrence Relations & Master Theorem", "Divide & Conquer (Merge Sort, Quick Sort, Strassen's Matrix Multiplication)", "Greedy Method (Knapsack, Job Sequencing, Huffman Coding, Prim's/Kruskal's, Dijkstra)", "Dynamic Programming (0/1 Knapsack, Matrix Chain Multiplication, All-Pairs Shortest Path, Optimal BST, TSP)", "Backtracking (N-Queens, Graph Coloring), Branch & Bound & NP-Hard/NP-Complete Classes"]
  },
  {
    meta: "ML · Sem VI · 3PC610CS & 3PC661CS · 4 Credits (With Lab)",
    name: "Supervised/Unsupervised Learning, Ensemble Trees, Neural Nets & ML Lab",
    desc: "Core topics learnt: Decision tree induction, Support Vector Machines, Bayesian classification, ensemble learning (Random Forest, Bagging, Boosting, XGBoost), PCA dimensionality reduction, and Scikit-Learn model validation.",
    topics: ["Concept Learning, Candidate Elimination & Decision Tree ID3 Algorithm", "Multi-Layer Perceptron (MLP), Backpropagation, Radial Basis Functions & SVM", "Bayesian Learning, Maximum Likelihood, Naïve Bayes, EM Algorithm & KNN", "Ensemble Learning (Bagging, Boosting, Random Forests, XGBoost), PCA & Reinforcement Learning", "Machine Learning Lab: Scikit-Learn Feature Engineering, Cross-Validation & Model Evaluation"]
  },
  {
    meta: "ALCD & NLP · Sem VI · 3PC611CS & 3PE610CS · 6 Credits",
    name: "Automata, Compiler Design & Natural Language Processing (NLP)",
    desc: "Core topics learnt: Finite automata (DFA/NFA), regular expressions, context-free grammars, Turing machines, lexical/syntactic compiler parsing, intermediate code generation, N-gram language models, POS tagging, and dialogue systems.",
    topics: ["Deterministic & Non-Deterministic Finite Automata (DFA/NFA) & Regular Expressions", "Context-Free Grammars (CFG), Pushdown Automata (PDA) & Turing Machines", "Compiler Phases: Lexical Analysis, Top-Down (LL) & Bottom-Up (SLR, CLR, LALR) Parsing", "Syntax-Directed Translation, Three-Address Intermediate Code & Code Optimization", "NLP: Morphological Parsing, N-Gram Models, POS Tagging, Syntactic Parsing & Chatbot Dialogue Systems"]
  },
  {
    meta: "ETC, Web Tech Lab & Mini Project · Sem VI · 3HS652HS, 3PC662CS & 3PW663CS · 5 Credits",
    name: "Effective Technical Communication, Full-Stack Web Lab (Grade B) & Mini Project (Grade A)",
    desc: "Core topics learnt: Analytical, feasibility, and progress report writing, technical proposals, and full-stack web engineering using HTML5, CSS3, JavaScript, XML, PHP, and MySQL.",
    topics: ["Effective Technical Communication: Informative, Analytical, Feasibility & Progress Reports", "Business Proposals, User Manuals, Research Paper Structuring & Visual Data Rhetoric", "Web Technology Lab: HTML5, CSS3, JavaScript DOM Validation, XML/XSLT, PHP & MySQL CRUD Bookstore", "Mini Project (Grade A): End-to-End Problem Formulation, Architecture Design & Working Prototype"]
  },
  {
    meta: "CNS · Sem VII · 3PC712CS & 3PC764CS · 4 Credits (Lab Grade A)",
    name: "Symmetric/Asymmetric Ciphers, RSA, SHA Hashing, SSL/TLS & Network Security (& Lab)",
    desc: "Core topics learnt: Symmetric encryption (DES, AES), public-key cryptography (RSA, Diffie-Hellman, ECC), SHA/HMAC cryptographic hashing, digital signatures, Kerberos, SSL/TLS, IPsec, and firewall security.",
    topics: ["Security Services, Classical Ciphers, Feistel Structure, DES, Triple-DES & AES", "Public-Key Cryptography: Number Theory, RSA Algorithm, Diffie-Hellman & Elliptic Curve Cryptography (ECC)", "Cryptographic Hash Functions (SHA, MD5), HMAC, Digital Signatures & Kerberos/X.509 Authentication", "Transport & Network Security: SSL/TLS, HTTPS, S/MIME, PGP & IPsec", "System Security: Firewalls, Intrusion Detection Systems (IDS) & Cryptographic Implementation Lab"]
  },
  {
    meta: "DL · Sem VII · 3PC713CS & 3PC765CS · 5 Credits (With Lab)",
    name: "Multilayer Perceptrons, Backpropagation, CNNs, RNNs, Word2Vec & GANs (& Lab)",
    desc: "Core topics learnt: Deep feedforward networks, Adam/RMSProp optimization, dropout/batch normalization, Convolutional Neural Networks (CNNs), LSTM/GRU sequence models, Word2Vec/GloVe embeddings, Autoencoders, and GANs.",
    topics: ["Deep Feedforward Networks, Activation Functions (ReLU, Softmax), Adam/RMSProp & Dropout/BatchNorm", "Convolutional Neural Networks (CNNs): Convolution/Pooling Layers, LeNet, AlexNet, VGG & ResNet", "Sequential Modeling: Recurrent Neural Networks (RNNs), Bidirectional RNNs, LSTM & GRU", "Distributed Word Representations (Word2Vec, GloVe, FastText) & Transfer Learning", "Autoencoders, Variational Autoencoders (VAEs) & Generative Adversarial Networks (GANs)"]
  },
  {
    meta: "Cloud Computing & FSD-I · Sem VII · 3PC714CS & 3PE714CS · 6 Credits",
    name: "Distributed Cloud Architecture, Virtualization & Full Stack Development (React/Node)",
    desc: "Core topics learnt: Cloud service models (IaaS, PaaS, SaaS), hypervisor virtualization, MapReduce distributed computing, Node.js and Express RESTful APIs, React hooks/routing, Redux state management, and Axios.",
    topics: ["Cloud Computing Paradigms, Virtualization (Hypervisors) & MapReduce Distributed Computing", "Cloud Service Models (IaaS, PaaS, SaaS), AWS/Azure/GCP Architecture & Cloud Security", "Full Stack Development I: ES6+ JavaScript, Node.js Event Loop & Express.js RESTful APIs", "React Component Lifecycle, Hooks, React Router & Redux State Management", "Axios Asynchronous Data Fetching & End-to-End Full-Stack Integration"]
  },
  {
    meta: "WSMA · Sem VIII · 3PE819CS · 3 Credits",
    name: "Web and Social Media Analytics (DSS, NLP Sentiment, SEO & Prescriptive Analytics)",
    desc: "Core topics learnt: Decision Support Systems (DSS), NLP text mining and sentiment analysis, web content/structure/usage mining, clickstream SEO metrics, prescriptive what-if/goal-seeking analysis, and Social Network Analysis (SNA).",
    topics: ["Unit I — Foundations of Analytics & Decision Support Systems (DSS) Architecture", "Unit II — Text Analytics, NLP Tokenization, Stemming, TF-IDF & Sentiment/Speech Analytics", "Unit III — Web Analytics: Web Content, Structure (PageRank/HITS) & Usage Mining, Clickstream & SEO KPIs", "Unit IV — Prescriptive Analytics: Automated Decision Systems, What-If Analysis & Goal-Seeking", "Unit V — Social Media Analytics & Social Network Analysis (SNA): Centrality Metrics & Influence Modeling"]
  },
  {
    meta: "STM · Sem VIII · 3PE823CS · 3 Credits",
    name: "Software Testing Methodologies (Path/Dataflow Testing, Selenium, JMeter & WinRunner)",
    desc: "Core topics learnt: Software bug taxonomy, control-flow and path testing, transaction/dataflow testing, domain boundary analysis, logic decision tables, state-graph testing, and automated testing with Selenium, JMeter, and WinRunner.",
    topics: ["Unit I — Dichotomies of Testing, Bug Taxonomy, Control Flow Graphs (CFG) & Path Testing", "Unit II — Transaction Flow Testing & Dataflow Testing Strategies", "Unit III — Domain Testing (Boundary Value Analysis) & Path Products / Regular Expressions", "Unit IV — Logic-Based Testing (Decision Tables, KV Charts) & State-Graph Transition Testing", "Unit V — Graph Matrices & Automated Testing Tools: Selenium WebDriver, Apache JMeter & WinRunner"]
  },
  {
    meta: "MEFA & Capstones · Sem VII & VIII · 3HS802HS, 3PW766CS, 3PW767CS & 3PW868CS",
    name: "Managerial Economics, Financial Accounting, Summer Internship (Grade S) & Capstone Thesis (Grade A)",
    desc: "Core topics learnt: Demand forecasting, break-even economics, double-entry financial accounting, capital budgeting (NPV/IRR), and end-to-end production system architecture for capstone projects.",
    topics: ["Managerial Economics: Demand Elasticity, Statistical Demand Forecasting & Break-Even Analysis", "Financial Accounting: Ledgers, Trial Balance, Final Accounts, Capital Budgeting (NPV, IRR) & Financial Ratios", "Summer Internship (Grade S) & Capstone Project Work I & II (Grade A): System Architecture & Thesis Defense"]
  }
];

const knowledgeNodes = [
  {
    year: "2007",
    shortLabel: "ICSE Standard",
    title: "ICSE Standard (Primary to 10th Grade)",
    meta: "2007 - 2019",
    description: "Core topics learnt: Java Object-Oriented Programming, Quantitative Mathematics, and quadrilingual communication across English, Hindi, and Telugu.",
    subjects: icseSubjectsArchive
  },
  {
    year: "2019",
    shortLabel: "MPC Track",
    title: "Mathematics & Analytical Track (Intermediate)",
    meta: "2019 - 2021",
    description: "Core topics learnt: Linear Algebra, Vector & Differential/Integral Calculus, Probability, Statistical Distributions, Conic Geometry, Arabic, and Analytical English.",
    subjects: mpcSubjectsArchive
  },
  {
    year: "2021",
    shortLabel: "B.E. CSE",
    title: "B.E. in Computer Science Engineering (First Division)",
    meta: "2021 - 2025",
    description: "Core topics learnt: Data Structures & Algorithms, DBMS, Operating Systems, Networks, Data Mining, AI/ML, Deep Learning, NLP, Cryptography, Cloud, Full-Stack Dev, and Analytics.",
    subjects: cseSubjectsArchive
  },
  {
    year: "2023",
    shortLabel: "IoT",
    title: "Internet of Things",
    meta: "Completed Mar 2023",
    description: "Core topics learnt: Sensor and actuator hardware interfacing, Arduino microcontrollers, Python telemetry scripting, and cloud IoT security via Cisco Networking Academy.",
    subjects: [
      {
        meta: "Cisco NetAcad · Module 1 & 2",
        name: "Connected Systems, Sensors, Actuators & Microcontrollers",
        desc: "Core topics learnt: Convergence of Operational Technology (OT) and IT networks, analog/digital sensors, breadboard prototyping, and Arduino/Python edge programming.",
        topics: ["Operational Technology (OT) vs Information Technology (IT) Convergence", "Sensors, Actuators, Arduino Uno & Raspberry Pi Prototyping", "Python & Blockly Edge Programming inside Cisco Packet Tracer"]
      },
      {
        meta: "Cisco NetAcad · Module 3, 4 & 5",
        name: "Big Data Telemetry Pipelines, Fog Computing & IoT Security",
        desc: "Core topics learnt: Streaming vs batch sensor data ingestion, fog/cloud computing topologies, intent-based automation, and end-to-end IoT device security.",
        topics: ["Streaming vs Batch Big Data Ingestion from Edge Nodes", "Cloud & Fog Computing Topologies", "Securing IoT Devices, Firmware & Network Gateways"]
      }
    ]
  },
  {
    year: "2023",
    shortLabel: "CCNAv7",
    title: "Computer Networks (CCNAv7)",
    meta: "Completed Aug 2023",
    description: "Core topics learnt: Cisco IOS switch/router CLI configuration, OSI & TCP/IP protocols, IPv4/IPv6 CIDR subnetting, VLANs, and network troubleshooting.",
    subjects: [
      {
        meta: "Cisco CCNAv7 · Network Access & IOS",
        name: "Cisco IOS CLI Configuration, Ethernet Switching & VLANs",
        desc: "Core topics learnt: Cisco IOS CLI navigation, SSH hardening, Ethernet frame structures, MAC address tables, ARP resolution, and switch port configuration.",
        topics: ["Cisco IOS CLI Navigation, SSH Hardening & Device Configuration", "Ethernet Frame Structure, MAC Address Tables & ARP Resolution", "Physical Cabling, Fiber Optics & Data Link Layer Protocols"]
      },
      {
        meta: "Cisco CCNAv7 · IP Addressing & Transport",
        name: "IPv4/IPv6 Subnetting, Routing & Transport Layer Reliability",
        desc: "Core topics learnt: IPv4 VLSM/CIDR subnetting, IPv6 addressing, router packet forwarding, ICMP diagnostics, TCP 3-way handshakes, and small-network security.",
        topics: ["IPv4 Subnetting, Variable Length Subnet Masking (VLSM) & IPv6 Addressing", "Router Packet Forwarding, Default Gateways & ICMP Diagnostics", "TCP 3-Way Handshake, UDP Streaming, Port Numbers & Security Hardening"]
      }
    ]
  },
  {
    year: "2025",
    shortLabel: "OS",
    title: "Operating Systems",
    meta: "Completed Dec 2025",
    description: "Core topics learnt: Linux and Windows kernel architecture, process/thread scheduling, virtual memory paging, POSIX shell scripting, and host permission security.",
    subjects: [
      {
        meta: "Cisco NetAcad · Kernel & CLI",
        name: "Linux & Windows Kernel Architecture, Shell Scripting & Process Control",
        desc: "Core topics learnt: Kernel vs user space abstraction, CPU process scheduling, Linux bash commands, piping, package management, and virtual memory paging.",
        topics: ["Kernel vs User Space, System Calls & Process/Thread Scheduling", "Linux CLI Mastery, File System Hierarchy, Piping & Bash Automation", "Virtual Memory Paging, Swap Management & Disk Partitioning"]
      },
      {
        meta: "Cisco NetAcad · Security & Access",
        name: "User Permissions, Network Services & Host Hardening",
        desc: "Core topics learnt: User and group account governance, POSIX file permissions (chmod/chown), system log auditing, background daemons, and host firewalls.",
        topics: ["User & Group Account Governance, Sudo Policies & File Permissions (rwx)", "System Log Auditing, Daemon/Service Management & Patching", "Host Firewalls, Port Security & Virtual Machine Provisioning"]
      }
    ]
  },
  {
    year: "2025",
    shortLabel: "AI",
    title: "Professional Practical Industry Standard Training Using AI",
    meta: "Sep - Dec 2025",
    description: "Core topics learnt: Applied machine learning (Random Forest, XGBoost), statistical preprocessing, computer vision (YOLOv8, OpenCV), deep learning, and LLM prompt engineering.",
    subjects: [
      {
        meta: "LearnAI · ISO 9001:2015 · Module 1",
        name: "Applied Machine Learning, Ensemble Algorithms & Feature Engineering",
        desc: "Core topics learnt: Data imputation, feature scaling (fit_transform), supervised classification/regression, Random Forest, XGBoost, SVM, K-Means, PCA, and cross-validation.",
        topics: ["End-to-End Data Preprocessing, Imputation, Scaling (fit_transform) & Outlier Removal", "Supervised Regression & Classification (Logistic, Decision Trees, Random Forest, XGBoost, SVM)", "Unsupervised Clustering, Dimensionality Reduction (PCA) & Hyperparameter Tuning"]
      },
      {
        meta: "LearnAI · ISO 9001:2015 · Module 2",
        name: "Computer Vision (YOLOv8/OpenCV), Deep Learning & LLM Prompt Engineering",
        desc: "Core topics learnt: Convolutional neural networks, real-time object and posture detection with Ultralytics YOLOv8 and OpenCV, NLP embeddings, and structured prompt engineering.",
        topics: ["Neural Networks, CNNs & Real-Time Object Detection with Ultralytics YOLOv8 & OpenCV", "Natural Language Processing, Embeddings & Generative AI Workflows", "Structured Prompt Engineering, Few-Shot Chain-of-Thought & AI-Assisted Data Governance"]
      }
    ]
  },
  {
    year: "2026+",
    shortLabel: "Growing...",
    title: "Continuous Evolution",
    meta: "2026 - Present",
    description: "Core topics learnt: Enterprise cloud data engineering, healthcare interoperability (HL7 FHIR), CRM governance (Salesforce), and automated ETL/ELT ecosystems.",
    isAccent: true,
    subjects: [
      {
        meta: "Active Horizon · Data Engineering & Governance",
        name: "Cloud Data Ecosystems, Interoperability & Automated Governance",
        desc: "Core topics learnt: Designing governed relational/cloud schemas, automated Python/SQL ETL pipelines, HL7 FHIR clinical data standards, and Microsoft Azure cloud architectures.",
        topics: ["Microsoft Azure Cloud Data Architecture & Containerized Docker Workflows", "HL7 FHIR Clinical Interoperability & Enterprise Salesforce CRM Architecture", "Automated SQL/Python ETL Pipelines, Alembic Migrations & Executive BI Reporting"]
      }
    ]
  }
];

// Unbundled Relevant Coursework + Exact Heading Names ("Currently Learning" & "Verified Certificates")
const knowledgeExpansionData = [
  {
    meta: "Always Learning",
    heading: "Currently Learning",
    items: [
      {
        name: "Microsoft Azure Course (Azure Fundamentals)",
        badge: "Microsoft Learn / Coursera",
        hoverMeta: "Cloud Architecture",
        url: "https://www.google.com/url?q=https://learn.microsoft.com/training/paths/azure-fundamentals/",
        detail: "Core topics learnt: Cloud computing concepts (IaaS, PaaS, SaaS), Azure regions and resource groups, virtual machines, containers, VNet networking, Blob/SQL/Cosmos DB storage, Entra ID (RBAC), and Azure Policy governance.",
        topics: [
          "Cloud Concepts: High Availability, Scalability, Elasticity, Fault Tolerance & Shared Responsibility Model",
          "Core Azure Architecture: Regions, Availability Zones, Resource Groups & Azure Resource Manager (ARM)",
          "Azure Compute & Networking: Virtual Machines, App Services, Containers, AKS, Virtual Networks (VNet) & ExpressRoute",
          "Azure Storage & Databases: Blob, Disk, File & Queue Storage, Azure SQL & Cosmos DB",
          "Identity, Governance & Cost: Microsoft Entra ID, RBAC, Zero Trust, Azure Policy, Microsoft Purview & Cost Management"
        ]
      },
      {
        name: "Google Prompting Essentials",
        badge: "Google / Coursera",
        hoverMeta: "AI Specialization",
        url: "https://www.coursera.org/specializations/prompting-essentials-google/",
        detail: "Core topics learnt: Google's 5-step prompting framework (Task, Context, References, Evaluate, Iterate), few-shot prompting, chain-of-thought reasoning, prompt chaining, AI-assisted spreadsheet data analysis, and bias/hallucination auditing.",
        topics: [
          "Start Writing Prompts like a Pro: Google's 5-Step TCREI Framework (Task, Context, References, Evaluate, Iterate)",
          "Zero-Shot vs Few-Shot Prompting, Persona Assignment & Output Constraints",
          "Design Prompts for Everyday Work Tasks: Summarizing Technical Reports & Drafting Stakeholder Communications",
          "Use AI for Data Analysis & Presentations: Extracting Insights from Datasets, Formula Generation & Slide Structuring",
          "Use AI as an Expert Partner: Chain-of-Thought Reasoning, Prompt Chaining, Multimodal Inputs & Responsible AI Auditing"
        ]
      },
      {
        name: "HL7 FHIR Healthcare Interoperability (Udemy)",
        badge: "Clinical Data Std",
        hoverMeta: "HL7 FHIR Mastery",
        url: "https://www.udemy.com/course/hl7-fhir/learn/lecture/55475357#reviews",
        detail: "Core topics learnt: Healthcare interoperability history (HL7 v2, v3, CDA), FHIR resource architecture (Patient, Observation, Encounter), JSON/XML data types, extensions, RESTful CRUD and search parameters, FHIR Bundles, and SMART on FHIR profiling.",
        topics: [
          "Understanding Healthcare Interoperability: HL7 v2, HL7 v3, CDA & Clinical Terminologies (SNOMED CT, LOINC, ICD-10)",
          "The HL7 FHIR Standard: Modular Resource Structure, Data Types, References, Narratives & Extensions",
          "RESTful FHIR API & Search Capabilities: CRUD Operations, Search Parameters, Modifiers, Chaining & Bundles (Transaction/Batch)",
          "Profiling, Conformance & Extensions: StructureDefinition, ValueSets, Implementation Guides, SMART on FHIR & Mirth Connect Transformations"
        ]
      },
      {
        name: "Salesforce Enterprise Ecosystem",
        badge: "CRM Governance",
        hoverMeta: "Enterprise Cloud",
        detail: "Core topics learnt: Multi-tenant cloud data modeling, custom objects, master-detail and lookup relationships, validation rules, organization-wide security defaults, role hierarchies, Record-Triggered Flows, and Apex triggers.",
        topics: [
          "Enterprise Data Modeling: Standard & Custom Objects, Master-Detail vs Lookup Relationships & Schema Builder",
          "Data Quality & Governance: Validation Rules, Formula Fields, Roll-Up Summaries & Duplicate Management",
          "Security Model: Organization-Wide Defaults (OWD), Role Hierarchies, Profiles, Permission Sets & Field-Level Security",
          "Declarative & Programmatic Automation: Record-Triggered Flows, Approval Processes, Apex Triggers & Lightning Dashboards"
        ]
      },
      // SEPARATED INDIVIDUAL RELEVANT COURSEWORK ITEMS
      {
        name: "Database Management Systems (DBMS)",
        badge: "Relevant Coursework",
        hoverMeta: "3PC301CS & Lab",
        detail: "Core topics learnt: Relational database schema design (1NF–BCNF), full-spectrum SQL (DDL, DML, DQL, DCL, TCL), views, triggers, stored procedures, ACID concurrency, and B+ tree indexing.",
        topics: ["ER Modeling & Relational Algebra", "SQL DDL, DML, DQL, DCL, TCL, Triggers, Views & Stored Procedures", "Schema Normalization (1NF, 2NF, 3NF, BCNF, 4NF)", "ACID Transactions, Serializability, Two-Phase Locking & B+ Tree Indexing"]
      },
      {
        name: "Data Mining",
        badge: "Relevant Coursework",
        hoverMeta: "3PC404CS",
        detail: "Core topics learnt: Knowledge Discovery in Databases (KDD), data preprocessing, Apriori and FP-Growth association rule mining, Decision Trees, Naïve Bayes, SVM classification, and K-Means/DBSCAN clustering.",
        topics: ["KDD Preprocessing, Cleaning, Normalization & Attribute Selection", "Apriori & FP-Growth Association Rule Mining", "Decision Trees, Naïve Bayes, KNN & Support Vector Machines", "K-Means, Hierarchical & DBSCAN Clustering + Outlier Detection"]
      },
      {
        name: "Probability and Statistics",
        badge: "Relevant Coursework",
        hoverMeta: "3BS305HS",
        detail: "Core topics learnt: Binomial, Poisson, and Normal probability distributions, skewness/kurtosis, Karl Pearson and Spearman correlation, linear regression, and Z/t/F/Chi-Square hypothesis testing.",
        topics: ["Discrete & Continuous Probability Distributions", "Measures of Central Tendency, Dispersion, Skewness & Kurtosis", "Pearson & Spearman Rank Correlation & Linear Regression", "Large & Small Sample Hypothesis Testing (Z-test, t-test, F-test, Chi-Square)"]
      },
      {
        name: "Optimization & Problem Solving Techniques",
        badge: "Relevant Coursework",
        hoverMeta: "3HS404HS",
        detail: "Core topics learnt: Linear programming (Simplex, Big-M), transportation (MODI) and assignment (Hungarian) models, job sequencing, queueing theory, and Bellman's dynamic programming.",
        topics: ["Linear Programming Formulation & Simplex Method", "MODI Transportation & Hungarian Assignment Optimization", "Job Sequencing, Queueing Models & Bellman's Dynamic Programming"]
      },
      {
        name: "Artificial Intelligence (Coursework)",
        badge: "Relevant Coursework",
        hoverMeta: "3PC507CS & Lab",
        detail: "Core topics learnt: Intelligent agents, uninformed and heuristic search (A*, Hill Climbing, Minimax alpha-beta), first-order predicate logic inference, automated planning, and Bayesian networks.",
        topics: ["BFS, DFS, A* Heuristic Search & Minimax Alpha-Beta Pruning", "Propositional & First-Order Predicate Logic Resolution", "Classical Planning, Bayesian Networks & Fuzzy Logic"]
      },
      {
        name: "Machine Learning",
        badge: "Relevant Coursework",
        hoverMeta: "3PC610CS & Lab",
        detail: "Core topics learnt: Supervised and unsupervised learning, ID3 Decision Trees, Multi-Layer Perceptrons, SVM, Bayesian learning, Random Forest, XGBoost, PCA dimensionality reduction, and Scikit-Learn validation.",
        topics: ["Concept Learning & Decision Tree ID3 Induction", "Multi-Layer Perceptrons, Radial Basis Functions & Support Vector Machines", "Bayesian Learning, EM Algorithm & K-Nearest Neighbors", "Ensemble Learning (Bagging, Boosting, Random Forest, XGBoost) & PCA"]
      },
      {
        name: "Deep Learning",
        badge: "Relevant Coursework",
        hoverMeta: "3PC713CS & Lab",
        detail: "Core topics learnt: Deep feedforward neural networks, backpropagation, Adam/RMSProp optimizers, Convolutional Neural Networks (CNNs), RNN/LSTM sequence models, Word2Vec embeddings, Autoencoders, and GANs.",
        topics: ["Deep Feedforward Networks, ReLU/Softmax, Adam & Dropout/BatchNorm", "Convolutional Neural Networks (LeNet, AlexNet, VGG, ResNet)", "Recurrent Neural Networks (RNNs, Bidirectional RNNs, LSTM, GRU)", "Word2Vec, GloVe, Autoencoders & Generative Adversarial Networks (GANs)"]
      },
      {
        name: "Digital Image Processing",
        badge: "Relevant Coursework",
        hoverMeta: "3ES501CS & Lab",
        detail: "Core topics learnt: Spatial and Fourier domain filtering, histogram equalization, morphological operations, Canny/Otsu edge segmentation, and practical OpenCV/YOLOv8 computer vision.",
        topics: ["Image Sampling, Quantization & Histogram Equalization", "Spatial & 2D Fourier/Wavelet Transform Filtering", "Morphological Operations & Canny/Otsu Segmentation", "Practical OpenCV & Ultralytics YOLOv8 Vision Lab"]
      },
      {
        name: "Natural Language Processing (NLP)",
        badge: "Relevant Coursework",
        hoverMeta: "3PE610CS",
        detail: "Core topics learnt: Regular expressions, morphological parsing, N-gram language models, Part-of-Speech (POS) tagging, syntactic parsing, semantic WordNet taxonomies, and chatbot dialogue systems.",
        topics: ["Regular Expressions, Tokenization & Morphological Parsing", "N-Gram Language Models & Smoothing", "POS Tagging, Syntactic Parsing & Word Embeddings", "Discourse Resolution & Frame-Based Chatbot Dialogue Systems"]
      },
      {
        name: "Web and Social Media Analytics",
        badge: "Relevant Coursework",
        hoverMeta: "3PE819CS",
        detail: "Core topics learnt: Decision Support Systems (DSS), NLP sentiment and text mining, web content/structure/usage mining, clickstream SEO KPIs, prescriptive what-if analysis, and Social Network Analysis (SNA).",
        topics: ["Decision Support Systems (DSS) & Descriptive Analytics", "NLP Text Mining, TF-IDF & Sentiment/Speech Analytics", "Web Content, Structure (PageRank) & Usage Clickstream Mining", "Prescriptive What-If/Goal-Seeking & Social Network Analysis (SNA)"]
      },
      {
        name: "Data Structures & Algorithms (DSA)",
        badge: "Relevant Coursework",
        hoverMeta: "3ES202CS & Lab",
        detail: "Core topics learnt: Linked lists, stacks, queues, binary search trees, AVL/B-trees, heaps, hash tables, BFS/DFS/Dijkstra graph algorithms, and sorting time/space complexity.",
        topics: ["Singly/Doubly Linked Lists, Stacks & Priority Queues", "Binary Search Trees, AVL Trees, B-Trees & Heaps", "Graph Traversals (BFS, DFS), Prim's/Kruskal's MST & Dijkstra", "Hash Tables & Sorting (Quick, Merge, Heap, Radix)"]
      },
      {
        name: "Design and Analysis of Algorithms (DAA)",
        badge: "Relevant Coursework",
        hoverMeta: "3PC609CS",
        detail: "Core topics learnt: Asymptotic Big-O notation, recurrence relations, Divide and Conquer, Greedy algorithms, Dynamic Programming, Backtracking, Branch and Bound, and NP-Completeness.",
        topics: ["Asymptotic Complexity & Master Theorem", "Divide & Conquer & Greedy Optimization", "Dynamic Programming (0/1 Knapsack, Matrix Chain, All-Pairs Shortest Path, TSP)", "Backtracking, Branch & Bound & NP-Hard/NP-Complete Theory"]
      },
      {
        name: "Automata Languages & Compiler Design",
        badge: "Relevant Coursework",
        hoverMeta: "3PC611CS",
        detail: "Core topics learnt: Deterministic/Non-deterministic Finite Automata (DFA/NFA), Context-Free Grammars, Pushdown Automata, Turing Machines, LL/LR compiler parsing, and code optimization.",
        topics: ["DFA/NFA, Regular Expressions & Context-Free Grammars", "Pushdown Automata, Turing Machines & Decidability", "Lexical Analysis, LL(1) & SLR/CLR/LALR Bottom-Up Parsing", "Three-Address Intermediate Code & Target Code Generation"]
      },
      {
        name: "Full Stack Development & Web Technologies",
        badge: "Relevant Coursework",
        hoverMeta: "3PE714CS & 3PC662CS",
        detail: "Core topics learnt: HTML5, CSS3, ES6+ JavaScript, PHP, MySQL CRUD, Node.js, Express.js RESTful APIs, React hooks/router, Redux state management, and Axios.",
        topics: ["HTML5, CSS3, JavaScript DOM & PHP/MySQL Backend", "Node.js Event Loop & Express.js RESTful API Middleware", "React Components, Hooks, React Router & Redux State Management", "Axios Asynchronous Integration & Single-Page App Architecture"]
      },
      {
        name: "Cloud Computing",
        badge: "Relevant Coursework",
        hoverMeta: "3PC714CS",
        detail: "Core topics learnt: Cloud service models (IaaS, PaaS, SaaS), hypervisor virtualization, MapReduce distributed data processing, AWS/Azure/GCP architectures, and cloud security.",
        topics: ["NIST Cloud Model, IaaS, PaaS & SaaS", "Hypervisor Virtualization & MapReduce Distributed Computing", "AWS, Google App Engine & Azure Cloud Storage/Compute"]
      },
      {
        name: "Operating Systems",
        badge: "Relevant Coursework",
        hoverMeta: "3PC405CS & Lab",
        detail: "Core topics learnt: Kernel system calls, CPU process scheduling, thread concurrency, semaphores, Banker's deadlock avoidance, virtual memory paging, and Linux C/C++ lab implementation.",
        topics: ["Linux System Calls & CPU Scheduling (FCFS, SJF, Round Robin)", "Process Synchronization, Semaphores & Banker's Deadlock Avoidance", "Virtual Memory Paging, LRU Page Replacement & Disk Scheduling"]
      },
      {
        name: "Computer Networks",
        badge: "Relevant Coursework",
        hoverMeta: "3PC406CS & Lab",
        detail: "Core topics learnt: OSI and TCP/IP protocol stacks, CRC error control, IPv4/IPv6 CIDR subnetting, OSPF/BGP packet routing, TCP congestion control, DNS/HTTP, and C socket programming.",
        topics: ["OSI & TCP/IP Layers, Framing & CRC Error Detection", "IPv4/IPv6 CIDR Subnetting, OSPF, BGP & ARP", "TCP 3-Way Handshake, Flow/Congestion Control & Socket Programming"]
      },
      {
        name: "Cryptography and Network Security",
        badge: "Relevant Coursework",
        hoverMeta: "3PC712CS & Lab",
        detail: "Core topics learnt: Symmetric ciphers (DES, AES), public-key encryption (RSA, Diffie-Hellman, ECC), SHA/HMAC cryptographic hashing, digital signatures, Kerberos, SSL/TLS, IPsec, and firewalls.",
        topics: ["Symmetric Encryption (DES, Triple-DES, AES)", "Public-Key Cryptography (RSA, Diffie-Hellman, ECC)", "SHA Hashing, HMAC, Digital Signatures, SSL/TLS, IPsec & Firewalls"]
      },
      {
        name: "Software Engineering & Testing Methodologies",
        badge: "Relevant Coursework",
        hoverMeta: "3PC508CS & 3PE823CS",
        detail: "Core topics learnt: Agile Scrum and Waterfall SDLC, UML system modeling, control-flow/dataflow path testing, domain boundary testing, and automated QA with Selenium, JMeter, and WinRunner.",
        topics: ["Agile Scrum, Waterfall SDLC, SRS & UML Diagrams", "Control-Flow Path Testing, Dataflow & Domain Boundary Testing", "Automated Regression & Load Testing with Selenium, JMeter & WinRunner"]
      }
    ]
  },
  {
    meta: "Courses",
    heading: "Verified Certificates",
    items: [
      {
        name: "Artificial Intelligence",
        badge: "UASL · ISO 9001:2015",
        hoverMeta: "Sep - Dec 2025",
        detail: "Core topics learnt: 4-month ISO 9001:2015 certified curriculum covering statistical preprocessing, supervised and ensemble machine learning (Random Forest, XGBoost), deep computer vision (OpenCV, YOLOv8), NLP, and LLM workflows.",
        topics: [
          "Supervised & Unsupervised Machine Learning (Regression, Random Forest, XGBoost, SVM, K-Means, PCA)",
          "Statistical Data Profiling, Feature Scaling (fit_transform) & Cross-Validation",
          "Deep Learning & Computer Vision with OpenCV & Ultralytics YOLOv8",
          "Natural Language Processing, Generative AI APIs & Production Model Deployment"
        ]
      },
      {
        name: "Cisco Operating Systems",
        badge: "Basics",
        hoverMeta: "Basics · Dec 2025",
        detail: "Core topics learnt: Operating system kernel fundamentals, process and thread scheduling, virtual memory allocation, Linux command-line administration, bash scripting, Windows administration, and POSIX user/file security.",
        topics: [
          "Operating System Basics: Kernel Architecture, Hardware Abstraction, Processes, Threads & Memory Allocation",
          "Linux Command Line Interface (CLI), File Systems, Piping, Package Management & Bash Scripting",
          "Windows OS Administration, Registry, Services, Disk Management & PowerShell Basics",
          "Host Security: User/Group Permissions (chmod/chown), Firewalls, Patching & Virtual Machine Environments"
        ]
      },
      {
        name: "Cisco CCNAv7: Introduction to Networks",
        badge: "Cisco NetAcad",
        hoverMeta: "Completed Aug 2023",
        detail: "Core topics learnt: Cisco IOS switch and router CLI configuration, OSI and TCP/IP networking models, Ethernet MAC switching, IPv4 CIDR/VLSM subnetting, IPv6 addressing, ICMP diagnostics, and transport-layer security.",
        topics: [
          "Cisco IOS Switch & Router CLI Configuration, SSH Security & Interface Management",
          "OSI & TCP/IP Protocol Suites, Ethernet Framing, MAC Tables & ARP",
          "IPv4 Subnetting, VLSM, IPv6 Addressing, Static/Dynamic Routing & ICMP Troubleshooting",
          "Transport Layer TCP/UDP Reliability, Port Numbers & Small-Network Security Hardening"
        ]
      },
      {
        name: "Cisco Introduction to Internet of Things (IoT)",
        badge: "Cisco NetAcad",
        hoverMeta: "Completed Mar 2023",
        detail: "Core topics learnt: Convergence of Operational Technology (OT) and IT networks, hardware prototyping with sensors, actuators, and Arduino microcontrollers, Python telemetry automation, and IoT network security.",
        topics: [
          "Digital Transformation & Convergence of Operational Technology (OT) and IT Networks",
          "Hardware Prototyping with Sensors, Actuators, Arduino Microcontrollers & Python",
          "IoT Big Data Streaming, Fog/Cloud Computing Models & Intent-Based Network Automation",
          "End-to-End IoT Device & Network Security Practices"
        ]
      },
      {
        name: "Take Charge of Your Time — Ankur Warikoo",
        badge: "Productivity Mastery",
        hoverMeta: "Time Management",
        detail: "Core topics learnt: Comprehensive time auditing, the Eisenhower urgency-importance matrix, calendar timeboxing over to-do lists, cognitive energy alignment, eliminating context-switching, and weekly review systems.",
        topics: [
          "Deconstructing the Time Illusion: Shifting from 'Lack of Time' to Deliberate Priority Allocation",
          "The Comprehensive Time Audit: Tracking & Categorizing Hours Across High-Leverage vs Low-Value Tasks",
          "The Eisenhower Priority Matrix & Eliminating Fake Urgency",
          "Calendar Blocking over To-Do Lists: Timeboxing Deep-Work Blocks, Buffer Zones & Zero-Context-Switching Sprints",
          "Managing Energy & Procrastination: Aligning Peak Cognitive Windows with Complex Engineering Tasks",
          "Building Sustainable Systems: Weekly Reviews & Habit Stacking"
        ]
      }
    ]
  }
];

function openKnowledgeNodeModal(node) {
  const rowsHTML = (node.subjects || []).map((subj, idx) => {
    const drawerId = `subj-drawer-${idx}`;
    const topicsListHTML = (subj.topics || []).map(t => `
      <li class="flex items-start gap-2 text-xs text-ashGray">
        <span class="w-1.5 h-1.5 rounded-full bg-trustBlue mt-1.5 shrink-0"></span>
        <span>${t}</span>
      </li>
    `).join('');

    return `
      <div class="py-4 first:pt-0 last:pb-0 cursor-pointer group" onclick="toggleTopicDrawer('${drawerId}')">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1.5 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-trustBlue shrink-0"></span>
              <h4 class="font-heading text-base font-bold text-charcoal group-hover:text-trustBlue transition-colors">${subj.name}</h4>
            </div>
            <p class="font-body text-xs sm:text-sm text-ashGray leading-relaxed pl-4">${subj.desc}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0 self-start sm:self-center pl-4 sm:pl-0">
            <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2.5 py-1 rounded">
              ${subj.meta}
            </span>
            <span class="font-code text-[10px] text-mutedSlate group-hover:text-trustBlue transition-colors">
              Topics &darr;
            </span>
          </div>
        </div>

        <!-- EXPANDABLE IN-DEPTH TOPICS DRAWER -->
        <div id="${drawerId}" class="hidden mt-3 ml-4 p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
          <span class="font-code text-[10px] text-trustBlue uppercase tracking-wider block">Topics Covered in Depth</span>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
            ${topicsListHTML}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  openInspectionModal({
    meta: node.meta,
    title: node.title,
    subtitle: node.description,
    bodyHTML: rowsHTML,
    footerText: `${(node.subjects || []).length} Subjects Documented · Click any subject row to view its topics in depth`
  });
}

function openCourseSyllabusModal(course) {
  const topicsHTML = (course.topics || []).map((topic) => `
    <div class="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
      <span class="w-2 h-2 rounded-full bg-trustBlue mt-1.5 shrink-0"></span>
      <p class="font-body text-xs sm:text-sm text-charcoal leading-relaxed">${topic}</p>
    </div>
  `).join('');

  openInspectionModal({
    meta: `${course.badge} · ${course.hoverMeta}`,
    title: course.name,
    subtitle: course.detail,
    bodyHTML: topicsHTML,
    footerText: `${(course.topics || []).length} Core Syllabus Modules · Verified Curriculum`,
    externalUrl: course.url || null
  });
}

function initKnowledgeBaseLine() {
  const container = document.getElementById('kb-line-nodes');
  if (!container) return;
  container.innerHTML = '';

  knowledgeNodes.forEach((node, index) => {
    const isAbove = index % 2 === 0;

    const itemEl = document.createElement('div');
    itemEl.className = 'node-group relative flex flex-col items-center justify-center cursor-pointer group hover:z-50';

    itemEl.innerHTML = `
      <!-- FIXED-WIDTH HOVER POPUP CARD -->
      <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${node.meta}</span>
          <span class="font-code text-[10px] text-trustBlue font-medium">Click for Subjects &nearr;</span>
        </div>
        <h3 class="font-heading text-base font-bold text-charcoal leading-snug mb-1">${node.title}</h3>
        <p class="font-body text-xs text-ashGray leading-relaxed">${node.description}</p>
      </div>

      <!-- ALTERNATING LABEL & TIMELINE TICK -->
      <div class="relative flex flex-col items-center">
        <div class="${isAbove ? 'opacity-100' : 'opacity-0 pointer-events-none'} mb-3 flex flex-col items-center text-center transition-transform duration-200 group-hover:-translate-y-1">
          <span class="font-code text-[11px] ${node.isAccent ? 'text-trustBlue font-semibold' : 'text-mutedSlate'}">${node.year}</span>
          <span class="font-heading text-sm font-semibold ${node.isAccent ? 'text-trustBlue' : 'text-charcoal group-hover:text-trustBlue'} whitespace-nowrap">${node.shortLabel}</span>
          <div class="w-[1.5px] h-4 ${node.isAccent ? 'bg-trustBlue' : 'bg-gray-300 group-hover:bg-trustBlue'} mt-1.5 transition-colors"></div>
        </div>

        <div class="w-2.5 h-2.5 rounded-full ${node.isAccent ? 'bg-trustBlue ring-4 ring-blue-100' : 'bg-gray-300 group-hover:bg-trustBlue group-hover:scale-125'} transition-all"></div>

        <div class="${!isAbove ? 'opacity-100' : 'opacity-0 pointer-events-none'} mt-3 flex flex-col items-center text-center transition-transform duration-200 group-hover:translate-y-1">
          <div class="w-[1.5px] h-4 ${node.isAccent ? 'bg-trustBlue' : 'bg-gray-300 group-hover:bg-trustBlue'} mb-1.5 transition-colors"></div>
          <span class="font-heading text-sm font-semibold ${node.isAccent ? 'text-trustBlue' : 'text-charcoal group-hover:text-trustBlue'} whitespace-nowrap">${node.shortLabel}</span>
          <span class="font-code text-[11px] ${node.isAccent ? 'text-trustBlue font-semibold' : 'text-mutedSlate'}">${node.year}</span>
        </div>
      </div>
    `;

    itemEl.addEventListener('click', () => openKnowledgeNodeModal(node));
    bindDynamicPopup(itemEl, { alwaysTriggerClickOnTouch: true });
    container.appendChild(itemEl);
  });

  // Render 2-Column Scrollable Grid (Showing 3 Items at a Time)
  const expContainer = document.getElementById('knowledge-expansion-grid');
  if (!expContainer) return;
  expContainer.innerHTML = '';

  knowledgeExpansionData.forEach((col, cIdx) => {
    const colEl = document.createElement('div');
    colEl.className = `space-y-4 ${cIdx !== 0 ? 'md:border-l md:border-gray-200 md:pl-10' : ''}`;

    const itemsHTML = col.items.map((item, iIdx) => `
      <div data-col="${cIdx}" data-idx="${iIdx}" class="course-item-row node-group relative h-[58px] px-1 border-b border-gray-100 last:border-b-0 flex items-center justify-between cursor-pointer group">
        <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${item.hoverMeta}</span>
            <span class="font-code text-[10px] text-trustBlue font-medium">Click for Syllabus &nearr;</span>
          </div>
          <h4 class="font-heading text-sm font-bold text-charcoal mb-1">${item.name}</h4>
          <p class="font-body text-xs text-ashGray leading-relaxed">${item.detail}</p>
        </div>

        <span class="font-heading text-sm sm:text-base font-semibold text-charcoal group-hover:text-trustBlue transition-colors pr-3 truncate">${item.name}</span>
        <span class="font-code text-[11px] text-trustBlue bg-blue-50/80 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0">${item.badge}</span>
      </div>
    `).join('');

    colEl.innerHTML = `
      <div class="flex items-end justify-between">
        <div class="space-y-1">
          <span class="font-code text-xs font-semibold text-trustBlue uppercase tracking-wider">${col.meta}</span>
          <h3 class="font-heading text-xl font-bold text-charcoal">${col.heading}</h3>
        </div>
        <span class="font-code text-xs font-medium text-trustBlue bg-blue-50 px-2.5 py-0.5 rounded">Scroll (${col.items.length}) &updownarrow;</span>
      </div>
      <!-- Scrollable 3-Item Viewport -->
      <div class="three-item-scroll pr-2 divide-y divide-gray-100">
        ${itemsHTML}
      </div>
    `;

    expContainer.appendChild(colEl);

    colEl.querySelectorAll('.course-item-row').forEach((rowEl) => {
      const c = parseInt(rowEl.getAttribute('data-col'), 10);
      const i = parseInt(rowEl.getAttribute('data-idx'), 10);
      rowEl.addEventListener('click', () => openCourseSyllabusModal(knowledgeExpansionData[c].items[i]));
      bindDynamicPopup(rowEl, { alwaysTriggerClickOnTouch: true });
    });
  });
}


/* ==========================================================================
   3. MY SKILLS (Unbundled Atomic Pills · SQL Separated · 3-Column Bento Grid)
   ========================================================================== */
const skillCategories = [
  {
    name: "Languages & SQL Tiers",
    metaTag: "Core Syntax & Database Tiers",
    subtitle: "Separated from foundational querying (DQL/DML) to senior governance (DDL/DCL/TCL)",
    skills: [
      { name: "Python", filterKey: "Python", icon: "devicon-python-plain colored", meta: "Applied in: All Data Internships & AI Projects", exp: "Accomplished end-to-end data wrangling, statistical modeling, and computer-vision automation, as measured by production deployments across 5+ projects and internships, by doing modular Python scripting and pipeline orchestration." },
      { name: "SQL (DQL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Analytical Querying · SELECT / Joins / CTEs", exp: "Accomplished rapid multi-table analytical extraction and data auditing, as measured by sub-second reporting queries across APSS and DBMS labs, by doing complex DQL joins, window functions, aggregations, and subqueries." },
      { name: "SQL (DML)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Data Manipulation · INSERT / UPDATE / MERGE", exp: "Accomplished high-throughput ETL record population and automated database seeding at Artificial Penetration Software Solutions, as measured by 100% referential integrity, by doing structured DML batch upserts and transformations." },
      { name: "SQL (DDL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Data Engineering · Schemas / Views / Indexes", exp: "Accomplished resilient enterprise schema architecture at Artificial Penetration Software Solutions, as measured by zero-regression Alembic migrations, by doing normalized DDL table design, B+ tree indexing, views, triggers, and stored procedures." },
      { name: "SQL (DCL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Data Governance · GRANT / REVOKE / RBAC", exp: "Accomplished strict role-based access control and data security compliance at Artificial Penetration Software Solutions, as measured by zero unauthorized table exposures, by doing DCL privilege governance across MySQL and Unity Catalog." },
      { name: "SQL (TCL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Lead Reliability · COMMIT / ROLLBACK / ACID", exp: "Accomplished fault-tolerant transactional consistency during multi-step pipeline executions, as measured by zero partial-write corruptions, by doing TCL transaction wrapping, savepoints, and ACID rollback handling." },
      { name: "JavaScript", filterKey: "JavaScript", icon: "devicon-javascript-plain colored", meta: "Applied in: Web Dev & Data Governance", exp: "Accomplished responsive client-side interactivity and internal workflow automation, as measured by faster task execution across Cognifyz and APSS, by doing asynchronous ES6+ JavaScript development." },
      { name: "Dart", filterKey: "Dart", icon: "devicon-dart-plain colored", meta: "Applied in: Nutritional Tracker App", exp: "Accomplished real-time multi-API nutrition lookups and offline state sync, as measured by smooth 60fps mobile performance, by doing strongly-typed Dart programming with BLoC state management." },
      { name: "HTML5", filterKey: "HTML5", icon: "devicon-html5-plain colored", meta: "Applied in: Cognifyz Web Internship", exp: "Accomplished accessible, standards-compliant web interfaces, as measured by consistent cross-browser rendering at Cognifyz Technologies, by doing semantic HTML5 document structuring." },
      { name: "CSS3", filterKey: "CSS3", icon: "devicon-css3-plain colored", meta: "Applied in: Cognifyz & Full-Stack Builds", exp: "Accomplished clean, mobile-first visual hierarchy across web applications, as measured by 100% viewport responsiveness, by doing custom CSS3 Flexbox, Grid, and Tailwind styling." },
      { name: "PHP", filterKey: "PHP", icon: "devicon-php-plain colored", meta: "Applied in: Cognifyz & Web Tech Lab", exp: "Accomplished dynamic server-side form handling and relational database persistence, as measured by working bookstore and internship modules, by doing backend PHP controller scripting." },
      { name: "C / C++", filterKey: "C++", icon: "devicon-cplusplus-plain colored", meta: "Applied in: OS Lab & IoT Firmware", exp: "Accomplished low-latency hardware sensor polling and Linux kernel process simulations, as measured by Grade A lab verifications, by doing memory-safe C and C++ system programming." },
      { name: "Java", filterKey: "Java", icon: "devicon-java-plain colored", meta: "Applied in: ICSE & CSE Java Lab", exp: "Accomplished modular, fault-tolerant desktop and database utilities, as measured by multithreaded lab evaluations, by doing Object-Oriented Java programming with JDBC and Collections." }
    ]
  },
  {
    name: "Python Libraries",
    metaTag: "Data, ML & Vision Modules",
    subtitle: "Individual libraries for wrangling, modeling, computer vision, and interactive BI",
    skills: [
      { name: "Pandas", filterKey: "Pandas", icon: "devicon-pandas-plain colored", meta: "Applied in: Faalih & APSS Internships", exp: "Accomplished rapid transformation of noisy multi-source logs into clean analytical tables, as measured by 100% schema completeness, by doing Pandas DataFrame wrangling, merges, and group-by aggregations." },
      { name: "NumPy", filterKey: "NumPy", icon: "devicon-numpy-plain colored", meta: "Applied in: Faalih & APSS Internships", exp: "Accomplished high-speed numerical array processing and matrix computations, as measured by vectorized execution across large datasets, by doing NumPy multidimensional array operations." },
      { name: "Scikit-Learn", filterKey: "Scikit-Learn", icon: "devicon-scikitlearn-plain colored", meta: "Applied in: Disease Outbreak Predictor", exp: "Accomplished standardized feature scaling and ensemble model validation, as measured by cross-validated classification precision, by doing Scikit-Learn RandomForest pipelines and fit_transform preprocessing." },
      { name: "XGBoost", filterKey: "XGBoost", icon: "devicon-python-plain colored", meta: "Applied in: Disease Outbreak Predictor", exp: "Accomplished high-sensitivity regional disease outbreak forecasting across imbalanced datasets, as measured by gradient-boosted ROC-AUC performance, by doing XGBoost classification tuning." },
      { name: "SciPy", filterKey: "SciPy", icon: "devicon-python-plain colored", meta: "Applied in: APSS Data Governance", exp: "Accomplished mathematical distribution fitting and signal filtering across enterprise and sensor data, as measured by clean anomaly thresholds, by doing SciPy scientific computing." },
      { name: "Statsmodels", filterKey: "Statsmodels", icon: "devicon-python-plain colored", meta: "Applied in: APSS & Outbreak Predictor", exp: "Accomplished rigorous hypothesis validation and epidemiological time-series inference, as measured by statistically significant p-value audits, by doing Statsmodels OLS and ARIMA regression modeling." },
      { name: "OpenCV", filterKey: "OpenCV", icon: "devicon-opencv-plain colored", meta: "Applied in: Fall Detection System", exp: "Accomplished real-time video stream decoding and bounding-box telemetry overlays, as measured by 30fps live camera processing, by doing OpenCV (cv2) frame transformations." },
      { name: "Ultralytics YOLOv8", filterKey: "YOLOv8", icon: "devicon-python-plain colored", meta: "Applied in: Fall Detection System", exp: "Accomplished instant human fall detection from live camera feeds, as measured by sub-second posture-collapse recognition, by doing Ultralytics YOLOv8 deep-learning vision inference." },
      { name: "Matplotlib", filterKey: "Matplotlib", icon: "devicon-matplotlib-plain colored", meta: "Applied in: Faalih Consulting Internship", exp: "Accomplished clear exploratory distribution and trend plotting for consulting reports, as measured by rapid outlier identification, by doing custom Matplotlib figure rendering." },
      { name: "Seaborn", filterKey: "Seaborn", icon: "devicon-python-plain colored", meta: "Applied in: Faalih & APSS Internships", exp: "Accomplished multi-variable correlation discovery for stakeholders, as measured by intuitive visual sign-offs, by doing Seaborn statistical heatmaps and pairplots." },
      { name: "Plotly", filterKey: "Plotly", icon: "devicon-plotly-plain colored", meta: "Applied in: Data Governance Internship", exp: "Accomplished interactive, hover-enabled executive data quality charts at Artificial Penetration Software Solutions, as measured by dashboard adoption, by doing Plotly visual engineering." },
      { name: "Bokeh", filterKey: "Bokeh", icon: "devicon-python-plain colored", meta: "Applied in: Data Governance Internship", exp: "Accomplished browser-interactive streaming data visualizations for large governance tables, as measured by responsive zoom/pan auditing, by doing Bokeh dashboard scripting." },
      { name: "Altair", filterKey: "Altair", icon: "devicon-python-plain colored", meta: "Applied in: Data Governance Internship", exp: "Accomplished declarative statistical charting for governance reports at APSS, as measured by rapid visual prototyping, by doing Vega-Lite Altair specifications." },
      { name: "Pygame", filterKey: "Pygame", icon: "devicon-python-plain colored", meta: "Applied in: Fall Detection System", exp: "Accomplished low-latency on-site emergency audio sirens during detected fall states, as measured by immediate local alarm triggering, by doing Pygame event-loop audio scripting." },
      { name: "Alembic", filterKey: "Alembic", icon: "devicon-python-plain colored", meta: "Applied in: Data Governance Internship", exp: "Accomplished version-controlled relational schema evolution at Artificial Penetration Software Solutions, as measured by zero-downtime database upgrades, by doing Alembic migration scripting." }
    ]
  },
  {
    name: "Tools & QA Suites",
    metaTag: "Daily Instruments",
    subtitle: "Individual environments for coding, version control, containers, and testing",
    skills: [
      { name: "VS Code", filterKey: "VS Code", icon: "devicon-vscode-plain colored", meta: "Applied in: All Projects & Internships", exp: "Accomplished fast, linted full-stack and data engineering workflows across all internships, as measured by clean modular codebases, by doing daily development in VS Code." },
      { name: "Anaconda", filterKey: "Anaconda", icon: "devicon-anaconda-original colored", meta: "Applied in: Faalih & APSS Internships", exp: "Accomplished isolated, conflict-free Python data science environments, as measured by 100% reproducibility across machines, by doing virtual environment management in Anaconda." },
      { name: "Jupyter Notebook", filterKey: "Jupyter", icon: "devicon-jupyter-plain colored", meta: "Applied in: Faalih & APSS Internships", exp: "Accomplished transparent, step-by-step exploratory data analysis, as measured by seamless notebook handoffs, by doing interactive code and markdown documentation in Jupyter." },
      { name: "Google Colab", filterKey: "Google Colab", icon: "devicon-google-plain colored", meta: "Applied in: Faalih & AI Training", exp: "Accomplished cloud GPU model training and collaborative notebook sharing, as measured by rapid ML experimentation, by doing cloud execution in Google Colab." },
      { name: "Git", filterKey: "Git", icon: "devicon-git-plain colored", meta: "Applied in: All Projects & Internships", exp: "Accomplished traceable source control and atomic commit histories across all repositories, as measured by zero lost code, by doing distributed version control with Git." },
      { name: "Git Bash", filterKey: "Git", icon: "devicon-bash-plain", meta: "Applied in: APSS Data Governance", exp: "Accomplished fast command-line branch management, Rebasing, and shell scripting on Windows environments, by doing CLI operations in Git Bash." },
      { name: "GitHub", filterKey: "Git", icon: "devicon-github-original", meta: "Applied in: All Projects & Internships", exp: "Accomplished collaborative code hosting, pull-request reviews, and automated static deployments, by managing repositories on GitHub." },
      { name: "Docker", filterKey: "Docker", icon: "devicon-docker-plain colored", meta: "Applied in: Data Governance Internship", exp: "Accomplished consistent cross-environment pipeline execution at Artificial Penetration Software Solutions, as measured by portable service deployments, by doing Docker containerization." },
      { name: "Selenium", filterKey: "Selenium", icon: "devicon-selenium-original colored", meta: "Applied in: Software Testing (STM)", exp: "Accomplished automated cross-browser functional UI regression testing, as measured by repeatable test pass rates, by doing Selenium WebDriver scripting." },
      { name: "Apache JMeter", filterKey: "JMeter", icon: "badge", badgeText: "JMT", meta: "Applied in: Software Testing (STM)", exp: "Accomplished HTTP and database load-performance benchmarking, as measured by throughput and latency Bottleneck analysis, by doing Apache JMeter stress testing." },
      { name: "Cisco Packet Tracer", filterKey: "CCNA", icon: "badge", badgeText: "NET", meta: "Applied in: CCNAv7 & IoT Courses", exp: "Accomplished verified multi-router LAN/WAN and smart-sensor network architectures, as measured by zero packet-loss simulations, by doing topology design in Cisco Packet Tracer." }
    ]
  },
  {
    name: "Cloud & Platforms",
    metaTag: "Lakehouse & Ecosystems",
    subtitle: "Managed platforms for lakehouse governance, cloud compute, and deployments",
    skills: [
      { name: "Databricks", filterKey: "Databricks", icon: "badge", badgeText: "DBX", meta: "Applied in: Data Governance Internship", exp: "Accomplished collaborative lakehouse analytics and Medallion pipeline execution at Artificial Penetration Software Solutions, by doing distributed data engineering on Databricks." },
      { name: "Unity Catalog", filterKey: "Unity Catalog", icon: "badge", badgeText: "UC", meta: "Applied in: Data Governance Internship", exp: "Accomplished centralized metadata governance, data lineage tracking, and fine-grained access control at APSS, by administering Databricks Unity Catalog." },
      { name: "Microsoft Azure", filterKey: "Azure", icon: "devicon-azure-plain colored", meta: "Applied in: APSS & Azure Fundamentals", exp: "Accomplished scalable cloud data storage and governed compute orchestration, as measured by high-availability resource provisioning, by doing cloud configuration on Microsoft Azure." },
      { name: "Salesforce", filterKey: "Salesforce", icon: "devicon-salesforce-plain colored", meta: "Applied in: Enterprise CRM Track", exp: "Accomplished automated CRM data validation and role-based record security, as measured by clean multi-tenant object schemas, by doing Salesforce custom object and Flow configuration." },
      { name: "Google Drive", filterKey: "Google Drive", icon: "devicon-googlecloud-plain colored", meta: "Applied in: Cognifyz, Faalih & APSS", exp: "Accomplished governed cloud dataset storage and versioned deliverable sharing across three internships, by organizing structured repositories in Google Drive." },
      { name: "Vercel", filterKey: "Vercel", icon: "devicon-vercel-original", meta: "Applied in: Web Deployments", exp: "Accomplished zero-downtime production web hosting with instant Git branch previews, by deploying frontend builds on Vercel." },
      { name: "Pub.dev", filterKey: "Flutter", icon: "devicon-dart-plain colored", meta: "Applied in: Nutritional Tracker App", exp: "Accomplished modular Flutter integration for charts, permissions, and HTTP networking, by orchestrating vetted Dart packages from pub.dev." }
    ]
  },
  {
    name: "Databases, Hardware & APIs",
    metaTag: "Storage & Edge Telemetry",
    subtitle: "Relational/NoSQL engines, embedded IoT hardware, and external REST APIs",
    skills: [
      { name: "MySQL", filterKey: "MySQL", icon: "devicon-mysql-plain colored", meta: "Applied in: APSS & Web Tech Lab", exp: "Accomplished high-reliability relational storage, triggers, events, and stored procedures at Artificial Penetration Software Solutions, by architecting normalized MySQL schemas." },
      { name: "PostgreSQL", filterKey: "PostgreSQL", icon: "devicon-postgresql-plain colored", meta: "Applied in: Outbreak Predictor & DBMS", exp: "Accomplished structured epidemiological surveillance storage and indexed analytical queries, by engineering relational PostgreSQL tables." },
      { name: "MongoDB", filterKey: "MongoDB", icon: "devicon-mongodb-plain colored", meta: "Applied in: Disease Outbreak Predictor", exp: "Accomplished flexible document ingestion for unstructured climate and health logs, by designing NoSQL collections in MongoDB." },
      { name: "SQLite", filterKey: "SQLite", icon: "devicon-sqlite-plain colored", meta: "Applied in: Nutritional Tracker App", exp: "Accomplished 100% offline meal history availability on mobile devices, by persisting local relational tables in SQLite and SharedPreferences." },
      { name: "Arduino Uno", filterKey: "Arduino Uno", icon: "devicon-arduino-plain colored", meta: "Applied in: Heartbeat Sensor Project", exp: "Accomplished real-time analog-to-digital biometric pulse sampling, as measured by live BPM readouts, by wiring an Arduino Uno with pulse sensors, breadboards, MM/FF/MF pins, and a digital screen." },
      { name: "Linux", filterKey: "Linux", icon: "devicon-linux-plain", meta: "Applied in: Cisco OS & CSE OS Lab", exp: "Accomplished stable POSIX process, permission, and shell management, as measured by Cisco Operating Systems certification, by administering Linux CLI environments." },
      { name: "Twilio API", filterKey: "Twilio API", icon: "badge", badgeText: "SMS", meta: "Applied in: Fall & Outbreak Systems", exp: "Accomplished automated real-time SMS emergency and public-health threshold dispatching, by integrating the Twilio REST API into Python pipelines." },
      { name: "Gemini API", filterKey: "Gemini API", icon: "badge", badgeText: "LLM", meta: "Applied in: Nutritional Tracker App", exp: "Accomplished intelligent natural-language meal parsing and macro estimation inside Flutter, by integrating Google's Gemini API." },
      { name: "USDA & Open Food APIs", filterKey: "USDA API", icon: "badge", badgeText: "API", meta: "Applied in: Nutritional Tracker App", exp: "Accomplished verified global food and barcode nutritional lookups, by querying USDA, Open Food Facts, and Barcode Scanner REST APIs." }
    ]
  },
  {
    name: "BI, Frameworks & Soft Skills",
    metaTag: "Execution & Leadership",
    subtitle: "Executive BI suites, application frameworks, and corporate governance strengths",
    skills: [
      { name: "Power BI", filterKey: "Power BI", icon: "badge", badgeText: "PBI", meta: "Applied in: Data Governance Internship", exp: "Accomplished executive-ready KPI visibility at Artificial Penetration Software Solutions, as measured by stakeholder decision adoption, by doing interactive data modeling and dashboard design in Power BI." },
      { name: "Flutter", filterKey: "Flutter", icon: "devicon-flutter-plain colored", meta: "Applied in: Nutritional & Outbreak Apps", exp: "Accomplished native-speed cross-platform mobile interfaces, as measured by 60fps barcode scanning and chart rendering, by building with Flutter, BLoC, and charts_flutter." },
      { name: "React & Redux", filterKey: "React", icon: "devicon-react-original colored", meta: "Applied in: Full Stack Development", exp: "Accomplished reactive single-page web application state management, by building component architectures with React hooks, React Router, and Redux." },
      { name: "Node.js & Express", filterKey: "Node.js", icon: "devicon-nodejs-plain colored", meta: "Applied in: Full Stack Development", exp: "Accomplished scalable RESTful backend API routing and asynchronous middleware processing, by engineering Node.js and Express.js servers." },
      { name: "MS Excel & Google Sheets", filterKey: "MS Excel", icon: "badge", badgeText: "XLS", meta: "Applied in: Outbreak Predictor & APSS", exp: "Accomplished rapid tabular auditing and government dataset preprocessing, as measured by clean ETL staging inputs, by doing pivot analysis and formula automation in Excel and Sheets." },
      { name: "ETL / ELT Pipelines", filterKey: "ETL/ELT", icon: "badge", badgeText: "ETL", meta: "Applied in: APSS & Outbreak Predictor", exp: "Accomplished automated multi-source data extraction, schema validation, and warehouse loading, by engineering Python and SQL ETL/ELT workflows." },
      { name: "Prompt Engineering", filterKey: "Prompt Engineering", icon: "badge", badgeText: "AI", meta: "Applied in: APSS & Google Track", exp: "Accomplished accelerated metadata documentation and SQL query optimization at APSS, by applying structured few-shot and chain-of-thought prompt engineering." },
      { name: "Stakeholder Communication", filterKey: "Stakeholder Communication", icon: "badge", badgeText: "SYNC", meta: "Applied in: APSS Data Governance", exp: "Accomplished continuous dashboard and pipeline alignment with business leadership at APSS, as measured by 100% stakeholder sign-off, by doing structured feedback loops and improvisations." },
      { name: "Technical Documentation", filterKey: "Documentation", icon: "badge", badgeText: "DOC", meta: "Applied in: APSS & Technical Comm", exp: "Accomplished zero-ambiguity architectural handoffs, as measured by self-documenting schema repositories, by authoring analytical reports, presentations, and data dictionaries." }
    ]
  }
];

let activeSkillFilter = null;

function renderSkillLogoHTML(skill) {
  if (skill.icon === "badge") {
    return `
      <div class="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-trustBlue font-code text-[11px] font-bold flex items-center justify-center shrink-0">
        ${skill.badgeText}
      </div>
    `;
  }
  return `
    <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0">
      <i class="${skill.icon}"></i>
    </div>
  `;
}

function applySkillFilter(skillName) {
  if (activeSkillFilter === skillName) {
    clearSkillFilter();
    return;
  }
  activeSkillFilter = skillName;

  // Highlight active pill
  document.querySelectorAll('.skill-pill-btn').forEach((btn) => {
    const isMatch = btn.getAttribute('data-filter') === skillName || btn.getAttribute('data-name') === skillName;
    btn.classList.toggle('skill-pill-active', isMatch);
  });

  // Update filter banner
  const filterBar = document.getElementById('active-skill-filter-bar');
  const filterNameEl = document.getElementById('active-skill-name');
  if (filterBar && filterNameEl) {
    filterNameEl.textContent = skillName;
    filterBar.classList.remove('hidden');
    filterBar.classList.add('flex');
  }

  initProjectsGrid();
  initWorkFlowchart();

  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function clearSkillFilter() {
  activeSkillFilter = null;
  document.querySelectorAll('.skill-pill-btn').forEach((btn) => {
    btn.classList.remove('skill-pill-active');
  });
  const filterBar = document.getElementById('active-skill-filter-bar');
  if (filterBar) {
    filterBar.classList.add('hidden');
    filterBar.classList.remove('flex');
  }
  initProjectsGrid();
  initWorkFlowchart();
}

function initSkillsMatrix() {
  const container = document.getElementById('skills-matrix-grid');
  if (!container) return;
  container.innerHTML = '';

  skillCategories.forEach((cat) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'p-6 border-r border-b border-gray-200 flex flex-col justify-between space-y-5 bg-alabaster hover:bg-gray-50/40 transition-colors';

    const skillPillsHTML = cat.skills.map((skill) => {
      const logoHTML = renderSkillLogoHTML(skill);
      const miniIcon = skill.icon !== "badge"
        ? `<i class="${skill.icon} text-sm mr-1.5"></i>`
        : `<span class="w-1.5 h-1.5 rounded-full bg-trustBlue mr-1.5 inline-block"></span>`;
      const isSelected = activeSkillFilter && (activeSkillFilter === skill.filterKey || activeSkillFilter === skill.name);

      return `
        <div data-name="${skill.name}" data-filter="${skill.filterKey || skill.name}"
             class="skill-pill-btn node-group relative inline-flex items-center font-code text-xs font-medium bg-white border border-gray-200 hover:border-trustBlue text-charcoal hover:text-trustBlue px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-2xs hover:shadow-md hover:z-50 ${isSelected ? 'skill-pill-active' : ''}">
          ${miniIcon}
          <span>${skill.name}</span>

          <!-- FIXED-WIDTH HOVER/TAP POPUP WITH LOGO, XYZ ACCOMPLISHMENT & FILTER CTA -->
          <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left font-body">
            <div class="flex items-center gap-3 pb-2.5 mb-2.5 border-b border-gray-100">
              ${logoHTML}
              <div class="min-w-0 flex-1">
                <h4 class="font-heading text-base font-bold text-charcoal truncate">${skill.name}</h4>
                <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded inline-block mt-0.5">${skill.meta}</span>
              </div>
            </div>
            <p class="text-xs text-ashGray leading-relaxed mb-2.5">${skill.exp}</p>
            <div class="pt-2 border-t border-gray-100 flex items-center justify-between font-code text-[10px] text-trustBlue font-semibold">
              <span>Click pill to filter Projects &amp; Experience &rarr;</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cellEl.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-code text-xs font-semibold text-trustBlue uppercase tracking-wider">${cat.metaTag}</span>
          <span class="font-code text-xs text-mutedSlate">${cat.skills.length} Skills</span>
        </div>
        <h3 class="font-heading text-lg font-bold text-charcoal">${cat.name}</h3>
        <p class="font-body text-xs text-mutedSlate">${cat.subtitle}</p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        ${skillPillsHTML}
      </div>
    `;

    container.appendChild(cellEl);

    cellEl.querySelectorAll('.skill-pill-btn').forEach((pillEl) => {
      bindDynamicPopup(pillEl);
      pillEl.addEventListener('click', (e) => {
        if (isTouchDevice() && !pillEl.classList.contains('touch-open')) return;
        const filterVal = pillEl.getAttribute('data-filter');
        applySkillFilter(filterVal);
      });
    });
  });
}


/* ==========================================================================
   4. EXPERIENCES & LIVE INTERACTIVE PROJECT CARDS (Preserving User Wording)
   ========================================================================== */
const workFlowchartData = [
  {
    year: "2022",
    isProjectCard: true,
    title: "Biometric Pulse Telemetry System (Heartbeat Sensor)",
    category: "Embedded Hardware & Telemetry Project",
    meta: "2022 · Embedded IoT Hardware",
    mediaType: "image",
    imageSrc: "assets/images/heartbeat-sensor.jpg",
    githubUrl: "https://github.com/syedmudassir04",
    sandboxKey: "biometric",
    tags: ["Arduino Uno", "Python", "Sensors", "IoT"],
    star: {
      s: "Continuous physiological heart-rate monitoring required capturing low-voltage analog pulse signals and displaying real-time BPM without expensive clinical hardware.",
      t: "Design and prototype an end-to-end embedded telemetry circuit capable of sampling, filtering, and visualizing live heartbeats.",
      a: "Interfaced a PPG pulse sensor with an Arduino Uno on a solderless breadboard using MM/FF/MF jumper pins, drove a digital screen module, and ingested serial streams into Python.",
      r: "Delivered a responsive, real-time biometric monitor producing clean digital BPM readouts and logged Python telemetry streams."
    },
    stackUsed: [
      { item: "Arduino Uno", purpose: "Sampled analog PPG voltage signals at millisecond intervals and computed real-time inter-beat intervals." },
      { item: "Pulse Sensor & Breadboard", purpose: "Captured non-invasive optical blood-volume pulse waveforms on a modular breadboard circuit." },
      { item: "MM, FF & MF Jumper Pins", purpose: "Routed power, ground, and analog/digital signal lines across sensor, microcontroller, and display rails." },
      { item: "Digital Screen Module", purpose: "Rendered instantaneous heart-rate (BPM) and threshold status directly on the hardware unit." },
      { item: "Python", purpose: "Ingested serial port telemetry streams for host-side signal smoothing and historical BPM logging." }
    ]
  },
  {
    year: "2022",
    isProjectCard: true,
    title: "Progressive Workout & Volume Analytics Application",
    category: "Fitness State & Analytics Engineering",
    meta: "2022 · Application Engineering",
    mediaType: "code",
    appLogoText: "WT // APP",
    codeSnippet: `const logWorkout = (set) => ({\n  exercise: set.name,\n  volume: set.reps * set.weight,\n  progressed: set.volume > prevMax\n});`,
    githubUrl: "https://github.com/syedmudassir04",
    tags: ["JavaScript", "HTML5", "CSS3", "VS Code", "Git"],
    star: {
      s: "Manual workout notes made it difficult to track cumulative training volume (reps × weight) and verify progressive overload across weeks.",
      t: "Build a fast, distraction-free application that logs sets and automatically computes session-over-session volume progression.",
      a: "Engineered a responsive HTML5/CSS3 interface backed by modular ES6+ JavaScript state logic and local storage persistence.",
      r: "Eliminated manual volume math and provided instant visual feedback on personal records and strength progression."
    },
    stackUsed: [
      { item: "JavaScript (ES6+)", purpose: "Computed real-time exercise volume (reps × weight) and flagged progressive-overload personal records." },
      { item: "HTML5 & CSS3", purpose: "Structured a mobile-responsive, high-contrast workout logging interface for rapid between-set entry." },
      { item: "Local State Persistence", purpose: "Stored historical workout sessions locally to chart multi-week strength trends." }
    ]
  },
  {
    year: "2023",
    isProjectCard: true,
    title: "YOLOv8 Vision Fall Detection & Emergency Alert System",
    category: "Computer Vision & Automated Safety Pipeline",
    meta: "2023 · Computer Vision & Alert Automation",
    mediaType: "image",
    imageSrc: "assets/images/fall-detection.jpg",
    githubUrl: "https://github.com/syedmudassir04",
    tags: ["Python", "YOLOv8", "OpenCV", "Twilio API", "Pygame"],
    star: {
      s: "Unattended falls among elderly or vulnerable individuals require immediate detection and caregiver notification without relying on wearable buttons.",
      t: "Engineer a contactless, real-time computer vision safety pipeline that detects falls from live video feeds and dispatches instant alerts.",
      a: "Combined OpenCV video stream decoding with Ultralytics YOLOv8 human bounding-box posture tracking, triggered local Pygame audio alarms, and integrated the Twilio API for automated SMS dispatch.",
      r: "Achieved sub-second fall anomaly recognition and automated SMS caregiver notifications alongside immediate on-site alarm feedback."
    },
    stackUsed: [
      { item: "Python", purpose: "Orchestrated the real-time video capture, deep-learning inference, local alarm, and cloud SMS alert pipeline." },
      { item: "Ultralytics YOLOv8", purpose: "Performed real-time human detection and bounding-box aspect-ratio analysis to classify sudden posture collapses." },
      { item: "OpenCV (cv2)", purpose: "Decoded live camera frames, normalized resolutions, and rendered real-time telemetry bounding boxes." },
      { item: "Twilio API", purpose: "Dispatched automated emergency SMS alerts with incident timestamps to designated contacts upon fall confirmation." },
      { item: "Pygame", purpose: "Triggered low-latency local audible sirens and visual alert states during emergency events." }
    ]
  },
  {
    year: "2023",
    isProjectCard: false,
    title: "Web Development Internship — Cognifyz Technologies Pvt Ltd",
    category: "Industry Internship · Full-Stack Web Engineering",
    meta: "2023 · Cognifyz Technologies Pvt Ltd",
    mediaType: "image",
    imageSrc: "assets/images/web-dev-internship.jpg",
    tags: ["HTML5", "CSS3", "JavaScript", "PHP", "Google Drive", "VS Code"],
    star: {
      s: "Client-facing web modules at Cognifyz Technologies required responsive multi-device layouts, interactive form validation, and dynamic backend processing.",
      t: "Develop, test, and deliver production-ready frontend and PHP server-side web components within agile internship sprints.",
      a: "Built semantic HTML5 and CSS3 layouts, scripted JavaScript DOM validation handlers, wrote PHP backend controllers, and organized versioned deliverables via Google Drive.",
      r: "Shipped cross-browser compatible web modules on schedule while maintaining clean, reusable code standards."
    },
    stackUsed: [
      { item: "HTML5 & CSS3", purpose: "Built semantic, mobile-responsive page layouts and reusable UI components." },
      { item: "JavaScript", purpose: "Implemented interactive client-side validation and dynamic DOM state updates." },
      { item: "PHP", purpose: "Handled server-side form requests, session logic, and dynamic content rendering." },
      { item: "Google Drive", purpose: "Managed versioned design assets, code handoffs, and collaborative internship documentation." }
    ]
  },
  {
    year: "2024",
    isProjectCard: false,
    title: "Data Science Internship — Faalih Consulting Services",
    category: "Industry Internship · Statistical Modeling & EDA",
    meta: "2024 · Faalih Consulting Services",
    mediaType: "image",
    imageSrc: "assets/images/data-science-internship.jpg",
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "Google Colab", "Anaconda", "VS Code", "Google Drive"],
    star: {
      s: "Raw consulting datasets at Faalih Consulting Services contained missing records, unscaled variables, and hidden statistical patterns that needed executive clarity.",
      t: "Perform end-to-end exploratory data analysis (EDA), statistical hypothesis validation, and visual storytelling to guide consulting decisions.",
      a: "Cleaned and wrangled datasets using Python, Pandas, and NumPy in Jupyter/Colab and Anaconda, ran inferential statistical audits, and designed Matplotlib/Seaborn visual reports stored in Google Drive.",
      r: "Transformed noisy raw logs into 100% validated analytical datasets and delivered visual insights that directly supported consulting recommendations."
    },
    stackUsed: [
      { item: "Python, Pandas & NumPy", purpose: "Cleaned raw multi-source datasets, imputed missing values, and engineered analytical features." },
      { item: "Statistics", purpose: "Applied descriptive and inferential statistical tests to validate hypotheses and detect outliers." },
      { item: "Matplotlib & Seaborn", purpose: "Created correlation heatmaps, distribution plots, and visual summaries for stakeholder reports." },
      { item: "Jupyter Notebook, Google Colab & Anaconda", purpose: "Maintained reproducible Python environments and collaborative analytical notebooks." },
      { item: "VS Code & Google Drive Data Storage", purpose: "Authored modular data-processing scripts and managed governed cloud dataset storage." }
    ]
  },
  {
    year: "2025",
    isProjectCard: true,
    title: "Cross-Platform Nutritional & Macro Intelligence Tracker",
    category: "Mobile Health Data Engineering & Multi-API Architecture",
    meta: "2025 · Flutter, SQLite & Multi-API Pipeline",
    mediaType: "image",
    imageSrc: "assets/images/nutritional-tracker.jpg",
    githubUrl: "https://github.com/syedmudassir04",
    tags: ["Flutter", "Dart", "SQLite", "Gemini API", "USDA API", "Git"],
    star: {
      s: "Logging daily calories, macronutrients, and micronutrients across packaged and whole foods is tedious when apps lack instant barcode scanning or offline persistence.",
      t: "Architect a cross-platform mobile application combining camera barcode scanning, verified global food APIs, local SQLite storage, and intelligent meal breakdown.",
      a: "Built the app in Flutter and Dart using Stateful Widgets/BLoC, integrated Barcode Scanner, Open Food Facts, USDA, and Gemini APIs, persisted logs in SQLite/SharedPreferences, and rendered trends with charts_flutter.",
      r: "Delivered a 60fps cross-platform nutrition tracker with one-tap barcode lookup, 100% offline history access, and automated macro analytics."
    },
    stackUsed: [
      { item: "Flutter, Dart & Flutter Engine", purpose: "Engineered a native-speed cross-platform mobile interface from a single reactive codebase." },
      { item: "Stateful Widget / BLoC Pattern", purpose: "Managed predictable state transitions across meal logs, macro targets, and asynchronous API calls." },
      { item: "USDA API & Open Food Facts API", purpose: "Fetched verified macro and micronutrient profiles across global packaged and whole foods via http." },
      { item: "Barcode Scanner API & permission_handler", purpose: "Enabled instant camera barcode food lookups with secure runtime device permission control." },
      { item: "SQLite & SharedPreferences", purpose: "Persisted offline meal logs, user targets, and dietary history locally on the device." },
      { item: "Gemini API", purpose: "Provided natural-language meal parsing and nutritional estimation for custom unlabelled dishes." },
      { item: "charts_flutter, intl & pub.dev", purpose: "Rendered interactive calorie/macro progression charts and localized date/unit formatting." }
    ]
  },
  {
    year: "2025",
    isProjectCard: true,
    title: "Epidemiological Disease Outbreak Predictor",
    category: "Ensemble Machine Learning & Public Health Forecasting",
    meta: "2025 · XGBoost, RandomForest & Dual-DB ETL",
    mediaType: "code",
    appLogoText: "EPI // ML",
    codeSnippet: `model = XGBClassifier()\nX_scaled = scaler.fit_transform(X_govt_data)\nmodel.fit(X_scaled, y_outbreak)\nrisk = model.predict_proba(region)[:, 1]`,
    githubUrl: "https://github.com/syedmudassir04",
    sandboxKey: "outbreak",
    tags: ["Python", "Scikit-Learn", "XGBoost", "Statsmodels", "PostgreSQL", "MongoDB", "ETL/ELT", "Twilio API", "Flutter", "MS Excel", "JavaScript"],
    star: {
      s: "Public health responses often lag behind emerging disease clusters because historical government surveillance records and real-time climate telemetry remain siloed.",
      t: "Build an end-to-end epidemiological forecasting pipeline that fuses government datasets, temperature sensor inputs, and ensemble machine learning to predict outbreak risk.",
      a: "Built ETL/ELT pipelines from MS Excel and government datasets into PostgreSQL and MongoDB, ingested temperature sensor streams, trained Scikit-Learn RandomForest and XGBoost models with fit_transform scaling, and wired Twilio/Flutter/JS alerts.",
      r: "Produced early regional outbreak probability forecasts with automated SMS risk alerting and mobile visualization."
    },
    stackUsed: [
      { item: "Python, Scikit-Learn, RandomForest & XGBoost", purpose: "Trained ensemble classification models with fit_transform feature scaling to forecast regional outbreak probabilities." },
      { item: "Statistics & Statsmodels", purpose: "Evaluated seasonal epidemiological correlations, p-values, and time-series risk factors." },
      { item: "Government Datasets, MS Excel & ETL/ELT", purpose: "Extracted, cleaned, and normalized historical public-health surveillance records." },
      { item: "PostgreSQL & MongoDB", purpose: "Stored structured regional surveillance tables in PostgreSQL and flexible sensor/log payloads in MongoDB." },
      { item: "Temperature Sensor", purpose: "Captured live ambient temperature telemetry to enrich climate-sensitive disease vector features." },
      { item: "Twilio API, Flutter & JS Automation", purpose: "Dispatched automated high-risk SMS alerts and updated mobile risk dashboards." }
    ]
  },
  {
    year: "2026",
    isProjectCard: true,
    title: "Data Governance Internship — Artificial Penetration Software Solutions Pvt Ltd",
    category: "Industry Internship · Enterprise Data Governance & Lakehouse",
    meta: "2026 · Artificial Penetration Software Solutions Pvt Ltd",
    mediaType: "image",
    imageSrc: "assets/images/data-governance-internship.jpg",
    githubUrl: "https://github.com/syedmudassir04",
    sandboxKey: "governance",
    tags: ["Databricks", "Unity Catalog", "Azure", "SQL", "MySQL", "Alembic", "ETL/ELT", "Power BI", "Plotly", "Bokeh", "Altair", "Matplotlib", "Seaborn", "Python", "Pandas", "NumPy", "SciPy", "Statsmodels", "Docker", "Git", "Prompt Engineering", "Stakeholder Communication", "Documentation", "JavaScript"],
    star: {
      s: "Enterprise data ecosystems at Artificial Penetration Software Solutions required strict schema governance, unified catalog lineage, automated ETL/ELT validation, and executive BI visibility.",
      t: "Architect governed relational and lakehouse schemas, automate migrations and quality pipelines, and deliver interactive dashboards aligned with stakeholder feedback.",
      a: "Administered Databricks Unity Catalog and Microsoft Azure storage, engineered full-spectrum SQL (DDL/DML/DQL/DCL/TCL, triggers, views, procedures, indexes) with Alembic migrations and Docker, automated Python/JS ETL pipelines, and built Power BI/Plotly/Bokeh/Altair dashboards.",
      r: "Established end-to-end data lineage, zero-downtime schema deployments, and executive dashboards refined through continuous stakeholder feedback."
    },
    stackUsed: [
      { item: "Databricks, Unity Catalog & Microsoft Azure", purpose: "Governed cloud lakehouse assets, access policies, metadata lineage, and enterprise storage on Azure." },
      { item: "SQL, MySQL & Schema Structure Design", purpose: "Engineered DDL, DQL, DML, DCL, and TCL statements alongside views, triggers, events, functions, indexes, and stored procedures." },
      { item: "Alembic, Seeding, Deployment & Security", purpose: "Managed version-controlled schema migrations, automated database seeding, production execution, and role security." },
      { item: "ETL / ELT, Python Automation & JS Automation", purpose: "Built automated ingestion, transformation, and data-quality validation pipelines." },
      { item: "Power BI, Plotly, Bokeh, Altair, Matplotlib & Seaborn", purpose: "Designed interactive executive dashboards and multi-layered visual analytics." },
      { item: "Python, Pandas, NumPy, SciPy, Statsmodels & Statistics", purpose: "Conducted deep statistical auditing, anomaly detection, and data profiling in VS Code, Anaconda & Jupyter." },
      { item: "Docker, Git, Git Bash & GitHub", purpose: "Containerized data services and maintained strict version control across engineering repositories." },
      { item: "AI & Prompt Engineering", purpose: "Accelerated metadata documentation, SQL query optimization, and automated governance auditing." },
      { item: "Google Workspace & Stakeholder Communication", purpose: "Authored technical documentation, reports, and presentations in Sheets/Docs/Slides, incorporating stakeholder feedback for continuous improvisations." }
    ]
  },
  {
    year: "2026+",
    isProjectCard: false,
    title: "Are You Next ?",
    category: "Future High-Impact Collaboration",
    meta: "2026 - Present · Ready to Deploy",
    mediaType: "none",
    tags: ["Python", "SQL", "Databricks", "Power BI", "Azure"],
    star: {
      s: "Organizations building high-impact products face growing complexity across raw data ingestion, schema governance, and executive analytics.",
      t: "Bring on a dedicated, steady Data Analyst / Aspiring Data Engineer who turns noisy data ecosystems into reliable, purpose-driven decisions.",
      a: "Combine full-spectrum SQL/Python/Azure/Databricks engineering, rigorous governance discipline, and clear stakeholder communication.",
      r: "Empower your team with trustworthy data pipelines and actionable intelligence from day one."
    },
    isNextCTA: true,
    stackUsed: [
      { item: "End-to-End Data Engineering & Analytics", purpose: "From raw ETL/ELT ingestion and governed SQL/Lakehouse schemas to executive Power BI and Python dashboards." },
      { item: "Resilience & Crisis Composure", purpose: "Methodical documentation and calm, clear-headed execution under tight production timelines." },
      { item: "Stakeholder-First Collaboration", purpose: "Translating complex technical architectures into accurate, purpose-driven business outcomes." }
    ]
  }
];

function itemMatchesSkillFilter(item) {
  if (!activeSkillFilter) return true;
  const target = activeSkillFilter.toLowerCase();
  const inTags = (item.tags || []).some(t => t.toLowerCase().includes(target) || target.includes(t.toLowerCase()));
  const inStack = (item.stackUsed || []).some(s => s.item.toLowerCase().includes(target) || s.purpose.toLowerCase().includes(target));
  return inTags || inStack;
}

function buildMediaPreviewHTML(item) {
  if (item.mediaType === "image") {
    return `
      <div class="w-full h-36 mb-3 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center">
        <img src="${item.imageSrc}" alt="${item.title}" class="w-full h-full object-cover" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="hidden absolute inset-0 flex-col items-center justify-center p-3 text-center bg-gray-50">
          <span class="font-code text-[10px] text-trustBlue uppercase">Image Ready</span>
          <span class="font-code text-[10px] text-mutedSlate mt-0.5">${item.imageSrc}</span>
        </div>
      </div>
    `;
  }

  if (item.mediaType === "code") {
    return `
      <div class="w-full mb-3 rounded-lg bg-charcoal text-white p-3 border border-slate-800 space-y-2">
        <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span class="font-code text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded">${item.appLogoText}</span>
          <span class="font-code text-[10px] text-slate-400">source_preview.py</span>
        </div>
        <pre class="font-code text-[10px] text-slate-200 overflow-x-auto leading-relaxed"><code>${item.codeSnippet}</code></pre>
      </div>
    `;
  }

  return '';
}

// Render Live Interactive Project Cards Grid (Image 5 & Image 6 #2)
function initProjectsGrid() {
  const container = document.getElementById('projects-cards-grid');
  if (!container) return;
  container.innerHTML = '';

  const projectItems = workFlowchartData.filter(item => item.isProjectCard && itemMatchesSkillFilter(item));

  if (projectItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 border border-gray-200 rounded-2xl text-center space-y-3">
        <p class="font-heading text-lg font-bold text-charcoal">No project cards match "${activeSkillFilter}" directly — check the Experience timeline below or reset the filter.</p>
        <button onclick="clearSkillFilter()" class="font-code text-xs bg-trustBlue text-white px-4 py-2 rounded-lg cursor-pointer">Show All Projects</button>
      </div>
    `;
    return;
  }

  projectItems.forEach((item) => {
    const mediaHTML = buildMediaPreviewHTML(item);
    const tagsHTML = (item.tags || []).slice(0, 6).map(tag => `
      <span onclick="event.stopPropagation(); applySkillFilter('${tag}')"
            class="font-code text-[10px] bg-gray-100 hover:bg-blue-50 text-charcoal hover:text-trustBlue px-2 py-0.5 rounded cursor-pointer transition-colors">
        ${tag}
      </span>
    `).join('');

    const sandboxBtnHTML = item.sandboxKey ? `
      <button onclick="event.stopPropagation(); renderSandboxChart('${item.sandboxKey}'); document.getElementById('plotly-sandbox-chart').scrollIntoView({behavior:'smooth', block:'center'});"
              class="font-code text-xs text-trustBlue hover:underline font-medium cursor-pointer">
        Live Chart Demo &darr;
      </button>
    ` : '';

    const cardEl = document.createElement('div');
    cardEl.className = 'p-5 rounded-2xl border border-gray-200 bg-white hover:border-trustBlue transition-all shadow-2xs hover:shadow-lg flex flex-col justify-between space-y-4 cursor-pointer';
    cardEl.addEventListener('click', () => openExperienceModal(item));

    cardEl.innerHTML = `
      <div class="space-y-3">
        ${mediaHTML}
        <div class="flex items-center justify-between gap-2">
          <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${item.meta}</span>
          <span class="font-code text-[10px] text-mutedSlate">Click for Architecture &nearr;</span>
        </div>
        <h3 class="font-heading text-lg font-bold text-charcoal leading-snug">${item.title}</h3>
        <div class="space-y-1 font-body text-xs text-ashGray leading-relaxed">
          <p><strong class="text-charcoal font-semibold">Problem:</strong> ${item.star.s}</p>
          <p><strong class="text-charcoal font-semibold">Architecture:</strong> ${item.star.a}</p>
          <p><strong class="text-trustBlue font-semibold">Impact:</strong> ${item.star.r}</p>
        </div>
      </div>

      <div class="space-y-3 pt-3 border-t border-gray-100">
        <div class="flex flex-wrap gap-1.5">
          ${tagsHTML}
        </div>
        <div class="flex items-center justify-between pt-1">
          <button onclick="event.stopPropagation(); openExperienceModal_ByTitle('${item.title.replace(/'/g, "\\'")}')"
                  class="font-code text-xs font-semibold text-charcoal hover:text-trustBlue transition-colors cursor-pointer">
            Inspect Full Stack &rarr;
          </button>
          <div class="flex items-center gap-3">
            ${sandboxBtnHTML}
            <a href="${item.githubUrl || 'https://github.com/syedmudassir04'}" target="_blank" rel="noopener" onclick="event.stopPropagation()"
               class="font-code text-xs text-mutedSlate hover:text-charcoal flex items-center gap-1">
              <i class="devicon-github-original"></i>
              <span>Code &nearr;</span>
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(cardEl);
  });
}

function openExperienceModal_ByTitle(titleStr) {
  const found = workFlowchartData.find(x => x.title === titleStr);
  if (found) openExperienceModal(found);
}

function openExperienceModal(item) {
  const starBannerHTML = `
    <div class="pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200/80">
      <div class="space-y-1">
        <span class="font-code text-[10px] text-trustBlue uppercase tracking-wider">Situation</span>
        <p class="font-body text-xs text-ashGray leading-relaxed">${item.star.s}</p>
      </div>
      <div class="space-y-1">
        <span class="font-code text-[10px] text-trustBlue uppercase tracking-wider">Task</span>
        <p class="font-body text-xs text-ashGray leading-relaxed">${item.star.t}</p>
      </div>
      <div class="space-y-1">
        <span class="font-code text-[10px] text-trustBlue uppercase tracking-wider">Action</span>
        <p class="font-body text-xs text-ashGray leading-relaxed">${item.star.a}</p>
      </div>
      <div class="space-y-1">
        <span class="font-code text-[10px] text-trustBlue uppercase tracking-wider">Result</span>
        <p class="font-body text-xs text-charcoal font-medium leading-relaxed">${item.star.r}</p>
      </div>
    </div>
  `;

  const stackRowsHTML = (item.stackUsed || []).map((row) => `
    <div class="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
      <div class="md:col-span-4 flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-trustBlue shrink-0"></span>
        <span class="font-code text-xs font-semibold text-charcoal bg-gray-100 px-2.5 py-1 rounded">${row.item}</span>
      </div>
      <div class="md:col-span-8 font-body text-xs sm:text-sm text-ashGray leading-relaxed">
        ${row.purpose}
      </div>
    </div>
  `).join('');

  openInspectionModal({
    meta: item.meta,
    title: item.title,
    subtitle: item.category,
    bodyHTML: `${starBannerHTML}<div class="pt-4 divide-y divide-gray-100">${stackRowsHTML}</div>`,
    footerText: `STAR Execution Summary + ${(item.stackUsed || []).length} Technologies Mapped`,
    externalUrl: item.githubUrl || null
  });
}

function initWorkFlowchart() {
  const container = document.getElementById('work-flowchart-nodes');
  if (!container) return;
  container.innerHTML = '';

  workFlowchartData.forEach((item, index) => {
    const isLeft = index % 2 === 0;
    const isMatch = itemMatchesSkillFilter(item);
    const mediaHTML = buildMediaPreviewHTML(item);

    const rowEl = document.createElement('div');
    rowEl.className = `relative flex flex-col md:flex-row items-center justify-between w-full transition-opacity duration-300 ${isMatch ? 'opacity-100' : 'opacity-25'}`;

    const nodeBoxHTML = `
      <div class="node-group relative w-full md:w-[42%] cursor-pointer group hover:z-50 ${isLeft ? 'md:text-right' : 'md:text-left'}">
        
        <!-- FIXED-WIDTH STAR HOVER POPUP CARD -->
        <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
          ${mediaHTML}
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${item.meta}</span>
            <span class="font-code text-[10px] text-trustBlue font-medium">Click for Full STAR &nearr;</span>
          </div>
          <h4 class="font-heading text-sm font-bold text-charcoal mb-1.5">${item.title}</h4>
          <div class="space-y-1 font-body text-[11px] text-ashGray leading-relaxed">
            <p><strong class="text-charcoal font-semibold">S/T:</strong> ${item.star.s}</p>
            <p><strong class="text-charcoal font-semibold">Action:</strong> ${item.star.a}</p>
            <p><strong class="text-trustBlue font-semibold">Result:</strong> ${item.star.r}</p>
          </div>
        </div>

        <!-- AESTHETIC BLENDED ITEM -->
        <div class="py-1.5 transition-transform duration-200 ${isLeft ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}">
          <span class="font-code text-xs ${item.isNextCTA ? 'text-trustBlue font-semibold' : 'text-mutedSlate'} block">
            ${item.category}
          </span>
          <h3 class="font-heading text-xl font-bold ${
            item.isNextCTA ? 'text-trustBlue' : 'text-charcoal group-hover:text-trustBlue'
          } transition-colors mt-0.5">
            ${item.title}
          </h3>
        </div>
      </div>
    `;

    const emptySpacerHTML = `<div class="hidden md:block md:w-[42%]"></div>`;

    const centerTimelineTickHTML = `
      <div class="hidden md:flex items-center justify-center relative z-20 w-[16%]">
        <div class="w-4 h-[1.5px] bg-gray-300 ${isLeft ? 'mr-2' : 'order-last ml-2'}"></div>
        <span class="font-code text-xs px-2 py-0.5 bg-alabaster ${
          item.isNextCTA ? 'text-trustBlue font-bold' : 'text-mutedSlate'
        }">
          ${item.year}
        </span>
      </div>
    `;

    if (isLeft) {
      rowEl.innerHTML = `${nodeBoxHTML}${centerTimelineTickHTML}${emptySpacerHTML}`;
    } else {
      rowEl.innerHTML = `${emptySpacerHTML}${centerTimelineTickHTML}${nodeBoxHTML}`;
    }

    const triggerGroup = rowEl.querySelector('.node-group');
    triggerGroup.addEventListener('click', () => openExperienceModal(item));
    bindDynamicPopup(triggerGroup, { alwaysTriggerClickOnTouch: true });
    container.appendChild(rowEl);
  });
}


/* ==========================================================================
   5. INTERACTIVE PLOTLY.JS SANDBOX (Image 6 Recommendation #5)
   ========================================================================== */
let currentSandboxTab = 'outbreak';

function renderSandboxChart(tabKey) {
  currentSandboxTab = tabKey;
  const chartContainer = document.getElementById('plotly-sandbox-chart');
  if (!chartContainer || typeof Plotly === 'undefined') return;

  // Update active button state
  ['outbreak', 'governance', 'biometric'].forEach((k) => {
    const btn = document.getElementById(`sandbox-btn-${k}`);
    if (!btn) return;
    if (k === tabKey) {
      btn.className = 'sandbox-tab font-code text-xs px-3 py-1.5 rounded-lg bg-trustBlue text-white font-medium transition-colors cursor-pointer';
    } else {
      btn.className = 'sandbox-tab font-code text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-charcoal hover:border-trustBlue transition-colors cursor-pointer';
    }
  });

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  const paperBg = isDark ? '#1E293B' : '#FFFFFF';

  let traces = [];
  let layoutTitle = '';

  if (tabKey === 'outbreak') {
    layoutTitle = 'Epidemiological Outbreak Predictor — XGBoost Probability vs. Ambient Temp Telemetry';
    traces = [
      {
        x: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
        y: [0.14, 0.19, 0.28, 0.46, 0.72, 0.84, 0.61, 0.33],
        name: 'XGBoost Outbreak Risk Score',
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#2563EB', width: 3 },
        marker: { size: 8 }
      },
      {
        x: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
        y: [0.70, 0.70, 0.70, 0.70, 0.70, 0.70, 0.70, 0.70],
        name: 'Twilio SMS Alert Threshold (0.70)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#EF4444', width: 2, dash: 'dash' }
      }
    ];
  } else if (tabKey === 'governance') {
    layoutTitle = 'Enterprise Data Governance — Schema Completeness & Validation Pass Rate (%)';
    traces = [
      {
        x: ['Raw Bronze Ingestion', 'Alembic DDL Schema', 'Silver Cleaned ETL', 'Unity Catalog Gold'],
        y: [74.2, 91.5, 98.4, 99.9],
        name: 'Schema Validation Pass %',
        type: 'bar',
        marker: { color: ['#94A3B8', '#60A5FA', '#3B82F6', '#2563EB'] }
      }
    ];
  } else {
    layoutTitle = 'Arduino Uno PPG Heartbeat Sensor — Raw Voltage vs. Python Smoothed BPM Telemetry';
    traces = [
      {
        x: ['0.0s', '0.5s', '1.0s', '1.5s', '2.0s', '2.5s', '3.0s', '3.5s'],
        y: [71, 74, 79, 75, 73, 76, 74, 72],
        name: 'Raw Sensor BPM',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#94A3B8', width: 2, dash: 'dot' }
      },
      {
        x: ['0.0s', '0.5s', '1.0s', '1.5s', '2.0s', '2.5s', '3.0s', '3.5s'],
        y: [72, 73.2, 75.1, 74.8, 74.0, 74.6, 74.2, 73.5],
        name: 'Python Smoothed BPM',
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#2563EB', width: 3 }
      }
    ];
  }

  const layout = {
    title: { text: layoutTitle, font: { family: 'Space Grotesk, sans-serif', size: 13, color: textColor } },
    paper_bgcolor: paperBg,
    plot_bgcolor: paperBg,
    font: { family: 'Fira Code, monospace', size: 11, color: textColor },
    margin: { t: 42, r: 20, b: 38, l: 45 },
    xaxis: { gridcolor: gridColor },
    yaxis: { gridcolor: gridColor },
    legend: { orientation: 'h', y: -0.2 }
  };

  Plotly.react(chartContainer, traces, layout, { responsive: true, displayModeBar: false });
}


/* ==========================================================================
   6. GMAIL CONTACT FORM DISPATCH (syedmudassir24177@gmail.com)
   ========================================================================== */
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  const formData = new FormData(form);
  submitBtn.disabled = true;
  submitBtn.textContent = "Dispatching...";
  feedback.textContent = "Routing message to syedmudassir24177@gmail.com...";
  feedback.className = "font-code text-xs text-trustBlue font-medium";

  try {
    const response = await fetch("https://formsubmit.co/ajax/syedmudassir24177@gmail.com", {
      method: "POST",
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (response.ok) {
      feedback.textContent = "Message delivered to syedmudassir24177@gmail.com!";
      feedback.className = "font-code text-xs text-emerald-600 font-semibold";
      form.reset();
    } else {
      throw new Error("Fallback to mailto");
    }
  } catch (err) {
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const affiliation = formData.get('affiliation') || 'N/A';
    const subject = encodeURIComponent(formData.get('subject') || 'Opportunity / Collaboration');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nAffiliation: ${affiliation}\n\n${formData.get('message') || ''}`
    );
    window.location.href = `mailto:syedmudassir24177@gmail.com?subject=${subject}&body=${body}`;
    feedback.textContent = "Opened email client for syedmudassir24177@gmail.com.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Send Message &rarr;";
  }
}

window.addEventListener('load', () => {
  initTheme();
  initTraitsGrid();
  initKnowledgeBaseLine();
  initSkillsMatrix();
  initProjectsGrid();
  initWorkFlowchart();
  setTimeout(() => renderSandboxChart('outbreak'), 250);
});