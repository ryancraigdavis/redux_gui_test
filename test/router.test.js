import assert from "node:assert/strict";
import { test } from "node:test";
import { describeProblem, listProblems } from "../src/problems.js";
import { route } from "../src/router.js";

test("lists every known problem", () => {
  assert.deepEqual(listProblems(), ["CLIQUE", "SAT3", "SPSP"]);
});

test("describes a known problem", () => {
  assert.equal(describeProblem("SAT3").complexity, "NP-complete");
});

test("returns null for an unknown problem", () => {
  assert.equal(describeProblem("NOPE"), null);
});

test("health check reports ok", () => {
  assert.deepEqual(route("/health"), { status: 200, body: { status: "ok" } });
});

test("problem route returns the problem", () => {
  const { status, body } = route("/problems/CLIQUE");
  assert.equal(status, 200);
  assert.equal(body.name, "Clique");
});

test("unknown problem is a 404", () => {
  assert.equal(route("/problems/NOPE").status, 404);
});

test("unknown path is a 404", () => {
  assert.equal(route("/nope").status, 404);
});
