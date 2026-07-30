const PROBLEMS = {
  CLIQUE: { name: "Clique", complexity: "NP-complete" },
  SAT3: { name: "3-Satisfiability", complexity: "NP-complete" },
  SPSP: { name: "Single Pair Shortest Path", complexity: "P" },
};

export function listProblems() {
  return Object.keys(PROBLEMS).sort();
}

export function describeProblem(key) {
  return PROBLEMS[key] ?? null;
}
