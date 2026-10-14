# agent-journal

## Dispatching subagents

Every Agent dispatch names its model: `haiku` for mechanical known-answer work, `sonnet`
for careful work without invention, `opus` only for judgement. Unset means the
orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

Every dispatch prompt says the subagent never runs tests: it writes the test that proves its change and names it in its report, and the main agent runs it.

## Controllers by reference

A receiver asks for a row type's controller by type in its signature — `Rows[Todo]` to write, `ReadRows[Todo]` to read — and engine code reaches a controller by its class — `Todos(record, actor=SYSTEM)` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only. A base controller comes from `controllers.types`; a controller a feature owns, such as `Tickets` or `Helpers`, comes from that feature until the sweep moves it down, which is when `controllers.types` will hold it too.

## Skills

A skill is read by the agent, so it exists only when it tells the agent what to do: a command to run or a decision to make at a moment it would otherwise get wrong. A feature that runs by itself gets no skill; its help lives on the Settings page, and anything the agent must act on travels in the nudge the feature sends. Before adding a skill, fold it into the skill of the subject it belongs to (memory, reports, to-dos, messages, tickets) rather than starting another.

## Tests

**Do not run the slow suites unless the user asks.** `tests/test_it_boots.py` and `tests/test_the_viewer.py`
take about ten minutes and hold the machine; running them on a development branch slows the work down for
nothing. They are not in the default run: `pytest` without a path skips them, and they are run by name when
the user asks or when a release is cut. What to run while working: the generated expectation runs
(`tests/test_every_action.py`, `test_the_gate.py`, `test_the_expectations.py`, `test_the_catalogue.py`,
`test_the_layers.py`), which are quick, and the test file of whatever was just touched.

The default commands carry no hand-written tests. Seven generated runs cover them: `tests/test_every_action.py` loops over every registered resource type and every action on its controller, `tests/test_the_gate.py` loops over every provider, `tests/test_the_expectations.py` plays every expectation every registration carries, `tests/test_the_catalogue.py` walks every resource type and every moment it has, and `tests/test_the_layers.py` holds declaring and events to naming nothing above themselves (those two packages only, until to-do 4591 widens it). `test_it_boots.py` plays the installer and the upgrade and `test_the_viewer.py` plays the viewer; both are slow and run only when asked. Between them they cover create, read, update, complete and the rest for every type, and what each registration promises it does.

**Every feature states what it does as expectations** (rule 90). Each registration — `journal.events.listen`, `handle` and `answer`, `journal.commands.add`, `refuse` and `intercept` — carries `expects=[Given(...) >> Outcome(...)]`, and `tests/test_the_expectations.py` plays them all. A Given states the rows, settings, files, clock and fakes a play starts from; its `earlier` steps (`Reported`, `Ticked`, `Acted`, `Waited`, `Happened`) play through the whole journal first. Outcomes include `Dispatches`, `Updated`, `Nudged`, `Answered`, `Held`, `Released`, `Told`, `Stands` and `Closed`. Write the expectation first, then break the line it covers once and see it fail, so no expectation passes by accident:

```python
journal.events.handle(Compacting, HoldUntilCaughtUp(), expects=[
    Given(Compacting(agent=1), rows=[AgentRow(n=1)]) >> Held(read_held(50)),
])
```

A feature keeps `src/features/<name>/test.py` only for what a Given cannot state — a real process, a real file tree, real git, a socket, a browser — with at most 10 tests, and the file's first line says why it is a test. A feature that only adds commands has none. The `check` rows scripts/checks/test_shape.py and scripts/checks/one_client.py hold the cap, with scripts/checks/funnels.py for bodies written twice (`journal check sweep`).

<!-- BEGIN: code-commandments skills (auto-generated, run `composer update`) -->
@AGENTS.md

## Working here as Claude Code

The briefing above is the canon, shared with every agent. These are the parts of it
that have a specific name in this harness:

- **Load a skill with the Skill tool**, by the exact id in the briefing's bullets —
  e.g. `commandments-backend-absence`. The published skills are linked into
  `.claude/skills/`, so they also autocomplete as `/`-commands.

**The disciplines here are ENFORCED, not just written down.** The agent journal's
code-commandments plugin judges what you change and raises each sin in the chat; the
package's own hooks step aside. That is a property of this agent alone — under an
agent with no hook protocol the same disciplines are documents you are asked to follow,
and nothing checks that you did.
<!-- END: code-commandments skills -->
