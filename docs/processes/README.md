# Processes

Processes is the Core area that decides whether a shell line may run, runs it part by part under a supervisor, keeps
every byte it prints, and turns the output of a test or check into a result only when a proven reader says so. It
lives in `app/Processes`; every other area reaches it through the contracts in `app/Processes/Contracts`.

## The pages

| Page | What it covers |
|---|---|
| [classification.md](classification.md) | Command classes, the command types, rules and their scopes, scripts, proposals and review, module bundles |
| [admission.md](admission.md) | The order of the checks a line goes through and every refusal code |
| [workflow.md](workflow.md) | Getting a new test or check approved: request, rule, samples, reader, proof, approval |
| [results.md](results.md) | What a finished run says: observations, problem codes, assessments, receipts and replay |
| [runner.md](runner.md) | The supervisor, a part's lifecycle, capture, readers, recovery and the limits |

## The shell language

A line is read into a syntax tree (`app/Processes/Syntax`, built by `BuildShellTreePipeline`) before anything runs.
The tree knows simple commands, words with quotes and expansions, assignments before a command, redirects, pipes,
`&&` and `||` chains, lists split by `;` or `&`, negation with `!`, subshells and groups, command and process
substitution, and function definitions. Bash and POSIX sh are the two dialects (`ShellDialect`).

Not supported, and refused with `syntax-unsupported` before anything starts:

- The keyword compounds `if`, `while`, `until`, `for`, `select`, `case` and `coproc` (`UnsupportedKeyword`).
- A line deeper or longer than the analysis limits (`analysis-limit`).
- Interactive programs that need a terminal: a part never gets a TTY.

`command-type:explain --line "<line>"` prints the tree, the class of each part and what admission would say, without
running anything.

## What Processes guarantees, and what it does not

A result is contract-valid evidence: the run was admitted, its exit status is its own, its output was captured
whole, and a reader proven on real runs of that exact tool and version read it as the contract says. It is not proof
that the program is right about the code it checked. Output text never authorizes anything: a line a program prints
can never approve a rule, a reader or a run.
