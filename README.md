# Redux GUI Test of the RBS

A deliberately small Node service used to demonstrate the
[Redux Build System](https://github.com/ReduxISU/Redux_Build_System) (`rbs`) end to end.

It is small on purpose. Every gate can be genuinely green here, which the real repos cannot yet
manage — so this repo shows what the pipeline looks like when it is satisfied, and what it does
when it is not.

## What it does

A JSON service over three routes, enough to have something real to build, test and ship:

| Route | Response |
|---|---|
| `/health` | `{"status":"ok"}` |
| `/problems` | `["CLIQUE","SAT3","SPSP"]` |
| `/problems/CLIQUE` | `{"name":"Clique","complexity":"NP-complete"}` |

## The pipeline

Everything is driven by [`rbs.toml`](rbs.toml) and run by `rbs ci`. No pipeline logic lives in
this repo — [`.github/workflows/rbs.yml`](.github/workflows/rbs.yml) only calls the hub's
reusable workflow, which runs the gates inside this repo's own devcontainer.

```
audit → format-check → lint → unit-test → build → integration-test → push → report
```

| Operation | Tool | Notes |
|---|---|---|
| `audit` | `npm audit --omit=dev` | Zero production dependencies, so nothing to flag |
| `format-check` | Biome | Formatter only; ESLint owns correctness |
| `lint` | ESLint | Flat config on `@eslint/js` recommended |
| `unit-test` | `node --test` | Node's built-in runner — no test framework dependency |
| `build` | Docker | Produces `local/redux_gui_test:ci`, never pushed |
| `integration-test`, `push` | — | Not implemented in rbs yet; both report `skipped` |

Unlike `Redux_GUI`, this repo runs **without** `soft`, so a failing gate fails the check — which
is what lets a branch ruleset block a merge.

## Running it locally

```bash
npm ci
rbs ci            # the whole pipeline, exactly as CI runs it

npm test          # or the individual pieces
npm run lint
npm run format:check
```

Or open the devcontainer, which brings its own Node 26 and `rbs`:

```bash
devcontainer up   --workspace-folder .
devcontainer exec --workspace-folder . rbs ci
```

See [DEMO.md](DEMO.md) for the walkthrough this repo was built for.
