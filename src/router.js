
import { describeProblem, listProblems } from "./problems.js";

const PROBLEM_PATH = /^\/problems\/([A-Z0-9]+)$/;

export function route(pathname) {
  if (pathname === "/health") {
    return { status: 200, body: { status: "ok" } };
  }
  if (pathname === "/problems") {
    return { status: 200, body: listProblems() };
  }
  const match = PROBLEM_PATH.exec(pathname);
  if (match) {
    const problem = describeProblem(match[1]);
    return problem
      ? { status: 200, body: problem }
      : { status: 404, body: { error: unknownProblem(match[1]) } };
  }
  return { status: 404, body: { error: NOT_FOUND } };
}
