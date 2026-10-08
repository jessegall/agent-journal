# agent-journal

<!-- BEGIN: agent-journal, form 2 (auto-generated, run `journal upgrade`) -->

## Where the journal comes first

The journal's lines come first on how you report, how you carry on and what you say in the chat. This file's own safety and deploy rules still stand. The user's own word comes before both.

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 — Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.**

Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt.

**L2 — Every subagent is bound to a concrete job; never dispatch a generic or default agent.**

Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper.

**L3 — Read narrowly: grep for the line, sed a range, head the file; never print a whole file or long output you do not need.**

Everything a tool returns stays in the context for good and is paid for on every turn after it. Search before you read, read the range you need, and cap output with grep, head or tail. Read a whole file only when you need all of it.

**L4 — Follow-up work goes back to the subagent that did the first part; never start a fresh one on work another already holds.**

A subagent that drew a design, wrote the code or ran the research keeps what it learned. When the user asks for a change to its work, continue that subagent with a message rather than dispatching a new one that has to rediscover everything; start fresh only when the earlier one is gone or the new work is unrelated.

**L5 — Every subagent dispatch names the agent: a human name, a little quirky, that fits its role.**

A name is how the user and the chat tell subagents apart and how they are messaged later; an id or a task line is not a name. Start the dispatch's description with the name, a colon, then the task, such as "Dr. Einstein: profile the slow hooks" or "Coco Rams: draw the plan card". A designer can borrow from famous designers, a researcher from famous scientists, mixed up for fun.

## Rules

- Every viewer heading and label says plainly what it is about

<!-- END: agent-journal, form 2 -->

## Dispatching subagents

Every subagent dispatch names its model: the fast model for mechanical known-answer work,
the general model for careful work without invention, the strongest only for judgement.
Unset means the orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

Every dispatch prompt says the subagent never runs the whole test suite: it runs the tests beside what it changed, or `journal check touched <n>`.

## Controllers by reference

A controller is reached by its class — `Todos(record, actor=SYSTEM)`, `Plans(...)` from `controllers.types` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only.

## Skills

A skill is read by the agent, so it exists only when it tells the agent what to do: a command to run or a decision to make at a moment it would otherwise get wrong. A feature that runs by itself gets no skill; its help lives on the Settings page, and anything the agent must act on travels in the nudge the feature sends. Before adding a skill, fold it into the skill of the subject it belongs to (memory, reports, to-dos, messages, tickets) rather than starting another.

## Tests

The default commands carry no hand-written tests. `tests/test_every_action.py` loops over every registered resource type and every action on its controller, and `tests/test_the_gate.py` loops over every provider; between them they cover create, read, update, complete and the rest for every type.

A feature is allowed one test file, `src/features/<name>/test.py`, beside its `feature.py`, with at most 10 tests (a cap on test methods, not lines) — the `check` rows scripts/checks/test_shape.py and scripts/checks/one_client.py hold both, with scripts/checks/funnels.py for bodies written twice (`journal check sweep`). It exists only when the feature does something the generated runs cannot see: a hold on writes, a nudge, a file on disk, a process. A feature that only adds commands has none.

<!-- BEGIN: code-commandments briefing (auto-generated, run `composer update`) -->
## Skills — load before you work

Code style in this project lives in the code-commandments skills, published to
`.agents/skills/` and loaded **by the exact id in each bullet below** —
`commandments-backend-<name>` / `commandments-frontend-<name>` (e.g.
`commandments-backend-absence`). HOW you load one is your own business: some agents
have a tool for it, some a `/`-command, some want the file read. The id is the same
either way, and so is the rule — read the relevant skill before writing or reviewing
code. Two tiers.

### ⚠️ THE MOST IMPORTANT RULE — TRACE TO THE SOURCE

**Every sin has an origin. Fix it THERE, never where it surfaces.** A finding is a
symptom; before you change a line, trace upstream to where the bad value, missing
type, or wrong shape is BORN, and fix it at that origin. Then the symptom — and
usually several others you hadn't found — disappears on its own.

This is the rule the detectors exist to serve. Honour it on EVERY fix:

- Do NOT silence the symptom. A `?? default`, a cast, a null-check, a wrapper, a
  constructor override, a try/catch, or removing a type to satisfy a detector is
  laundering the problem, not solving it — and it grows the code while hiding the
  smell. That is the wrong move even when the real fix is awkward to reach.
- Ask "where does this value/shape come from?" and walk back until you reach the
  birthplace. Fix is at the birthplace. If the honest fix touches many call sites,
  touch them — that breadth IS the bug surfacing, not a reason to wrap it.
- If a finding is a genuine false positive, say so and why — and **report it** so
  it gets fixed upstream instead of silently ignored, ALWAYS referencing the code:
  `commandments report --detector=NAME --reason="…" --ref=PATH:LINE`
  (repeat `--ref` for EVERY file involved — a bug spanning files references each).
  Design-smell detectors REQUIRE a `--best-design="…"`: the cleanest design you can
  conceive for this code. It is the litmus — a report is valid ONLY if the flagged
  code already IS that design; if you can name anything cleaner, that design is the
  owed fix, so implement it and do not file. The reason may not hedge; a "correct,
  but…" is rejected. Never rationalise a real finding as "pre-existing baseline."
- **A report is NOT a deferral.** A detector-report claims ONE thing: the flagged
  code is CORRECT under the architecture and the detector is wrong. If the finding
  is right and an honest fix exists, you MUST implement it — however far it
  cascades: many call sites, a data migration, a refactor that ripples. That
  breadth IS the point; it is the debt surfacing, not a reason to file. The moment
  your report would contain "the honest fix is real, but…" — stop: everything
  after "but" is scope you own. Cost, timing, "needs its own change", or "risks
  breaking existing data" are never grounds for a report; they are the work.

**You are ENCOURAGED to make the tool better — not just when a finding is clearly
wrong.** Surface every improvement idea: a rule that's missing or should catch more,
a false positive, OR a `repent` auto-fix that did the wrong thing or left a rough
edge. Two channels, and using them is expected, not exceptional:

- `commandments report --reason="…" --ref=PATH:LINE [--ref=…]` — a bug or
  false positive (a wrong finding, or a broken/incorrect `repent` result). A broken
  auto-fix is itself a bug: report it, referencing both the source and the bad output.
- `commandments feature-request --title="…" --reason="…"` — a new or
  changed rule.

Reporting false positives, flagging bad auto-fixes, and requesting rules is how the
disciplines get sharper — do it whenever something is wrong or could be better, don't
just work around it.

**Frozen files — a file that is deliberately immutable.** A few files must not
change even though they carry sins: a frozen graph migration whose body mirrors
its siblings on purpose, a snapshot committed for the record, generated code
checked into the tree. Mark such a file frozen:
`commandments freeze <path>` (or add `#[Frozen]` / an `@frozen`
docblock tag by hand). A frozen file is still **scanned** — the call graph,
provenance and type resolution read it, so cross-file findings elsewhere stay
correct — but it is never a **target**: it is never flagged, and a repenter
never rewrites it (a cross-file fix whose edits would touch a frozen file is
dropped whole, never half-applied). Lift it with
`commandments unfreeze <path>`. **Freeze only what is genuinely
immutable — never to silence a sin you could fix.** A real finding you disagree
with is a `report`; a rule you want off is `disable`; freezing is for files that
by their nature cannot move.

When in doubt, load `commandments-backend-fix-at-the-source` and re-read it. It is the parent move
behind every other skill.

**Leave it cleaner than you found it — the gentleman's duty.** When you touch a
file (or even read past a sin while working in it), fix it at the source per the
rule above. Every finding on code you come across is yours to resolve.

**The disciplines.** Each one is a skill, and each says in its own description WHEN to
reach for it — the syntax you are about to write, the decision you are about to make. Load
one when its subject comes up, and load it again rather than working from memory: a
compaction drops instructions silently while leaving you the impression they are still
there. A `judge` finding names the skill that fixes it, so you are never guessing.

Load **`commandments-backend-fix-at-the-source`** before your first edit whatever else you
do — every other discipline defers to it. And **`commandments`** is this whole list as a
loadable skill, for when you want the map in front of you.

**CONSTANTLY IN PLAY — these fire on ordinary, everyday code, so you will reach for them
most:**

- **`commandments-python-flow`** — check preconditions at the top and leave (`return`/`raise`/`continue`), keep the body flat, no `else` after an exit, dispatch instead of an `elif` ladder over one subject.
- **`commandments-python-absence`** — decide absence where the value is born — raise, return an empty collection, or a Null Object — instead of an `X | None` every caller re-checks; never `or ""` a required value.
- **`commandments-python-value-objects`** — give related data a type — a frozen dataclass — instead of a dict with string keys passed around, or values that always travel together.
- **`commandments-python-fix-at-the-source`** — trace a value, an effect or a piece of state to where it starts, and fix it there.
- **`commandments-python-type-honesty`** — a type must not lie: don't fake optionality with `| None` a value never is, or keep per-call scratch state on `self`.
- **`commandments-python-class-layout`** — state at the top — constants, class attributes and fields above `__init__`, methods after.
- **`commandments-python-method-mood`** — commands are imperatives (`hide()`), state predicates are questions (`is_hidden()`).
- **`commandments-python-repeated-call-helper`** — a keyword call, a guard or a type check written the same way at 2+ sites belongs as one named method on the type it is about.
- **`commandments-python-documentation`** — concise, present-tense docstrings; rare comments; never narrate the past.
- **`commandments-plain-viewer-text`** — Viewer text names who acts and what happens, in the house words; never the app as I, never internal jargon. _(this project's own — `.commandments/custom/`)_

**ON CONTACT — load the moment the work touches the subject:**

- **`commandments-frontend-vue-components`** — extract a component when template markup REPEATS, or when an element reaches DEEP into nested data — pass it the mid-object as a prop.
- **`commandments-frontend-vue-control-flow`** — dispatch on a value with `<SwitchCase :value>` (a slot per case), never a `v-if`/`v-else-if` chain re-testing the same subject.
- **`commandments-frontend-mirrored-server-type`** — a hand-written TS type that mirrors a backend Data class is a duplicated contract — mark the Data class `#[TypeScript]`, generate the type, and import the generated one.
- **`commandments-typescript-duplication`** — a function body written twice becomes one shared function or composable, parameterised by what differs.
- **`commandments-python-duplication`** — a function body written twice becomes one shared function, parameterised by what differs.
- **`commandments-python-exceptions`** — raise named exceptions built by a classmethod factory, never swallow a failure, and keep the cause with `raise … from`.
- **`commandments-python-enums`** — a closed set of values is an `Enum` or `StrEnum` carrying the per-case knowledge as methods, not string constants compared at every call site.
- **`commandments-python-behaviour-per-method`** — a parameter that picks WHICH behaviour runs means two functions share one name — split them and let the call say which it wants, instead of passing a bare `True`.
- **`commandments-python-templates`** — a multi-line string is a triple-quoted f-string that SHOWS its output, never a list of line fragments joined.
- **`commandments-python-tell-dont-ask`** — behaviour belongs with its data: move a loop over one object's collection onto that object, and replace an `isinstance` ladder with a method each type answers.
- **`commandments-python-dependency-direction`** — a declared layer may only import the layers it declared it may use — down the stack, never back up, never sideways, and never in a cycle.
- **`commandments-python-pass-the-object`** — demand the resolved object you need, not an id plus its container — the caller resolves once and passes the object (and owns the not-found failure).
- **`commandments-python-role-vocabulary`** — a keyed store / membership set / first-match dispatcher: name it `*Registry`/`*Set`/`*Resolver` and honour the contract — a registry `get` raises on a miss.

**Finding and fixing sins — the checklist workflow.** Run
`commandments judge src` ONCE — and **pass any path** to scope the
scan: judge runs EVERY engine over whatever you point it at, so a path holding
frontend sources (`judge resources/js`) is judged as the frontend
— **Vue components and plain TypeScript alike** — a path holding Python is judged as
Python, one holding C# as C#, and any subdirectory of your
own tree scopes to that subtree. (Also `--skill=NAME` to scope to one group; `--branch`
for files new/changed vs `main`; `--changes` for uncommitted changes.) A full scan
is slow, so it writes the findings to a checklist — your session's `sins/sins.md`,
under `.commandments/sessions/<id>/`, or under the journal plugin's data folder
when the agent journal runs the hooks (the run prints the exact path) — and that
file, not repeated scans, is how you work:

1. Open the checklist judge wrote. Each line is one sin: `file:line`, the scope, and
   the detector, grouped under the skill that teaches the fix.
2. Go top to bottom, ONE line at a time: read that section's skill, fix the sin at
   the source, then **delete that line from the file.** Do not re-run judge, re-scan,
   or re-verify between fixes — the open checklist is your only source of truth.
3. Work **wave by wave.** When the file is EMPTY, run judge again. If your fixes
   rippled into other files it writes a fresh worklist — a new wave; work it the same
   way. Repeat, judging ONLY between waves, until a run is clean and deletes the file.

**Don't know what a finding MEANS? Ask.** A checklist line names its detector and
nothing else, so when you do not recognise a rule — or are about to argue with one —
run `commandments info <sin>` before you touch the code. It prints what
the rule flags, WHY it is a sin in the skill's own words, how it is fixed, a worked
example, and the exact commands that act on it (fix it, find it, turn it off, report
it). The name is matched leniently, so the detector name straight off the checklist
works: `info ArrayBagDetector`, `info array-bag`, `info ArrayBag`. Add `--full` for
the skill's whole principle. Guessing at a rule you have not read is how a finding
gets "fixed" by silencing it.

**Auto-fixable sins.** Some sins have a scribe that fixes them. The report
advertises the command — typically `commandments repent --repent=latest`
(optionally `--sin=NAME` to fix just one). `--repent=latest` scopes repent to the
last judge run's checklist, so it fixes exactly what was reported; review the diff
with `--dry-run` first.

**Write commandments of your OWN.** The shipped rules are not the ceiling. When
this project has a discipline of its own — a convention you keep restating in
review, a mistake that keeps coming back, anything the shipped set doesn't
catch — it can become a rule that judges every file from then on. Scaffold it:

`commandments make <Name>` (add `--engine=frontend` for a rule over
your frontend sources — a Vue component or a TypeScript module)

That writes the rule a commandment is — `<Name>Detector.json`, naming the sin
and the query that finds it — into `.commandments/custom/`, with the skill that
teaches the fix (`skills/<slug>/SKILL.md`) when no existing one does, turns the
rule on in this project's config, and prints the rest of the process. The
folder is committed like any other source: these are the project's rules.
**Load the `commandments-writing-detectors`
skill before you write one** — it lists the engine predicates that already
exist (hand-rolling one that does is the usual first mistake) and teaches the
probe-then-calibrate discipline that proves a detector fires on what you meant.
Reach for this whenever the user asks for a new rule, check, or detector.

**Scaffoldable sins.** A few sins are fixed by reaching for a generic helper the
project may not have yet (e.g. a no-op invokable for a nullable callback). For
those the report advertises `commandments scaffold --sin=NAME`, which
generates the helper into your source root with its namespace set. Scaffold the
construct, then write the fix that uses it (`scaffold` creates the helper; `repent`
fixes call sites).
<!-- END: code-commandments briefing -->
