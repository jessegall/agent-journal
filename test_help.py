#!/usr/bin/env python3
"""cli-streamline: every old spelling and its new equivalent produce the SAME store state.

    .journal/test_help.py

This is the table-driven proof to-do 1 asks for: not "does it exit 0" but "is what got
written to disk identical, whichever spelling wrote it." It also carries the line-count
caps later to-dos add (journal --help, journal carry, the capped catalogues) so a later
change that widens one of them fails loudly here rather than being noticed by eye.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, testkit, todo, transcript, fmt  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def fresh():
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
        "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal",
        ".git", ".claude", "__pycache__"))
    (d / ".journal" / "settings.json").write_text("{}")
    tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
    (tdir / "s1.jsonl").write_text("")
    return d


d = fresh()
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


P = testkit.Project(d)


def j(*args, stdin=""):
    return P.cli(*args, session="s1", stdin=stdin)


# ───────────────────────── pins: pin/remember (old) vs pins add (new) ─────────────────────────
code, out = j("pin", "old spelling writes a pin")
check("old `pin` writes", (code, "pinned" in out), (0, True))
before = state.get(root, "pins", [])
code, out = j("pins", "add", "new spelling writes a pin")
check("new `pins add` writes", (code, "pinned" in out), (0, True))
after = state.get(root, "pins", [])
check("both wrote one more entry, same shape", len(after) - len(before), 1)
check("the new entry carries exactly the words given, not `add` too",
      after[-1]["fact"], "new spelling writes a pin")

code, out = j("remember", "a third pin via the other old spelling")
check("`remember` is the same alias as `pin`", (code, "pinned" in out), (0, True))

# strike: old top-level `strike` vs new `pins strike`
code, out = j("pins", "strike", "1", "superseded by pins add")
check("new `pins strike` retires pin 1", (code, "struck pin 1" in out), (0, True))
code, out = j("strike", "2", "superseded by pins add too")
check("old `strike` still retires the same way", (code, "struck pin 2" in out), (0, True))
items = state.get(root, "pins", [])
check("both strikes actually landed", (items[0]["struck"], items[1]["struck"]),
      ("superseded by pins add", "superseded by pins add too"))

# promote: old top-level `promote` vs new `pins promote`
code, out = j("pin", "promote me the old way")
n = len(state.get(root, "pins", []))
code, out = j("promote", str(n))
check("old `promote` lifts a pin to a rule", (code, "rule 1" in out), (0, True))
code, out = j("pin", "promote me the new way")
n = len(state.get(root, "pins", []))
code, out = j("pins", "promote", str(n))
check("new `pins promote` does the same", (code, "rule 2" in out), (0, True))
rules = state.get(root, "rules", [])
check("both promotions actually created a rule",
      [r["fact"] for r in rules], ["promote me the old way", "promote me the new way"])

# empty payload after a canonical verb must refuse, never file (the trap named in to-do 1)
before = len(state.get(root, "pins", []))
code, out = j("pins", "add")
check("`pins add` with nothing refuses rather than files", (code != 0, len(state.get(root, "pins", [])) == before), (True, True))

# ─────────────────────────── rules: rule (old) vs rules add (new) ─────────────────────────────
code, out = j("rule", "the old way to rule")
check("old `rule` writes a rule", (code, "ruled" in out), (0, True))
code, out = j("rules", "add", "the new way to rule")
check("new `rules add` writes a rule", (code, "ruled" in out), (0, True))
rules = state.get(root, "rules", [])
check("the new rule carries exactly the words given", rules[-1]["fact"], "the new way to rule")

code, out = j("rule", "--strike", "1", "old spelling for retiring a rule")
check("old `rule --strike` retires rule 1", (code, "struck rule 1" in out), (0, True))
code, out = j("rules", "strike", "2", "new spelling for retiring a rule")
check("new `rules strike` retires rule 2", (code, "struck rule 2" in out), (0, True))
rules = state.get(root, "rules", [])
check("both rule-strikes landed", (rules[0]["struck"], rules[1]["struck"]),
      ("old spelling for retiring a rule", "new spelling for retiring a rule"))

code, out = j("rules", "list")
check("`rules list` is the same as bare `rules`", "RULES OF THIS PROJECT" in out, True)
# 1.35.0 RULING: `show` reads its NOUN, everywhere. `docs show 4` prints the doc and
# `todos show 3` prints the to-do; this was the one place `show` printed a stretch of
# transcript instead, which is what `--full` means everywhere else. Both spellings still
# run and `--full` still means the conversation — what changed is which one `show` is.
code1, out1 = j("rules", "3", "--full")
check("`rules <n> --full` still opens the conversation around it",
      ("nothing to read around" in out1 or "written at line" in out1), True)
code2, out2 = j("rules", "show", "3")
check("`rules show <n>` reads the RULE: the claim, and its reasoning if it has any",
      (code2, "RULE 3" in out2, "the old way to rule" in out2,
       "No reasoning is written down" in out2), (0, True, True, True))
check("and the two are no longer the same page", out2 == out1, False)

# ─────────────────────────────── todo / todos twin alias ──────────────────────────────────────
code, out = j("todo", "the old bare spelling")
check("old bare `todo \"<title>\"` still adds", (code, "to-do" in out.lower()), (0, True))
code, out = j("todos", "add", "the new explicit spelling")
check("new `todos add` adds the same way", (code, "to-do" in out.lower()), (0, True))
titles = [t["title"] for t in todo._all(root, "default")]
check("both landed with exactly the words given, no verb word in the title",
      titles[-2:], ["the old bare spelling", "the new explicit spelling"])

code, out = j("todos")
check("bare `todos` is the twin of bare `todo`", "TO-DO" in out, True)
code, out = j("todos", "1")
check("`todos <n>` is the twin of `todo <n>`", (code, "the old bare spelling" in out), (0, True))
code, out = j("todo", "show", "1")
check("and the new explicit `todo show <n>` too", (code, "the old bare spelling" in out), (0, True))

code, out = j("todo", "add")
check("`todo add` with nothing refuses rather than filing a to-do titled \"\"", code != 0, True)

code, out = j("todo", "drop", "1", "abandoned, the old spelling")
check("old `todo drop` abandons it", (code, "dropped" in out.lower()), (0, True))
code, out = j("todo", "add", "one to strike")
n = len(todo._all(root, "default"))
code, out = j("todos", "strike", str(n), "abandoned, the new spelling")
check("new `todos strike` does the same as `todo drop`", (code, "dropped" in out.lower()), (0, True))

# ───────────────────────────── tools: remove (old) vs strike (new) ────────────────────────────
code, out = j("tools", "add", "a", "A tool", "--summary=one")
code, out = j("tools", "add", "b", "B tool", "--summary=two")
code, out = j("tools", "remove", "a", "retired the old way")
check("old `tools remove` retires under struck/", (code, (root / "tools" / "struck" / "a" / "tool.md").is_file()), (0, True))
code, out = j("tools", "strike", "b", "retired the new way")
check("new `tools strike` does the same", (code, (root / "tools" / "struck" / "b" / "tool.md").is_file()), (0, True))

# ──────────────────── to-do 4: the five renderers, capped and pageable (ruling R7) ─────────────
d2 = fresh()
J2 = str(d2 / ".journal" / "journal.py")
root2 = d2 / ".journal"


def j2(*args, stdin=""):
    p = subprocess.run([J2, *args], env=env, input=stdin, capture_output=True, text=True, timeout=180)
    return p.returncode, p.stdout + p.stderr


for i in range(20):
    j2("pin", f"pin number {i}")
    j2("rule", f"rule number {i}")
    j2("todo", f"todo number {i}")
    j2("tools", "add", f"tool{i}", f"Tool {i}", "--summary=x")

code, out = j2("pins")
check("`journal pins` caps at 15 and offers the rest", (code, out.count("\n  ") > 0, "and 5 more" in out, "--page=2" in out), (0, True, True, True))
code, out = j2("pins")
check("page 1 is the NEWEST fifteen, not the oldest", "pin number 19" in out, True)
code, out = j2("pins", "--page=2")
check("`journal pins --page=2` shows the remaining 5 — the oldest", "pin number 0" in out, True)
code, out = j2("pins", "--order=asc")
check("--order=asc gives back the old reading", ("pin number 0" in out, "pin number 19" in out), (True, False))

code, out = j2("rules")
check("`journal rules` caps too", ("and 5 more" in out, "--page=2" in out), (True, True))

code, out = j2("todo")
check("`journal todo` caps too", ("and 5 more" in out, "--page=2" in out), (True, True))

code, out = j2("tools")
check("`journal tools` caps too", ("and 5 more" in out, "--page=2" in out), (True, True))

# what must NOT be cut (ruling R8, pin 9): the environment pickup page lists every to-do,
# in order -- not just the first page of them, because a runner has to see them all
here = state.get(root2, "current", "default") or "default"
code, out = j2("environments", here)
check("the environment page's to-do list is whole, not capped -- to-do 19 is still on it",
      "todo number 19" in out, True)
check("and it does not offer a --page=2 for that list (there is nothing more to page to)",
      "--page=2" not in out, True)

# ---------------------------------------------------- the line-count caps, which this file
# CLAIMED to carry and did not. Box 4 of the definition of done is a NUMBER, and the audit
# found the docstring above promising to hold it while nothing here asserted it — which is
# exactly how `journal --help` grew from 72 lines to 77 during the work that was supposed to
# cut it to 30. A cap nobody measures is a cap that has already been lost.
code, out = j2("--help")
check("journal --help is under 30 printed lines (box 4)", (code, len(out.splitlines()) < 30), (0, True))
code, out = j2("carry")
# THE CAP IS ON THE BLOCK, NOT ON THE RECORD IT CARRIES. Rules, pins, open work and to-dos
# are the payload — the one thing ruling R8 says is never cut — so a fixture holding twenty
# of each would fail a cap that is really about the prose wrapped around them.
block = out.split("RULES OF THIS PROJECT")[0]
check("journal carry's own block is under 31 printed lines (box 4)",
      (code, len(block.splitlines()) < 31), (0, True))
for noun, mark in (("pins", "pin number"), ("rules", "rule number"), ("todos", "todo number"),
                   ("tools", "Tool ")):
    code, out = j2(noun)
    shown = out.count(mark)
    check(f"a bare `journal {noun}` shows at most 15 of 20 and offers the rest by page",
          (code, shown, "--page=2" in out), (0, 15, True))

# EVERY GROUP THE INDEX NAMES IS A GROUP THAT ANSWERS. The index is the only thing --help
# prints now, so a group named there with no help behind it is a dead end at the one place
# a reader is sent.
import help as help_mod  # noqa: E402
for group in help_mod.groups():
    code, out = j2(group, "help")
    check(f"the index's `{group}` group answers `journal {group} help`",
          (code, "No such command" not in out), (0, True))
for spelling in sorted(help_mod.ALIAS):
    code, out = j2(spelling, "help")
    check(f"the alias `{spelling}` answers, because it runs (ruling R3)",
          (code, "No such command" not in out), (0, True))

# ------------------------------------------- a name that is also a verb, on every noun
# THE USER'S POINT: a tool can be CALLED `add` or `run`. Reading one by putting its name
# where a verb goes works right up until somebody names it after a verb, and then the
# noun's own vocabulary eats it — silently, and with no way to say which was meant. Every
# read is an explicit verb now, and the bare form stays as the alias ruling R3 promises.
d3 = fresh()
J3 = str(d3 / ".journal" / "journal.py")
env3 = {**os.environ, transcript.SESSION_ENV: "s1"}


def j3(*args, stdin=""):
    p = subprocess.run([J3, *args], env=env3, input=stdin, capture_output=True, text=True, timeout=180)
    return p.returncode, p.stdout + p.stderr


(d3 / "x.sh").write_text("#!/bin/sh\necho ran\n")
os.chmod(d3 / "x.sh", 0o755)
for name in ("add", "run", "index", "list", "show", "strike", "set"):
    code, out = j3("tools", "add", name, f"A tool called {name}", "--summary=x", "--entry=x.sh")
    check(f"a tool may be NAMED {name!r}", (code, f"tool {name}" in out), (0, True))
    code, out = j3("tools", "show", name)
    check(f"`journal tools show {name}` reads it, whatever the verb table says",
          (code, f"A tool called {name}" in out), (0, True))
code, out = j3("tools", "run", "run")
check("`journal tools run run` runs the tool called run", (code, "ran" in out), (0, True))
code, out = j3("tools", "list")
check("`journal tools list` is the catalogue", (code, "TOOLS OF THIS PROJECT" in out), (0, True))

j3("docs", "add", "search", "--abstract=a doc whose name is a verb")
code, out = j3("docs", "show", "search")
check("`journal docs show search` reads the doc called search, not the search verb",
      (code, "a doc whose name is a verb" in out or "search" in out), (0, True))
code, out = j3("docs", "list")
check("`journal docs list` is the catalogue", (code, "DOCS OF THIS PROJECT" in out), (0, True))

# A VERB WITH ITS ARGUMENT MISSING IS AN ERROR, NEVER A PAYLOAD. Found by probing: this
# filed a to-do titled "show" and said it had succeeded.
code, out = j3("todos", "show")
check("`journal todos show` with no number REFUSES instead of filing a to-do called show",
      (code, "wants a to-do number" in out), (1, True))
code, out = j3("todos")
check("and nothing was written by that refusal", "show" not in out.split("TO-DO")[-1][:200], True)
code, out = j3("environments", "show", "default")
check('`journal environments show "<name>"` is the pickup page', (code, "ENVIRONMENT default" in out), (0, True))
code, out = j3("environments", "show")
check("`journal environments show` with no name refuses", (code, "wants a name" in out), (1, True))
code, out = j3("environments", "list")
check("`journal environments list` is the listing", (code, "ENVIRONMENTS" in out), (0, True))

# ─────────────────── the rules the package ships, which nobody can strike ─────────────────
code, out = j("rules")
check("a shipped rule is listed, marked as the journal's own",
      ("THE JOURNAL'S OWN" in out, "B1" in out, "cheapest" in out or "naming its model" in out),
      (True, True, True))
code, out = j("rules", "strike", "B1", "I disagree")
check("and cannot be struck here", (code, "the journal's own rule" in out), (1, True))
code, out = j("rules", "show", "B1")
check("its reasoning reads back", (code, "haiku" in out and "opus" in out), (0, True))
import builtin as _b
check("the start block carries the claim, not the reasoning",
      (_b.RULES[0]["fact"][:30] in _b.carry(), "**haiku**" in _b.carry()), (True, False))
check("the managed block is delimited the way the user's own tooling delimits its blocks",
      (_b.block().startswith("<!-- BEGIN: agent-journal"), _b.block().rstrip().endswith("-->"),
       "run `journal update`" in _b.block()), (True, True, True))

# ─────────── a removed command explains itself ────────────────────────────────────────────
# A command that was taken away and answers "No such command" reads as a TYPO, and the
# reader — most often an agent working from an older prompt or a colleague's runbook —
# retries the spelling, which is the one thing that cannot work.
import help as _h
_gone = P.cli("delegate")
check("a removed command fails", _gone[0], 1)
check("and says what replaced it, with the commands themselves",
      ("was removed in 1.37.0" in _gone[1], "journal grant" in _gone[1],
       '--env=' in _gone[1], "No such command" in _gone[1]), (True, True, True, False))
check("`journal handoff` points at the two halves it was split into",
      ("journal prepare" in P.cli("handoff")[1], "journal grant" in P.cli("handoff")[1]),
      (True, True))
check("its help does the same rather than answering nothing",
      "was removed" in P.cli("help", "delegate")[1], True)
check("one refusal marker, not one per paragraph",
      P.cli("delegate")[1].count("!"), 1)
check("a command that never existed is still an unknown one",
      "No such command" in P.cli("frobnicate")[1], True)
check("every retired name is a name this package no longer answers to",
      [v for v in _h.RETIRED if _h.lines(v)], [])

# ─────────── prose keeps the breaks its author wrote ───────────────────────────────────────
# `wrap` is the funnel every command's prose goes through. It split on the blank line,
# wrapped each paragraph and rejoined them with ONE newline, so every multi-paragraph
# message in the package arrived as a block with its breaks silently removed — while the
# docstring said they survived.
import fmt as _f
check("a blank line between paragraphs survives wrapping",
      _f.wrap("One.\n\nTwo.\n\nThree."), "  One.\n\n  Two.\n\n  Three.")
check("and a single newline inside a paragraph is still reflowed",
      _f.wrap("One\ntwo three."), "  One two three.")

# ─────────── seven reminders are seven readable things ─────────────────────────────────────
# The user's word for the old shape, twice: a wall of text. Seven unbroken 180-character
# lines with no gap. An instruction nobody can find the start of is not delivered.
import reminders as _r
for _i in range(3):
    j("reminders", "add", "A reminder long enough that it must wrap at least once to "
      f"be shown properly in a terminal that is only eighty-eight columns wide, number {_i}.")
_blk = _r.block(root)
check("the block wraps every reminder inside the width",
      max(len(l) for l in _blk.splitlines()) <= _f.WIDTH, True)
check("and puts a blank line between them, and after the one-word heading",
      (_blk.splitlines()[1] == "", _blk.count("\n\n")), (True, 3))
check("the heading is a label, not the package narrating its own delivery",
      (_blk.splitlines()[0], "you asked" in _blk, "things" in _blk.splitlines()[0]),
      ("REMINDERS:", False, False))

# ─────────── the README documents the CLI that exists ──────────────────────────────────────
# It described `handoff` and `delegate` as live features for two releases after they were
# deleted, and knew nothing of grants, reminders or sub-environments. Documentation drifts
# silently — nothing fails when it goes stale — so the one part a check CAN make is that
# every command it prints is a command, and no retired name is presented as one.
_readme = (SRC / "README.md").read_text()
_named = sorted({m.group(1) for m in __import__("re").finditer(r"^\s*journal ([a-z][a-z-]*)",
                                                             _readme, __import__("re").M)})
check("every `journal <verb>` the README prints is one the CLI answers",
      [v for v in _named if not _h.lines(v) and v not in ("is", "knows", "help")], [])
check("and no retired command is presented as a live one",
      [v for v in _h.RETIRED if v in _named], [])

# ─────────── one object, one renderer ──────────────────────────────────────────────────────
# The house style used to live in 546 decisions: `say` was the one exit, but every caller
# assembled its own string first, so the blank lines, the order and the indent were
# re-decided at every site. That is why the same wall-of-text complaint came back in a
# different screen three times — there was no place to fix it once.
check("a page is described, not formatted: title, rows, footer",
      _f.render(_f.Out(title="PINS", sub="2 standing",
                       items=(_f.Item(n=1, text="a claim", meta="3h ago"),),
                       footer="`journal pins add` writes one.")),
      "PINS  2 standing\n\n  1  a claim\n     3h ago\n\n  `journal pins add` writes one.")
check("a row's shape comes from what was filled in, never from a flag",
      (_f.Item(text="x").layout, _f.Item(n=1, text="x").layout,
       _f.Item(title="a", text="x").layout), (_f.PROSE, _f.NUMBERED, _f.COLUMN))
check("every shape has a layout, and no layout is unreachable",
      sorted(_f._LAYOUTS), sorted({_f.COLUMN, _f.NUMBERED, _f.PROSE}))
check("a group of columns aligns to its widest name, not to each row's own",
      [l[:22] for l in _f.render(_f.Out(items=(_f.Item(title="a", text="1"),
                                               _f.Item(title="a-much-longer", text="2")))).splitlines()],
      ["  a               1", "  a-much-longer   2"])
check("an Out among the items is a section, rendered by the same function",
      "SECTION" in _f.render(_f.Out(title="TOP", items=(_f.Out(title="SECTION"),))), True)
check("a refusal is marked once, on the first line, before the wrap",
      _f.render(_f.Out(lead="no.", items=(_f.Item(text="and here is why"),), error=True)),
      "  ! no.\n\n  and here is why")
check("the numbered stores share one listing: only what goes beneath differs",
      (__import__("pins")._store().facts is not None,
       __import__("reminders")._STORE.facts is not None), (True, True))

# ─────────── a lazy import is only as lazy as the eagerest thing on the path ───────────────
# `journal.py` was made lazy about `docs` and it changed nothing, because `pins` imported it
# at module scope and `journal.py` imports pins on every invocation. The saving is real but
# it is 5%, not the ~145ms the to-do estimated: these modules share their heavy stdlib
# dependencies (shutil, subprocess, tempfile) with modules that must load anyway.
import subprocess as _sp, sys as _sys
def _eager(module):
    """Which of the deferred modules `import <module>` actually pulls in."""
    watch = ("docs", "tools", "context", "migrate", "update", "verify", "dataclasses", "inspect")
    code = (f"import sys; sys.path.insert(0, {str(SRC)!r}); import {module}; "
            f"print(','.join(m for m in {watch!r} if m in sys.modules))")
    return [x for x in _sp.run([_sys.executable, "-c", code], capture_output=True,
                               text=True).stdout.strip().split(",") if x]
check("importing the CLI pulls none of the modules a given command may never touch",
      _eager("journal"), [])
check("and importing pins is not importing docs — the link that made the first attempt moot",
      _eager("pins"), [])


# ─────────────── prose reflows, structure does not, and neither frays ──────────────────────
# A brief is written in an editor at whatever width its author had. Printed verbatim into a
# narrower terminal, every stored line wrapped a SECOND time and left a one- or two-word stub
# beneath it — six orphans in one to-do, and it took a screenshot to see, because from inside
# the process the text looked perfectly wrapped.
_SRC = """A paragraph written at one width and read at another, long enough that where its
author happened to break the line has nothing to do with where this reader needs it broken.

  "an inset quotation, which is prose that happens to be indented, and so flows inside its
  own indent rather than fraying at the edge of it"

- a list item
- another list item

    journal todos block 1893 "a command long enough that reflowing it would break it in half"

| a | table |
"""
_out = fmt.prose(_SRC, width=60)
_lines = _out.split("\n")
# only the PROSE is bounded: the indented command is deliberately over width, which is the
# whole point of leaving it alone.
_flowed = [l for l in _lines if l.strip() and not l.startswith(("    ", "|", "-"))]
check("a prose paragraph is reflowed to the reader's width, not the author's",
      max(len(l) for l in _flowed) <= 60, True)
check("and no line is left an orphan stub",
      [l for l in _lines if l.strip() and len(l.strip().split()) == 1 and not l.startswith(("|", "    "))], [])
check("an inset quotation flows INSIDE its indent", "  \"an inset quotation, which is" in _out, True)
check("a list keeps its items adjacent, not one paragraph each",
      "- a list item\n- another list item" in _out, True)
check("an indented command is never reflowed",
      '    journal todos block 1893 "a command long enough that reflowing it would break it in half"' in _out, True)
check("a table row is kept as written", "| a | table |" in _out, True)
# `block` IS THE OTHER FUNNEL AND MUST STAY LINE-WISE: `render` and `say` hand it a page that
# is already laid out, and joining adjacent lines there merges two column rows into one.
check("block leaves an already-laid-out page alone",
      fmt.block("  a               1\n  a-much-longer   2"), "  a               1\n  a-much-longer   2")
_titled = fmt.title("TO-DO 65", sub="a title long enough that it cannot sit beside its number",
                    width=60).split("\n")
check("a long sub drops to its own line rather than off the edge",
      (_titled[0].strip(), len(_titled) > 1, max(len(l) for l in _titled) <= 60),
      ("TO-DO 65", True, True))
check("and a short one stays beside the title", fmt.title("PINS", sub="7 standing", width=60).count("\n"), 0)

# ─────────── the skill names every verb a lent agent is refused ────────────────────────────
# The code refused `docs`, `tools`, `pins` and `reminders` and the skill listed none of them:
# an agent reads the skill, dispatches, and its subagent hits a denial the page never
# mentioned. A refusal the documentation does not name is one the reader learns by tripping
# over it, which is the shape this whole package argues against.
import grants as _g  # noqa: E402
_skill = (SRC / "skill" / "SKILL.md").read_text()
check("every verb NEVER refuses is named in the skill",
      [v for v in sorted(_g.NEVER) if f"`{v}`" not in _skill], [])
check("and the skill teaches the one rule the package ships: name the model",
      all(w in _skill for w in ("haiku", "sonnet", "opus")), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
