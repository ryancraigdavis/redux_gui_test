# Demo runbook

Showing `rbs` running as a PR gate: a ruleset blocks the merge, one line fixes it, the check
goes green and the merge unblocks.

## Setup (do this before the demo)

**1. Get `main` established and green.** Merge the scaffold branch, then confirm the `rbs`
workflow ran and passed on `main`.

**2. Create the branch ruleset.** Settings → Rules → Rulesets → New branch ruleset:

- Target branch: `main`
- ✅ **Require status checks to pass** → add **`build-test`**
- ✅ Require a pull request before merging
- ✅ Block force pushes

> The check only appears in the picker once GitHub has seen it, which is why step 1 comes first.
> `build-test` is the job name in `.github/workflows/rbs.yml`.

**3. Confirm `soft` is off.** This repo's workflow calls the hub workflow with no `with:` block,
so gates fail the check. If it ever gets `soft: true`, the job goes green regardless and the
ruleset can never block anything — that is the single easiest way to break this demo.

**4. Create the demo branch and plant the bug** (see below), open a PR, and let the check finish
so the PR is sitting red when you start.

## The planted bug

Delete the first line of `src/router.js`:

```diff
-import { NOT_FOUND, unknownProblem } from "./messages.js";
 import { describeProblem, listProblems } from "./problems.js";
```

One missing import. Two independent gates catch it:

```
| lint      | ❌ | 2 errors            |
| unit-test | ❌ | 2 failed · 5 passed |

<details>❌ lint — 2 errors
| error | src/router.js:17 | no-undef | 'unknownProblem' is not defined. |
| error | src/router.js:19 | no-undef | 'NOT_FOUND' is not defined.      |
```

`audit`, `format-check` and `build` stay green — the quality gates all still run rather than
stopping at the first failure.

**The fix:** put the import line back. That is the whole live edit.

## Running the demo

1. **Show the red PR.** Merge button is blocked by the ruleset. Point at "Required check
   `build-test` failing".
2. **Open the sticky comment.** The table shows every gate, not just the first failure. Expand
   the `lint` block — exact file, line, and rule. Nobody has to open a raw job log.
3. **Note what still passed.** `audit`, `format-check`, `build` are green. One pass reports the
   full picture.
4. **Fix it live.** Re-add the import, commit, push.
5. **Watch it go green.** The same comment is *edited in place* rather than a new one appended —
   it is keyed by an HTML marker. Merge button unblocks.

## Talking points

- **The pipeline is a CLI, not YAML.** `rbs ci` is what CI runs and what you run locally, so
  "it passed on my machine" and "it passed in the PR" mean the same thing. The workflow file
  here is 20 lines and contains no logic.
- **The toolchain is declared once.** Gates run inside this repo's own devcontainer, so rbs never
  needs to know how to install Node — or .NET, for `Redux`. Adding a stack is a devcontainer, not
  a change to the build system.
- **Everything runs, every time.** A lint failure does not hide an audit failure. The only things
  that stop are those that genuinely cannot run: `integration-test` cannot test an image that
  failed to build, so it reports `blocked`, not a misleading `skipped`.
- **One required check.** The ruleset needs `build-test` and nothing else; it will not go stale as
  operations are added.
- **This is not the end state.** `integration-test` and `push` report `skipped` honestly rather
  than passing vacuously. Deployment is deliberately untouched.

## If it goes wrong

| Symptom | Cause |
|---|---|
| Check never appears | `rbs.yml` must exist **on the branch you pushed** — GitHub reads the workflow from that ref |
| Job green despite failures | `soft: true` got added to the `with:` block |
| Report comment missing | Push events have no PR number; the comment only posts on `pull_request`. The job summary always renders |
| Workflow reference invalid | The hub's `ci.yml` must be on `ReduxISU/Redux_Build_System@main` |

Budget ~4–6 minutes per run: the devcontainer image is built fresh each time (caching is
deliberately deferred).
