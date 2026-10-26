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

function openInspectionModal({ meta, title, subtitle, bodyHTML, footerText, externalUrl, externalLabel }) {
  closeAllTouchPopups();
  modalMeta.textContent = meta;
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
  modalBody.innerHTML = bodyHTML;
  modalFooterCount.textContent = footerText || 'Click any item row to expand its topics in depth';

  if (externalUrl) {
    modalExternalLink.href = externalUrl;
    modalExternalLink.innerHTML = `${externalLabel || 'Open Repository / Link'} &nearr;`;
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
   2. MY KNOWLEDGE (Relevant Coursework Inside Verified Certificates)
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
    desc: "Core topics learnt: Discrete and continuous probability distributions, skewness/kurtosis, Karl Pearson and Spearman correlation, linear regression, and Z/t/F/Chi-Square hypothesis testing.",
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
    name: "Software Testing Methodologies (Path/Dataflow Testing, Domain & Logic Testing)",
    desc: "Core topics learnt: Software bug taxonomy, control-flow and path testing, transaction/dataflow testing, domain boundary analysis, logic decision tables, and state-graph testing.",
    topics: ["Unit I — Dichotomies of Testing, Bug Taxonomy, Control Flow Graphs (CFG) & Path Testing", "Unit II — Transaction Flow Testing & Dataflow Testing Strategies", "Unit III — Domain Testing (Boundary Value Analysis) & Path Products / Regular Expressions", "Unit IV — Logic-Based Testing (Decision Tables, KV Charts) & State-Graph Transition Testing", "Unit V — Graph Matrices & Automated Functional / Regression Verification"]
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
      },
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
        detail: "Core topics learnt: Agile Scrum and Waterfall SDLC, UML system modeling, control-flow/dataflow path testing, domain boundary testing, and logic-based decision table verification.",
        topics: ["Agile Scrum, Waterfall SDLC, SRS & UML Diagrams", "Control-Flow Path Testing, Dataflow & Domain Boundary Testing", "Logic-Based Decision Tables, State Graphs & Functional Regression Verification"]
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
    externalUrl: course.url || null,
    externalLabel: 'Open Course Link'
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
      <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${node.meta}</span>
          <span class="font-code text-[10px] text-trustBlue font-medium">Click for Subjects &nearr;</span>
        </div>
        <h3 class="font-heading text-base font-bold text-charcoal leading-snug mb-1">${node.title}</h3>
        <p class="font-body text-xs text-ashGray leading-relaxed">${node.description}</p>
      </div>

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
   3. MY SKILLS (3x3 Symmetrical Grid · Consumer Metadata · 1-Sentence Info)
   ========================================================================== */
const skillCategories = [
  {
    name: "Technical Languages",
    metaTag: "Core Coding & Querying",
    subtitle: "Core coding and database languages used to write software, build websites, and manage data.",
    skills: [
      { name: "Python", filterKey: "Python", icon: "devicon-python-plain colored", meta: "Data Science & Automation Language", exp: "A versatile programming language I use to clean data, automate repetitive tasks, and run AI models." },
      { name: "SQL (DQL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Database Search & Reporting", exp: "The standard language used to search, filter, and pull specific reports from large company databases." },
      { name: "SQL (DML)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Database Record Updating", exp: "Commands used to safely add new records, update existing information, and clean outdated rows in a database." },
      { name: "SQL (DDL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Database Blueprint Design", exp: "Structural commands used to design and build the actual tables, views, and rules that hold company data." },
      { name: "SQL (DCL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Database Security & Permissions", exp: "Security controls used to grant or restrict who is allowed to view or edit sensitive database records." },
      { name: "SQL (TCL)", filterKey: "SQL", icon: "devicon-azuresqldatabase-plain colored", meta: "Database Transaction Safety", exp: "Safety checkpoints that ensure multi-step database updates either finish completely or roll back cleanly if an error occurs." },
      { name: "JavaScript", filterKey: "JavaScript", icon: "devicon-javascript-plain colored", meta: "Interactive Web Scripting", exp: "The programming language that makes websites interactive, responsive, and able to update without reloading the page." },
      { name: "Dart", filterKey: "Dart", icon: "devicon-dart-plain colored", meta: "Mobile App Language", exp: "A fast, modern programming language used to build smooth mobile apps for both Android and iOS." },
      { name: "HTML5", filterKey: "HTML5", icon: "devicon-html5-plain colored", meta: "Web Page Structure", exp: "The foundational markup code that defines the headings, text, forms, and layout blocks of a webpage." },
      { name: "CSS3", filterKey: "CSS3", icon: "devicon-css3-plain colored", meta: "Web Page Visual Styling", exp: "The styling language that controls colors, fonts, spacing, and mobile-friendly layouts on a website." },
      { name: "PHP", filterKey: "PHP", icon: "devicon-php-plain colored", meta: "Backend Web Scripting", exp: "A server-side language used to process web forms, manage user logins, and connect websites to databases." },
      { name: "C / C++", filterKey: "C++", icon: "devicon-cplusplus-plain colored", meta: "System & Hardware Programming", exp: "High-speed programming languages used to control computer memory, operating systems, and electronic sensors." },
      { name: "Java", filterKey: "Java", icon: "devicon-java-plain colored", meta: "Enterprise Software Language", exp: "A reliable, object-oriented language widely used to build large-scale business software and desktop tools." }
    ]
  },
  {
    name: "Python Libraries",
    metaTag: "Data Science & AI Packages",
    subtitle: "Pre-built Python toolkits used to clean spreadsheets, train AI models, and generate visual charts.",
    skills: [
      { name: "Pandas", filterKey: "Pandas", icon: "devicon-pandas-plain colored", meta: "Data Table & Spreadsheet Engine", exp: "A Python toolkit that loads messy spreadsheets and database tables so they can be cleaned, filtered, and merged in seconds." },
      { name: "NumPy", filterKey: "NumPy", icon: "devicon-numpy-plain colored", meta: "High-Speed Math & Arrays", exp: "A mathematical engine that performs fast calculations across millions of numbers and growth projections." },
      { name: "Scikit-Learn", filterKey: "Scikit-Learn", icon: "devicon-scikitlearn-plain colored", meta: "Predictive Machine Learning", exp: "A machine learning library used to train predictive models that forecast trends and classify outcomes." },
      { name: "XGBoost", filterKey: "XGBoost", icon: "devicon-python-plain colored", meta: "High-Accuracy Decision-Tree AI", exp: "An advanced forecasting algorithm that combines hundreds of decision trees to predict complex risks like disease outbreaks." },
      { name: "SciPy", filterKey: "SciPy", icon: "devicon-python-plain colored", meta: "Scientific & Signal Math", exp: "A scientific computing package used to smooth noisy sensor signals and run advanced engineering math." },
      { name: "Statsmodels", filterKey: "Statsmodels", icon: "devicon-python-plain colored", meta: "Statistical Forecasting & Audits", exp: "A statistical toolkit used to test business hypotheses, measure seasonal trends, and verify data reliability." },
      { name: "OpenCV", filterKey: "OpenCV", icon: "devicon-opencv-plain colored", meta: "Live Camera & Video Processing", exp: "A computer vision library that lets software read live webcam video feeds and draw tracking boxes on screen." },
      { name: "Ultralytics YOLOv8", filterKey: "YOLOv8", icon: "devicon-python-plain colored", meta: "Real-Time Object & Posture AI", exp: "A fast AI vision model that instantly recognizes people, postures, and furniture in live video streams." },
      { name: "Matplotlib", filterKey: "Matplotlib", icon: "devicon-matplotlib-plain colored", meta: "Custom Chart & Graph Builder", exp: "A plotting library used to turn raw numbers into clear bar charts, line graphs, and pie charts for reports." },
      { name: "Seaborn", filterKey: "Seaborn", icon: "devicon-python-plain colored", meta: "Statistical Heatmaps & Trends", exp: "A visualization library that creates clean statistical heatmaps and distribution curves to highlight market trends." },
      { name: "Plotly", filterKey: "Plotly", icon: "devicon-plotly-plain colored", meta: "Interactive Web Charts", exp: "A charting toolkit that builds interactive, zoomable graphs where users can hover over data points for details." },
      { name: "Bokeh", filterKey: "Bokeh", icon: "devicon-python-plain colored", meta: "Browser Data Dashboards", exp: "A visualization library designed to display large, interactive datasets smoothly inside a web browser." },
      { name: "Altair", filterKey: "Altair", icon: "devicon-python-plain colored", meta: "Declarative Statistical Charts", exp: "A concise charting tool used to quickly build clean statistical visuals for data governance audits." },
      { name: "Pygame", filterKey: "Pygame", icon: "devicon-python-plain colored", meta: "Audio & Alert Multimedia Engine", exp: "A multimedia library used to trigger immediate local audio alarms and voice notifications during emergency events." },
      { name: "Alembic", filterKey: "Alembic", icon: "devicon-python-plain colored", meta: "Database Version Upgrading", exp: "A database migration tool that safely upgrades company database tables without losing existing data." }
    ]
  },
  {
    name: "Tools",
    metaTag: "Developer & Prototyping Workspaces",
    subtitle: "Everyday software workspaces and prototyping instruments used to write code, track versions, and test systems.",
    skills: [
      { name: "VS Code", filterKey: "VS Code", icon: "devicon-vscode-plain colored", meta: "Primary Code Editor", exp: "The main desktop code editor I use daily to write, debug, and organize software and data scripts." },
      { name: "Anaconda", filterKey: "Anaconda", icon: "devicon-anaconda-original colored", meta: "Data Science Environment Manager", exp: "A package manager that keeps all Python data science libraries organized so projects run without software conflicts." },
      { name: "Jupyter Notebook", filterKey: "Jupyter", icon: "devicon-jupyter-plain colored", meta: "Interactive Data Notebook", exp: "An interactive document that combines live code, charts, and plain-English notes in one shareable report." },
      { name: "Google Colab", filterKey: "Google Colab", icon: "devicon-google-plain colored", meta: "Cloud Data Science Workspace", exp: "A cloud-based notebook workspace that runs Python data analysis and AI models directly in the browser." },
      { name: "Git", filterKey: "Git", icon: "devicon-git-plain colored", meta: "Code Version Tracker", exp: "A version-control system that tracks every change made to a codebase so teams can collaborate and undo mistakes." },
      { name: "Git Bash", filterKey: "Git", icon: "devicon-bash-plain", meta: "Command-Line Terminal", exp: "A terminal tool that brings Linux command-line speed and version-control commands to Windows computers." },
      { name: "Docker", filterKey: "Docker", icon: "devicon-docker-plain colored", meta: "Software Container Packaging", exp: "A tool that packages an application and all its settings into a portable container so it runs identically on any computer." },
      { name: "Cisco Packet Tracer", filterKey: "CCNA", icon: "badge", badgeText: "NET", meta: "Network Routing Simulator", exp: "A visual simulation tool used to design and test office computer networks, routers, and switches before buying hardware." },
      { name: "Arduino Uno", filterKey: "Arduino Uno", icon: "devicon-arduino-plain colored", meta: "Programmable Microcontroller Board", exp: "A compact circuit board that reads signals from physical sensors—like a heartbeat clip—and sends live data to a computer." }
    ]
  },
  {
    name: "Databases",
    metaTag: "Data Storage Engines",
    subtitle: "Structured and offline storage systems used to organize, save, and retrieve application and business data.",
    skills: [
      { name: "MySQL", filterKey: "MySQL", icon: "devicon-mysql-plain colored", meta: "Enterprise Relational Database", exp: "A widely used relational database that stores structured business records in linked, searchable tables." },
      { name: "PostgreSQL", filterKey: "PostgreSQL", icon: "devicon-postgresql-plain colored", meta: "Advanced Analytical Database", exp: "A powerful open-source database built to handle complex analytical queries and large public-health datasets reliably." },
      { name: "MongoDB", filterKey: "MongoDB", icon: "devicon-mongodb-plain colored", meta: "Flexible Document Database", exp: "A modern NoSQL database that stores unstructured logs and sensor readings as flexible JSON-style documents." },
      { name: "SQLite", filterKey: "SQLite", icon: "devicon-sqlite-plain colored", meta: "Lightweight Local Database", exp: "A self-contained database built directly into mobile and desktop apps so user workout and meal logs work offline." },
      { name: "SharedPreferences", filterKey: "SharedPreferences", icon: "badge", badgeText: "KV", meta: "On-Device App Storage", exp: "A fast mobile storage system that saves user profiles and daily nutrition diaries directly on a phone for instant offline access." }
    ]
  },
  {
    name: "APIs",
    metaTag: "Connected Data Services",
    subtitle: "External communication bridges that let applications send phone alerts, scan food barcodes, and talk to AI models.",
    skills: [
      { name: "Twilio API", filterKey: "Twilio API", icon: "badge", badgeText: "SMS", meta: "Automated Phone Call & SMS Service", exp: "A communication service that lets software automatically place emergency phone calls and send text alerts." },
      { name: "Gemini API", filterKey: "Gemini API", icon: "badge", badgeText: "AI", meta: "Google Conversational AI Service", exp: "An AI service connected to mobile apps to provide personalized meal advice and natural-language nutrition coaching." },
      { name: "USDA FoodData API", filterKey: "USDA API", icon: "badge", badgeText: "GOV", meta: "Official Nutrition Database Connector", exp: "A government data connector that fetches verified calorie, protein, carb, and vitamin counts for thousands of foods." },
      { name: "Open Food Facts API", filterKey: "Open Food APIs", icon: "badge", badgeText: "FOOD", meta: "Global Grocery Barcode Database", exp: "An open database connector that looks up nutrition labels for packaged supermarket products from around the world." },
      { name: "Barcode Scanner API", filterKey: "Barcode", icon: "badge", badgeText: "SCAN", meta: "Camera Barcode Reader", exp: "A mobile camera integration that scans product barcodes to log food items in a single tap." },
      { name: "RESTful APIs", filterKey: "REST", icon: "devicon-fastapi-plain colored", meta: "Standard Web Data Connector", exp: "The universal web standard that allows mobile apps, websites, and backend servers to exchange data securely." }
    ]
  },
  {
    name: "Frameworks",
    metaTag: "App & Web Foundations",
    subtitle: "Modern software blueprints used to build fast mobile apps, interactive websites, and backend servers.",
    skills: [
      { name: "Flutter", filterKey: "Flutter", icon: "devicon-flutter-plain colored", meta: "Cross-Platform Mobile App Toolkit", exp: "Google's UI toolkit used to build fast, 60-FPS mobile applications for both Android and iOS from a single codebase." },
      { name: "React", filterKey: "React", icon: "devicon-react-original colored", meta: "Interactive Web UI Library", exp: "A popular web framework used to build fast, modular user interfaces out of reusable screen components." },
      { name: "Redux", filterKey: "Redux", icon: "devicon-redux-original colored", meta: "Application State Manager", exp: "A data-flow manager that keeps information synchronized across every screen of a complex web application." },
      { name: "Node.js", filterKey: "Node.js", icon: "devicon-nodejs-plain colored", meta: "JavaScript Backend Runtime", exp: "A server environment that runs JavaScript on the backend to handle user requests and database connections." },
      { name: "Express.js", filterKey: "Express", icon: "devicon-express-original", meta: "Web Server Routing Framework", exp: "A lightweight backend framework for Node.js that organizes web routes, security middleware, and API endpoints." },
      { name: "Tailwind CSS", filterKey: "CSS3", icon: "devicon-tailwindcss-original colored", meta: "Modern UI Design System", exp: "A utility-first styling framework used to build clean, responsive, dark-and-light-mode web interfaces rapidly." }
    ]
  },
  {
    name: "IaaS & PaaS",
    metaTag: "Cloud Compute, Lakehouse & Hosting",
    subtitle: "Cloud infrastructure and managed platforms used to host websites, store big data, and govern enterprise pipelines.",
    skills: [
      { name: "Microsoft Azure", filterKey: "Azure", icon: "devicon-azure-plain colored", meta: "Enterprise Cloud Infrastructure (IaaS)", exp: "Microsoft's cloud platform used to rent virtual servers, secure networks, and scalable enterprise data storage." },
      { name: "Linux", filterKey: "Linux", icon: "devicon-linux-plain", meta: "Server Operating System (IaaS)", exp: "The industry-standard operating system that powers cloud servers, data pipelines, and secure development environments." },
      { name: "Databricks", filterKey: "Databricks", icon: "badge", badgeText: "DBX", meta: "Cloud Data Lakehouse Platform (PaaS)", exp: "A unified cloud platform where data engineers process massive datasets and run collaborative analytics." },
      { name: "Unity Catalog", filterKey: "Unity Catalog", icon: "badge", badgeText: "UC", meta: "Cloud Data Governance Engine (PaaS)", exp: "A central governance tool in Databricks that tracks data lineage and controls who can access cloud tables." },
      { name: "Vercel", filterKey: "Vercel", icon: "devicon-vercel-original", meta: "Automated Web Hosting Platform (PaaS)", exp: "A cloud hosting platform that automatically publishes live, high-speed websites whenever code is updated." },
      { name: "GitHub Pages & Pub.dev", filterKey: "Git", icon: "devicon-github-original", meta: "Code Hosting & Package Registry (PaaS)", exp: "Cloud platforms used to host live web portfolios, manage open-source code repositories, and pull verified app packages." }
    ]
  },
  {
    name: "Software as a Service (SaaS)",
    metaTag: "Business, BI & Cloud Apps",
    subtitle: "Ready-to-use cloud business applications used for customer management, executive dashboards, and team collaboration.",
    skills: [
      { name: "Power BI", filterKey: "Power BI", icon: "badge", badgeText: "PBI", meta: "Executive Business Intelligence App", exp: "Microsoft's analytics software used to turn company databases into interactive visual dashboards for leadership." },
      { name: "Salesforce", filterKey: "Salesforce", icon: "devicon-salesforce-plain colored", meta: "Enterprise Customer CRM Cloud", exp: "The world's leading cloud CRM platform used to manage customer records, automate workflows, and enforce data rules." },
      { name: "Google Drive", filterKey: "Google Drive", icon: "devicon-googlecloud-plain colored", meta: "Cloud Dataset & File Storage", exp: "Cloud storage used to securely organize, back up, and share datasets and project deliverables across teams." },
      { name: "Google Sheets", filterKey: "Google Sheets", icon: "badge", badgeText: "SHT", meta: "Collaborative Cloud Spreadsheets", exp: "Online spreadsheets used for real-time team data tracking, quick pivot audits, and shared reporting." },
      { name: "Google Docs & Slides", filterKey: "Documentation", icon: "badge", badgeText: "DOC", meta: "Cloud Documentation & Presentations", exp: "Collaborative cloud apps used to write technical documentation and present visual findings to stakeholders." },
      { name: "MS Excel", filterKey: "MS Excel", icon: "badge", badgeText: "XLS", meta: "Industry Spreadsheet & Pivot Suite", exp: "The standard business spreadsheet software used to audit raw tables, run formulas, and prepare data for analysis." }
    ]
  },
  {
    name: "Soft Skills",
    metaTag: "Workplace & Leadership Strengths",
    subtitle: "Interpersonal and communication strengths used to align teams, explain technical insights, and deliver on time.",
    skills: [
      { name: "Stakeholder Communication", filterKey: "Stakeholder Communication", icon: "badge", badgeText: "SYNC", meta: "Client & Leadership Alignment", exp: "Listening to business leaders' feedback and translating their needs into clear dashboard and data improvements." },
      { name: "Technical Documentation", filterKey: "Documentation", icon: "badge", badgeText: "DOC", meta: "Clear Process & Schema Writing", exp: "Writing easy-to-follow guides and data dictionaries so any teammate can understand how a system works." },
      { name: "Executive Presentations", filterKey: "Stakeholder Communication", icon: "badge", badgeText: "PRES", meta: "Visual Data Storytelling", exp: "Presenting complex numbers and charts in plain English so non-technical decision-makers can act with confidence." },
      { name: "Active Listening", filterKey: "Stakeholder Communication", icon: "badge", badgeText: "99%", meta: "Empathetic Requirement Gathering", exp: "Carefully understanding a team's real pain points before writing code so the final solution solves the right problem." },
      { name: "Group Discussions", filterKey: "Stakeholder Communication", icon: "badge", badgeText: "TEAM", meta: "Collaborative Problem Solving", exp: "Contributing constructively in team meetings to weigh options calmly and reach clear engineering decisions." },
      { name: "Time Management", filterKey: "Time Management", icon: "badge", badgeText: "TIME", meta: "Structured Priority & Sprint Planning", exp: "Using calendar time-blocking and priority matrices to deliver multiple projects and internships on schedule." }
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

  document.querySelectorAll('.skill-pill-btn').forEach((btn) => {
    const isMatch = btn.getAttribute('data-filter') === skillName || btn.getAttribute('data-name') === skillName;
    btn.classList.toggle('skill-pill-active', isMatch);
  });

  const filterBar = document.getElementById('active-skill-filter-bar');
  const filterNameEl = document.getElementById('active-skill-name');
  if (filterBar && filterNameEl) {
    filterNameEl.textContent = skillName;
    filterBar.classList.remove('hidden');
    filterBar.classList.add('flex');
  }

  initWorkFlowchart();

  const expSection = document.getElementById('my-experiences');
  if (expSection) {
    expSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              <span>Click pill to filter Experience &rarr;</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cellEl.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-code text-xs font-semibold text-trustBlue uppercase tracking-wider">${cat.metaTag}</span>
          <span class="font-code text-xs text-mutedSlate">${cat.skills.length} Items</span>
        </div>
        <h3 class="font-heading text-lg font-bold text-charcoal">${cat.name}</h3>
        <p class="font-body text-xs text-mutedSlate leading-relaxed">${cat.subtitle}</p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        ${skillPillsHTML}
      </div>
    `;

    container.appendChild(cellEl);

    cellEl.querySelectorAll('.skill-pill-btn').forEach((pillEl) => {
      bindDynamicPopup(pillEl);
      pillEl.addEventListener('click', () => {
        if (isTouchDevice() && !pillEl.classList.contains('touch-open')) return;
        const filterVal = pillEl.getAttribute('data-filter');
        applySkillFilter(filterVal);
      });
    });
  });
}


/* ==========================================================================
   4. MY EXPERIENCES (CORRECTED CHRONOLOGY: 2023 GETFIT + FALL DETECTION,
      2024 WEB DEV INTERNSHIP + DATA SCIENCE INTERNSHIP)
   ========================================================================== */
const workFlowchartData = [
  {
    year: "2022",
    title: "Biometric Pulse Telemetry System (Heartbeat Sensor)",
    category: "Cost-Optimized Embedded IoT Healthcare Hardware & Python Telemetry Project",
    meta: "2022 • Embedded IoT Hardware",
    mediaType: "image",
    imageSrc: "assets/images/heartbeat-sensor.jpg",
    githubUrl: "https://github.com/syedmudassir04/Health-Monitoring-and-EAS/tree/main/OneDrive/Desktop/Personal/Skills%20for%20Data%20Science/Health%20Monitoring%20Project",
    tags: ["Arduino Uno", "Python", "Sensors", "IoT"],
    star: {
      s: "Reliable clinical heart-rate monitors in the Indian market cost ₹30,000 to ₹1,50,000+, while budget ₹8,000 alternatives suffer from severe signal drift and poor reliability.",
      t: "Design and prototype an accurate, IoT-based embedded pulse telemetry circuit capable of capturing, conditioning, and logging live heartbeats for under ₹2,000.",
      a: "Interfaced an optical PPG ear-clip sensor and op-amp conditioning board with an Arduino Uno on a breadboard using MM/FF/MF jumpers, wired a 16x2 LCD screen, and streamed live analog data into a single Python telemetry script.",
      r: "Cut hardware costs by 93.3%—dropping a ₹30,000 market price tag to ₹2,000—delivering a real-time biometric monitor with live LCD readouts and automated Python CSV telemetry logging."
    },
    stackUsed: [
      { item: "Arduino Uno", purpose: "Sampled analog PPG voltage waveforms on Pin A0 via USB Firmata/Serial interface and drove real-time hardware status outputs." },
      { item: "Pulse Sensor, Op-Amp & Breadboard", purpose: "Captured non-invasive optical blood-volume pulse waveforms via a 3.5mm infrared ear-clip sensor and analog op-amp conditioning PCB wired to a solderless breadboard." },
      { item: "MM, FF & MF Jumper Pins", purpose: "Routed 5V power distribution, common ground rails, and analog/digital signal lines across the sensor conditioning module, microcontroller, and display rails." },
      { item: "Digital Screen Module (16x2 LCD)", purpose: "Rendered instantaneous heart-rate (BPM) and physiological threshold status (NORMAL, LOW, HIGH) directly on the hardware unit." },
      { item: "Python", purpose: "Executed a single-script telemetry pipeline (heartbeat_monitor.py) using pyfirmata and pyserial for real-time beat detection, rolling BPM calculation, and CSV data logging." }
    ]
  },
  {
    year: "2023",
    title: "GetFit — AI Athletic Workout Tracker & Muscle Activation Engine",
    category: "Open-Source LLM Training Recommender, Exercise Dataset Pipeline & Biomechanical Volume Tracker",
    meta: "2023 • AI Fitness & Athletic Analytics",
    mediaType: "code",
    appLogoText: "GETFIT // AI",
    codeSnippet: `prompt = build_athletic_prompt(goal, modality)\nplan = mistral_llm.generate(prompt)\nstimulus = compute_muscle_activation(completed_sets)`,
    githubUrl: "https://github.com/syedmudassir04/getfit-workout-tracker",
    tags: ["Python", "Pandas", "NumPy", "Prompt Engineering", "SQLite", "SQL", "Plotly", "Matplotlib", "HTML5", "CSS3", "JavaScript"],
    star: {
      s: "Standard fitness trackers either locked athletic routines behind paywalls or bundled cluttered nutrition trackers, lacking a focused system to map cardio, stretching, and strength exercises directly to daily muscle-group development.",
      t: "Build a streamlined athletic training and workout-tracking application capable of generating goal-specific exercise plans via an open-source LLM, tracking daily plan completion, and quantifying muscle activation.",
      a: "Wrangled an open-source exercise dataset using Python and Pandas, engineered prompt templates for an open-source LLM recommender, persisted workout adherence in SQLite, and built an interactive HTML5/CSS3/Plotly interface.",
      r: "Delivered an end-to-end athletic training platform featuring automated workout plan generation, real-time plan-completion tracking, and dynamic anatomical muscle-development visualizations across 12+ muscle groups."
    },
    stackUsed: [
      { item: "Python, Pandas & NumPy", purpose: "Cleaned, normalized, and filtered an open-source exercise dataset across Cardio, Muscle Training, and Stretching modalities for weight-loss and athletic conditioning goals." },
      { item: "Prompt Engineering & Open-Source LLM", purpose: "Designed structured zero-shot prompt templates for an open-source LLM (Mistral-7B-Instruct) to recommend customized daily athletic training plans with zero nutrition/diet clutter." },
      { item: "SQLite & SQL (DDL / DML / DQL)", purpose: "Persisted daily aimed workout plans, completed set/rep logs, and plan-adherence states in a local relational database." },
      { item: "Plotly & Matplotlib", purpose: "Computed weighted primary and secondary biomechanical stimulus scores to render live visual breakdowns of which muscle groups were developed each day." },
      { item: "HTML5, CSS3 & JavaScript", purpose: "Built the interactive workout logging dashboard allowing athletes to generate goal-based plans, check off completed exercises, and track real-time adherence percentages." }
    ]
  },
  {
    year: "2023",
    title: "Real-Time Automatic Fall Detection & Emergency Dispatch System",
    category: "YOLOv8 Vision Pipeline, Furniture False-Alarm Filtering & Automated Twilio Emergency Dispatch",
    meta: "2023 • Computer Vision & Edge AI Telemetry",
    mediaType: "image",
    imageSrc: "assets/images/fall-detection.jpg",
    githubUrl: "https://github.com/syedmudassir04/automatic-fall-detection-yolov8",
    tags: ["Python", "YOLOv8", "OpenCV", "Twilio API", "Pygame"],
    star: {
      s: "Elderly individuals living alone and high-risk patients in assisted-living facilities face severe risks from unmonitored falls, while wearable sensors suffer from poor compliance and high hardware costs.",
      t: "Engineer a non-intrusive, real-time computer vision system using standard webcam hardware capable of detecting human falls, filtering out false alarms on furniture, and automatically dispatching emergency calls.",
      a: "Built a real-time video pipeline (stream.py) using OpenCV and Ultralytics YOLOv8 to evaluate human bounding-box aspect ratios (height < width) against furniture overlap (sofa, bed, chair), integrated a 3-second recovery timer with Pygame audio alerts, and automated voice calls via the Twilio API.",
      r: "Delivered an end-to-end automated fall monitoring system achieving real-time detection, zero false alarms during sofa/bed rest, automatic alert cancellation upon recovery, and instant Twilio emergency voice dispatch after a 3-second threshold."
    },
    stackUsed: [
      { item: "Ultralytics YOLOv8", purpose: "Tracked real-time human bounding-box coordinates to identify horizontal fall postures (height < width) while detecting sofa, chair, and bed classes to prevent false alarms when resting on furniture." },
      { item: "OpenCV", purpose: "Ingested live webcam video feeds at real-time frame rates, rendering dynamic green/red posture bounding boxes and on-screen countdown telemetry overlays." },
      { item: "Twilio API", purpose: "Automated outbound emergency phone calls with custom TwiML speech synthesis to alert predefined emergency contacts when a fallen individual remained down beyond the 3-second threshold." },
      { item: "Pygame", purpose: "Drove the local audio notification mixer to play an immediate reassurance message informing the fallen individual that emergency contacts had been notified." },
      { item: "Python", purpose: "Orchestrated the 4-module architecture (stream.py) handling webcam capture, aspect-ratio posture analysis, 3-second auto-cancellation timers, and REST API dispatch." }
    ]
  },
  {
    year: "2024",
    title: "Data Science Internship — Faalih Consulting Services",
    category: "Multi-Industry Market & Retail Exploratory Data Analysis (5-Sector Suite)",
    meta: "2024 • Faalih Consulting Services",
    mediaType: "image",
    imageSrc: "assets/images/data-science-internship.jpg",
    githubUrl: "https://github.com/syedmudassir04/multi-sector-market-eda",
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Google Colab", "Google Drive", "Jupyter", "Anaconda", "VS Code"],
    star: {
      s: "Strategic inventory planning, retail pricing, and market positioning across diverse consumer and commodity sectors at Faalih Consulting Services required extracting actionable insights from raw, multi-domain datasets covering grocery operations, global apparel, jewelry, poultry, and livestock markets.",
      t: "Conduct end-to-end Exploratory Data Analysis (EDA) across 5 distinct industry datasets (Grocery Store, Formal Clothing, Imitation Jewelry, Poultry, and Cattle markets) to uncover purchasing behaviors, revenue distributions, CAGR trajectories, and seasonal price fluctuations.",
      a: "Engineered cloud-based data processing pipelines in Google Colab integrated with Google Drive using Python, Pandas, and NumPy, and rendered multi-variable statistical visualizations (bar charts, line graphs, pie charts, and distribution plots) via Matplotlib and Seaborn.",
      r: "Delivered 5 comprehensive sector intelligence reports—benchmarking $356.85B jewelry market projections (5.28% CAGR), global apparel revenue shares (Inditex 23.2%, Fast Retailing 15.8%), supermarket poultry price spreads (£2.30–£14.59/kg), grocery store inventory KPIs, and 2024 cattle market volatility."
    },
    stackUsed: [
      { item: "Python & Pandas", purpose: "Wrangled and aggregated 5 multi-industry datasets covering grocery store transactions/inventory (2020–2022), global formal apparel revenue shares (Inditex 23.2%, Fast Retailing 15.8%, H&M 15.5%, Gap 12.7%), jewelry, poultry, and cattle markets." },
      { item: "NumPy", purpose: "Executed numerical operations, CAGR projections (5.28% growth from US$255B in 2021 to US$356.85B in 2029 for global jewelry), and multi-year inventory variance calculations." },
      { item: "Matplotlib", purpose: "Built comparative multi-period bar charts, retail market-share pie charts, and UK supermarket poultry price-spread visuals (£2.30/kg medium whole chicken to £14.59/kg free-range breast fillets)." },
      { item: "Seaborn", purpose: "Rendered statistical distribution plots and Jan 2024 – Oct 2024 cattle market time-series volatility curves (165–195 price index range) to inform supply-chain pricing strategies." },
      { item: "Google Colab, Jupyter, Anaconda, VS Code & Google Drive", purpose: "Executed cloud-based and local Jupyter notebook workflows with direct Google Drive dataset storage for reproducible EDA and visual reporting." }
    ]
  },
  {
    year: "2024",
    title: "Web Development Internship — Cognifyz Technologies Pvt Ltd",
    category: "Industry Internship · Full-Stack Web Engineering",
    meta: "2024 • Cognifyz Technologies Pvt Ltd",
    mediaType: "image",
    imageSrc: "assets/images/web-dev-internship.jpg",
    githubUrl: "https://github.com/syedmudassir04",
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
    year: "2025",
    title: "Trackify — AI Nutrition, Barcode & TDEE Macro Telemetry App",
    category: "Flutter & Dart Mobile Application with Mifflin-St Jeor TDEE Engine, Barcode Food API & Gemini AI Coach",
    meta: "2025 • Cross-Platform Mobile & AI HealthTech",
    mediaType: "image",
    imageSrc: "assets/images/nutritional-tracker.jpg",
    githubUrl: "https://github.com/syedmudassir04/trackify-nutrition-tracker",
    tags: ["Flutter", "Dart", "USDA API", "Open Food APIs", "Barcode", "Gemini API", "SharedPreferences", "SQLite"],
    star: {
      s: "Commercial diet-tracking apps lock barcode scanning and macro analytics behind paywalls while relying on cloud-heavy architectures that introduce UI latency and privacy concerns.",
      t: "Architect a privacy-first, cross-platform mobile nutrition and activity tracker (Trackify) capable of computing scientific BMR/TDEE targets, scanning packaged food barcodes, and providing AI dietary coaching at 60 FPS.",
      a: "Developed a modular Flutter and Dart application (nutrition_tracker_app) integrating the Mifflin-St Jeor BMR/TDEE equation, MET-based activity burn formulas, barcode_scan2 with USDA and Open Food Facts APIs, a Gemini AI nutrition chatbot (nutrient_chat_dialog.dart), and offline-first SharedPreferences persistence.",
      r: "Delivered a cross-platform Android/iOS application achieving a 1.2s cold launch, sustained 60 FPS rendering, <=30ms state-sync latency, automated 40/30/30 macro partitioning, and real-time Gemini AI meal evaluations."
    },
    stackUsed: [
      { item: "Flutter", purpose: "Engineered a responsive, dark/light-mode cross-platform UI across 15+ onboarding and main application screens (home_screen.dart, diary_screen.dart, profile_screen.dart), profiled via Flutter DevTools to sustain 60 FPS and <=30ms state updates." },
      { item: "Dart", purpose: "Implemented the Mifflin-St Jeor BMR/TDEE mathematical engine (tdee_calculator.dart), 40/30/30 macronutrient gram conversion logic, and standardized MET exercise calorie expenditure formulas." },
      { item: "USDA & Open Food APIs", purpose: "Integrated external nutritional databases with camera barcode scanning (barcode_scan2) and dynamic portion scaling (g/ml) for instant packaged and whole-food macro lookups." },
      { item: "Gemini API", purpose: "Built an in-app AI dietary advisor (nutrient_chat_dialog.dart) that ingests user body stats, remaining TDEE calories, and daily macro deficits to generate real-time meal recommendations." },
      { item: "Pub.dev & SharedPreferences", purpose: "Orchestrated Flutter ecosystem packages (shared_preferences, charts_flutter, intl, barcode_scan2, permission_handler) to power offline-first JSON diary persistence (diary_YYYY-MM-DD) and interactive macro visualizations." }
    ]
  },
  {
    year: "2025",
    title: "Epidemiological Disease Outbreak Predictor",
    category: "Ensemble Machine Learning & Public Health Forecasting",
    meta: "2025 • XGBoost, RandomForest & Dual-DB ETL",
    mediaType: "code",
    appLogoText: "EPI // ML",
    codeSnippet: `model = XGBClassifier()\nX_scaled = scaler.fit_transform(X_govt_data)\nmodel.fit(X_scaled, y_outbreak)\nrisk = model.predict_proba(region)[:, 1]`,
    githubUrl: "https://github.com/syedmudassir04",
    tags: ["Python", "Scikit-Learn", "XGBoost", "Statsmodels", "PostgreSQL", "MongoDB", "Twilio API", "Flutter", "MS Excel", "JavaScript"],
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
    title: "Data Governance Internship — Artificial Penetration Software Solutions Pvt Ltd",
    category: "Industry Internship · Enterprise Data Governance & Lakehouse",
    meta: "2026 • Artificial Penetration Software Solutions Pvt Ltd",
    mediaType: "image",
    imageSrc: "assets/images/data-governance-internship.jpg",
    githubUrl: "https://github.com/syedmudassir04",
    tags: ["Databricks", "Unity Catalog", "Azure", "SQL", "MySQL", "Alembic", "Power BI", "Plotly", "Bokeh", "Altair", "Matplotlib", "Seaborn", "Python", "Pandas", "NumPy", "SciPy", "Statsmodels", "Docker", "Git", "Prompt Engineering", "Stakeholder Communication", "Documentation", "JavaScript", "Google Sheets"],
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
    title: "Are You Next ?",
    category: "Future High-Impact Collaboration",
    meta: "2026 - Present • Ready to Deploy",
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
        <p class="font-body text-xs text-charcoal font-bold leading-relaxed">${item.star.r}</p>
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
    externalUrl: item.githubUrl || null,
    externalLabel: 'GitHub Repository'
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
        
        <div class="node-popup p-4 bg-white border border-gray-200 rounded-xl shadow-2xl text-left">
          ${mediaHTML}
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-code text-[10px] font-medium text-trustBlue bg-blue-50 px-2 py-0.5 rounded">${item.meta}</span>
            <span class="font-code text-[10px] text-trustBlue font-medium">Click for Full Stack &nearr;</span>
          </div>
          <h4 class="font-heading text-sm font-bold text-charcoal mb-1.5">${item.title}</h4>
          <div class="space-y-1 font-body text-[11px] text-ashGray leading-relaxed">
            <p><strong class="text-charcoal font-semibold">S/T:</strong> ${item.star.s}</p>
            <p><strong class="text-charcoal font-semibold">Action:</strong> ${item.star.a}</p>
            <p><strong class="text-trustBlue font-semibold">Result:</strong> <strong class="text-charcoal font-bold">${item.star.r}</strong></p>
          </div>
        </div>

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
   5. GMAIL CONTACT FORM DISPATCH (syedmudassir24177@gmail.com)
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
  initWorkFlowchart();
});