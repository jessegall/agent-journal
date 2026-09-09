#!/usr/bin/env python3
"""What `journal cleanup` may and may not call stale.

    .journal/test_cleanup.py

THE FALSE POSITIVE IS THE FAILURE MODE HERE. A checker that flags a claim which is
perfectly true teaches the reader to skim the list, and a skimmed list is worse than no
list: the one real finding goes past with the noise. So half of these tests are about what
must NOT appear — prose that merely contains the word `journal`, a path that moved rather
than died, a doc still being written, an environment somebody is on.

Every test runs against a throwaway directory. It never touches the real record.
"""
import os, sys, tempfile, time
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import cleanup, docs as docs_mod, pins, state, tracks, work  # noqa: E402
import todo as todo_mod  # noqa: E402

AT = "2026-09-01T12:00:00+00:00"
OLD = "2026-01-01T12:00:00+00:00"
ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def fresh() -> Path:
    d = Path(tempfile.mkdtemp()) / "project" / ".journal"
    d.mkdir(parents=True)
    return d


def flat(text):
    """One line: the renderer wraps to 88 columns, and a test should not assert on that."""
    return " ".join(text.split())


def kinds(found):
    return sorted({f["kind"] for f in found})


def texts(found, kind):
    return [f["text"] for f in found if f["kind"] == kind]


# ------------------------------------------------------------- dangling references
r = fresh()
(r.parent / "real.py").write_text("x = 1\n")
pins.add(r, "real.py holds the parser", AT, 200)
pins.add(r, "gone.py holds the parser", AT, 200)
pins.add(r, "the package lives in ~/projects/agent-journal from now on", AT, 200)
pins.add(r, "every journal command and hook is missing without it", AT, 200)
pins.add(r, "the pin command is `journal pins add`; remember is its alias", AT, 200)
pins.add(r, "read it with `journal ponder <n>` before answering", AT, 200)

found = cleanup.candidates(r, "default")
check("a pin naming a file that is not there is a candidate",
      texts(found, "pin"), ["gone.py holds the parser", "read it with `journal ponder <n>` before answering"])
check("a pin naming a file that IS there is not", "real.py" in str(found), False)
check("`agent-journal from now on` is prose, not a command", "from now on" in str(found), False)
check("`every journal command` is prose, not a command", "and hook is missing" in str(found), False)
check("a real command spelling is not flagged", "remember is its alias" in str(found), False)
check("the fix is the strike that retires it",
      [f["fix"] for f in found if f["kind"] == "pin"][0], 'journal pins strike 2 "<why>"')

# a generated file inside .journal/ comes and goes: its absence proves nothing
r2b = fresh()
pins.add(r2b, "the runner reads every generated `.journal/handoff.md`", AT, 200)
check("a path under .journal/ is not called gone", cleanup.candidates(r2b, "default"), [])

# a file that MOVED is not a file that died: the path is stale, the claim is not
r2 = fresh()
(r2.parent / "src").mkdir()
(r2.parent / "src" / "moved.py").write_text("x = 1\n")
pins.add(r2, "old/place/moved.py is the entry point", AT, 200)
check("a file that moved is not called gone", cleanup.candidates(r2, "default"), [])

# a struck pin is already retired and is never offered again
r3 = fresh()
pins.add(r3, "gone.py holds the parser", AT, 200)
pins.strike(r3, 1, "the file went")
check("a struck pin is not a candidate", cleanup.candidates(r3, "default"), [])

# rules are checked the same way, and reported as rules
r4 = fresh()
pins.add(r4, "never edit vanished.py by hand", AT, 200, key=pins.RULES)
found = cleanup.candidates(r4, "default")
check("a rule with a dead reference is a candidate", kinds(found), ["rule"])
check("and it says it binds every environment", found[0]["where"], "every environment")
check("with the rule's own strike", found[0]["fix"], 'journal rules strike 1 "<why>"')

# ------------------------------------------------------------- docs
r5 = fresh()
docs_mod.add(r5, "a doc on a live environment", "abstract", "body", "default")
docs_mod.add(r5, "a doc on a dead environment", "abstract", "body", "vanished")
found = cleanup.candidates(r5, "default")
check("a doc whose environment is gone is a candidate", texts(found, "doc"), ["a doc on a dead environment"])
check("a doc on a live environment is not", "a doc on a live environment" in str(found), False)

# ------------------------------------------------------------- to-dos
r6 = fresh()
todo_mod.add(r6, "default", "one that waits", "brief", OLD)
todo_mod.ask(r6, "default", 1, "which way?")
found = cleanup.candidates(r6, "default")
check("a to-do that has waited on the user is a candidate", kinds(found), ["to-do"])
todo_mod.answer(r6, "default", 1, "that way")
check("once answered it is not", cleanup.candidates(r6, "default"), [])

# ------------------------------------------------------------- environments
r7 = fresh()
tracks.switch(r7, "empty-one", AT)
tracks.switch(r7, "default", AT)
found = cleanup.candidates(r7, "default")
check("an environment with nothing on it is a candidate", texts(found, "environment"), ["empty-one"])
check("and the fix is the removal", [f["fix"] for f in found][0],
      'journal environments remove "empty-one" --yes')
check("the start environment is never offered", "default" in texts(found, "environment"), False)

tracks.switch(r7, "empty-one", AT)
todo_mod.add(r7, "empty-one", "something to do", "brief", AT)
tracks.switch(r7, "default", AT)
check("an environment with a to-do on it is not empty",
      texts(cleanup.candidates(r7, "default"), "environment"), [])

r8 = fresh()
tracks.switch(r8, "busy", AT)
work.start(r8, "something open", AT)
tracks.switch(r8, "default", AT)
check("an environment with open work on it is not empty",
      texts(cleanup.candidates(r8, "default"), "environment"), [])

# ------------------------------------------------------------- the report itself
r9 = fresh()
pins.add(r9, "a rule that still holds", AT, 200, key=pins.RULES)
out = flat(cleanup.report(r9, "default"))
check("with nothing to flag it still says so", "Nothing here has evidence against it" in out, True)
check("it does not print the claims — that is the reading pass",
      "a rule that still holds" in out, False)
check("it says why an empty findings list is not a clean record",
      "Only reading finds it" in out, True)
check("nothing is struck by reporting", [p["struck"] for p in pins._all(r9, pins.RULES)], [None])

# ------------------------------------------------------------- the reading pass
r10 = fresh()
pins.add(r10, "a rule that only a reader could judge", AT, 200, key=pins.RULES)
pins.add(r10, "a pin that only a reader could judge", AT, 200)
check("nothing mechanical to find", cleanup.candidates(r10, "default"), [])
check("and the record says so", "never done on this environment" in flat(cleanup.report(r10, "default")), True)
check("the report points at the second half", "journal cleanup read" in flat(cleanup.report(r10, "default")), True)

out = flat(cleanup.reading(r10, "default", AT))
check("the reading pass prints the rule whole", "a rule that only a reader could judge" in out, True)
check("and the pin", "a pin that only a reader could judge" in out, True)
check("with the strike beside each", 'journal rules strike 1 "<why>"' in out, True)
check("and the questions to ask", flat(cleanup.QUESTIONS[0])[:30] in out, True)
check("nothing is struck by reading it", [p["struck"] for p in pins._all(r10)], [None])
check("the pass is stamped", cleanup.days_since_read(r10, "default") is not None, True)
check("and the report stops saying never",
      "never done" in flat(cleanup.report(r10, "default")), False)
check("a stamp is per environment", cleanup.last_read(r10, "elsewhere"), "never done on this environment")
check("reading with mark=False leaves no stamp",
      (cleanup.reading(r10, "untouched", AT, mark=False),
       cleanup.days_since_read(r10, "untouched")) [1], None)

# NEVER-READ IS NOT OVERDUE: a young record is not nagged
r12 = fresh()
pins.add(r12, "a claim made just now", "2026-09-07T12:00:00+00:00", 200, key=pins.RULES)
check("a record whose claims are new owes no reading pass", cleanup.owed(r12, "default"), False)
r13 = fresh()
pins.add(r13, "a claim nobody has re-read", OLD, 200, key=pins.RULES)
check("one with old claims and no pass does", cleanup.owed(r13, "default"), True)
cleanup.reading(r13, "default", "2026-09-07T12:00:00+00:00")
check("and stops owing once it is done", cleanup.owed(r13, "default"), False)
check("an empty record never owes one", cleanup.owed(fresh(), "default"), False)

# a claim is never truncated in the reading pass: judging an opening is how a rule survives
r11 = fresh()
long_one = ("a rule long enough that the findings list would cut it at seventy characters, "
            "which is exactly where the part that has stopped being true tends to live")
pins.add(r11, long_one, AT, 400, key=pins.RULES)
check("the reading pass keeps the whole claim",
      long_one.split()[-1] in " ".join(cleanup.reading(r11, "default", AT).split()), True)

# THE READING PASS MUST POINT AT THE STORE IT IS READING. A rule with a long form was
# offered `journal pins show <n>` — a different claim, in a different store, same number.
r14 = fresh()
pins.add(r14, "a ruling with reasoning behind it", AT, 400, key=pins.RULES, long="the argument")
pins.add(r14, "a pin with reasoning behind it", AT, 400, long="the argument")
out = cleanup.reading(r14, "default", AT)
check("a rule's long form is read with `rules show`", "journal rules show 1" in out, True)
check("and never with `pins show`, which is another claim entirely",
      "journal pins show 1" in out.split("PINS")[0], False)
check("a pin's long form is still read with `pins show`", "journal pins show 1" in out, True)

# THE STORE THAT IS READ ALOUD MOST OFTEN was the one the checker did not look at.
import reminders as reminders_mod
r15 = fresh()
reminders_mod.add(r15, "run `journal nosuchverb` before every commit", AT, 200)
reminders_mod.add(r15, "keep touching gone_forever_xyz.py", AT, 200)
reminders_mod.add(r15, "a reminder that names nothing at all", AT, 200)
found = {f["text"] for f in cleanup.candidates(r15, "default")}
check("a reminder naming a verb the CLI does not answer to is a candidate",
      "run `journal nosuchverb` before every commit" in found, True)
check("so is one naming a file that is not in the project",
      "keep touching gone_forever_xyz.py" in found, True)
check("and one that names nothing checkable is left alone",
      "a reminder that names nothing at all" in found, False)
out = cleanup.reading(r15, "default", AT)
check("the reading pass lists them, because only a reader can judge an --until",
      ("REMINDERS — 3" in out, "3 reminder(s)" in out), (True, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
