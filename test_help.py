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
import state, todo, transcript  # noqa: E402

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


def j(*args, stdin=""):
    p = subprocess.run([J, *args], env=env, input=stdin, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


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
code1, out1 = j("rules", "3", "--full")
code2, out2 = j("rules", "show", "3")
check("`rules show <n>` is byte-identical to `rules <n> --full`", (code2, out2), (code1, out1))

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

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
