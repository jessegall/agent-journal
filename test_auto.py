#!/usr/bin/env python3
"""Every edge of `todo auto`: the switch that lets the agent work through an environment on its own.

    .journal/test_auto.py

THIS IS THE FEATURE THAT MAKES THE AGENT AUTONOMOUS, so every state the stop hook can
find it in is driven here, through the real hook binary with real payloads, in a
throwaway project. The first live run found the shape of the bug this guards against: the
agent's work had ended in its own mind and not in the journal's, auto was on, and the
list sat. Nothing about that looked broken.

Two invariants, checked in every scenario:
  - with auto on, EVERY stop with the list waiting is held — finishing a thing and
    stopping brings the next — except the stop that follows a hold in the same turn
    (the harness's `stop_hook_active`), so an agent that answered a hold can end its turn
    and is never trapped;
  - with auto off, nothing is ever held for the list; it is mentioned once per state.
"""
import json, os, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"  # no network from the hooks under test
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"  # a pull inside a suite runs no suites

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, testkit, todo, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def project():
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal",
                    ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*",
                                                  "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
    (d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 1000000}))
    tdir = transcript.project_dir(d)
    tdir.mkdir(parents=True, exist_ok=True)
    return d


class Session:
    """One transcript of the project, driven the way the harness drives it."""

    def __init__(self, d, stem):
        self.d, self.stem = d, stem
        self.path = transcript.project_dir(d) / f"{stem}.jsonl"
        self.path.write_text("")
        self.J = str(d / ".journal" / "journal.py")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.P = testkit.Project(d)
        self.n = 0

    def fire(self, event, **extra):
        return self.P.hook(event, session_id=self.stem,
                           transcript_path=str(self.path), **extra)[1]

    def say(self, text, who="assistant"):
        self.n += 1
        with self.path.open("a") as fh:
            if who == "user":
                fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": f"u{self.n}",
                                     "message": {"role": "user", "content": text}}) + "\n")
            else:
                fh.write(json.dumps({"type": "assistant", "uuid": f"a{self.n}", "message": {
                    "role": "assistant", "content": [{"type": "text", "text": text}],
                    "usage": {"input_tokens": 1000}}}) + "\n")

    def journal(self, *args):
        return self.P.cli(*args, session=self.stem)

    def stop(self, after_hold=False):
        """(label the user sees, text the agent reads) of this stop, or ('', '') if silent.

        `after_hold` is the harness's `stop_hook_active`: this stop follows a hold in the
        same turn, i.e. the agent has already answered the hold once.
        """
        out = self.fire("Stop", stop_hook_active=after_hold)
        if not out.strip():
            return "", ""
        label, ctx = testkit.hold(out)
        if not label:
            return "", ctx
        details = state.get(self.d / ".journal", "next_text", "", stem=self.stem) if "journal.py next" in ctx else ""
        return "journal reminded Claude: " + label, "journal: " + ctx + ("\n" + details if details else "")

    def start(self, source="startup"):
        out = self.fire("SessionStart", source=source)
        return json.loads(out)["hookSpecificOutput"]["additionalContext"]


AUTO_NEXT = "journal reminded Claude: auto is on, "
AUTO_OPEN = "journal reminded Claude: auto is on, work still open"


# ---------------------------------------------------------------- the basic cycle
d = project()
s = Session(d, "s1")
s.journal("todo", "first chore")
s.journal("todo", "second chore")
s.journal("todo", "third chore")
s.start()
s.say("hello", "user"); s.say("[!reply] hi")
label, text = s.stop()
# HELD AND SAID ARE THE SAME SHAPE NOW. Both travel in additionalContext and both re-open
# the turn — the reference is explicit about it — so an empty label no longer means "said
# rather than held". What is worth asserting is which subject spoke, and that it does not
# read as an instruction.
check("auto off: an idle stop says what waits, and does not instruct",
      (label, "not an instruction" in text), ("journal reminded Claude: 3 to-do(s) waiting on `default`", True))
s.journal("todo", "auto", "on")
label, text = s.stop()
check("auto on with the same list: the flag change is a new state, held, naming to-do 1",
      (label, "todos start 1" in text), (AUTO_NEXT + "3 to-do(s) waiting", True))
label, text = s.stop()
check("the next turn's stop, same state: held AGAIN — every stop while the list waits", label, AUTO_NEXT + "3 to-do(s) waiting")
label, text = s.stop(after_hold=True)
check("the stop that follows the hold in the same turn passes, so an agent that answered is not trapped", label, "")
s.journal("todo", "start", "1")
label, text = s.stop()
check("a started to-do is open work: held once to end it or park the rest, not the plain still-open hold",
      (label, "first chore" in text, "park what is left" in text), (AUTO_OPEN, True, True))
label, text = s.stop(after_hold=True)
check("the stop after that hold passes", label, "")
label, text = s.stop()
check("a new turn with the same open work: held again", label, AUTO_OPEN)
s.journal("end", "first chore", "--todo")
label, text = s.stop()
check("ended: the next idle stop names to-do 2", (label, "todos start 2" in text), (AUTO_NEXT + "2 to-do(s) waiting", True))
s.journal("todo", "done", "2", "turned out unnecessary")
label, text = s.stop()
check("a to-do done without starting changes the list: to-do 3 is named", (label, "todos start 3" in text), (AUTO_NEXT + "1 to-do(s) waiting", True))
s.journal("todo", "start", "3"); s.journal("end", "third chore", "--todo")
label, text = s.stop()
check("the list is empty: silent", label, "")
s.journal("todo", "fourth chore")
label, text = s.stop()
check("a new to-do on an empty list: held for it", (label, "todos start 4" in text), (AUTO_NEXT + "1 to-do(s) waiting", True))
s.journal("todo", "drop", "4", "no longer wanted")
label, text = s.stop()
check("dropped: silent again", label, "")

# ---------------------------------------------------------------- parking the remainder
d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on")
s.journal("todo", "chore a"); s.journal("todo", "chore b")
s.journal("start", "the sweep")
s.start()
label, text = s.stop()
check("auto on, unrelated work open, to-dos waiting: held once to end or park", label, AUTO_OPEN)
s.journal("todo", "the sweep: ReferenceDemo waits on the user's ruling")
s.journal("end", "the sweep")
label, text = s.stop()
check("remainder parked and the work ended: the next stop starts the list at to-do 1",
      (label, "todos start 1" in text), (AUTO_NEXT + "3 to-do(s) waiting", True))

# ---------------------------------------------------------------- work opened elsewhere
d = project(); s1 = Session(d, "s1"); s2 = Session(d, "s2")
s1.journal("todo", "auto", "on"); s1.journal("todo", "chore")
s2.journal("start", "another session's work")
s1.start()
label, text = s1.stop()
check("work opened by another session still counts as open: held to end it or park",
      (label, "another session's work" in text), (AUTO_OPEN, True))
s2.journal("end", "another session's work")
label, text = s1.stop()
check("once that ends, the list starts", label, AUTO_NEXT + "1 to-do(s) waiting")

# ---------------------------------------------------------------- open work, no to-dos
d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("start", "some work"); s.start()
label, text = s.stop()
check("auto on, work open, nothing waiting: still held — open work is never a way to go quiet",
      (label, "never left standing" in text), (AUTO_OPEN, True))
label, text = s.stop(after_hold=True)
check("the stop after the hold passes", label, "")
label, text = s.stop()
check("and the next turn is held again", label, AUTO_OPEN)
s.journal("end", "some work")
label, text = s.stop()
check("nothing open, nothing waiting: silent", label, "")

# ---------------------------------------------------------------- switching auto off
d = project(); s = Session(d, "s1")
s.journal("todo", "chore"); s.journal("todo", "auto", "on"); s.start()
label, _ = s.stop()
check("held with auto on", label, AUTO_NEXT + "1 to-do(s) waiting")
s.journal("todo", "auto", "off")
label, text = s.stop()
check("auto off is a new state: the plain reminder, not an instruction",
      (label.endswith("to-do(s) waiting on `default`"), "not an instruction" in text), (True, True))
label, text = s.stop()
check("and silent after", (label, text), ("", ""))
s.journal("todo", "auto", "on")
label, _ = s.stop()
check("on again: held again", label, AUTO_NEXT + "1 to-do(s) waiting")

# ---------------------------------------------------------------- per environment
d = project(); s = Session(d, "s1")
s.journal("todo", "default chore"); s.journal("todo", "auto", "on")
s.journal("switch", "default")   # it chooses one: `--back` returns to what was chosen, not to a fallback
s.journal("switch", "other")
s.journal("todo", "other chore")
s.start()
label, text = s.stop()
check("on an environment with auto off, its own list is a reminder only",
      (label.endswith("waiting on `other`"), "not an instruction" in text), (True, True))
s.journal("switch", "--back")
label, text = s.stop()
check("back on the auto environment: held for its list", (label, "default chore" in text), (AUTO_NEXT + "1 to-do(s) waiting", True))

# ---------------------------------------------------------------- other holds come first
d = project(); s = Session(d, "s1")
s.journal("todo", "chore"); s.journal("todo", "auto", "on"); s.start()
s.say("go", "user"); s.say("no tag on this one")
label, text = s.stop()
check("an untagged message is held before auto", label, "journal reminded Claude: 1 untagged message(s)")
s.say("[!reply] tagged now")
label, text = s.stop()
check("then the auto hold at the next stop", label, AUTO_NEXT + "1 to-do(s) waiting")

d = project(); s = Session(d, "s1")
s.journal("todo", "chore"); s.journal("todo", "auto", "on"); s.start()
with s.path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {"role": "assistant",
             "content": [{"type": "text", "text": "[!reply] big"}], "usage": {"input_tokens": 600000}}}) + "\n")
label, text = s.stop()
check("a context rung is held before auto", label.startswith("journal reminded Claude: context"), True)
s.journal("nothing", "only chores")
label, text = s.stop()
check("then the auto hold", label, AUTO_NEXT + "1 to-do(s) waiting")

# ---------------------------------------------------------------- a new session, a compaction
d = project(); s1 = Session(d, "s1")
s1.journal("todo", "chore one"); s1.journal("todo", "chore two"); s1.journal("todo", "auto", "on")
ctx = s1.start()
# THE DOORWAY SAYS AUTO IS ON, AND THAT IS THE ONE LISTING IT REPLACES WITH AN ORDER.
# Everything else the block used to inline is readable on demand; a standing order is not
# readable at all — a session in auto that is not told so simply stops.
check("the doorway says auto is on and how to proceed",
      ("AUTO IS ON" in ctx, "todos start <n>" in ctx, "not an instruction" in ctx), (True, True, False))
check("and it does NOT list the to-dos — the count and the command stand in for them",
      ("chore one" in ctx, "journal todos" in ctx), (False, True))
s1.stop()
s2 = Session(d, "s2")
ctx = s2.start()
check("a fresh session gets the same block", "AUTO IS ON" in ctx, True)
label, text = s2.stop()
check("and its first idle stop is held, its own marks being clean", label, AUTO_NEXT + "2 to-do(s) waiting")
ctx = s1.start("compact")
check("after a compaction the block still says auto is on", "AUTO IS ON" in ctx, True)
label, text = s1.stop()
check("and its next stop is held, as every stop is with auto on", label, AUTO_NEXT + "2 to-do(s) waiting")
s1.journal("todo", "start", "1"); s1.journal("end", "chore one", "--todo")
label, text = s1.stop()
check("a change after the compaction is held", label, AUTO_NEXT + "1 to-do(s) waiting")

# ---------------------------------------------------------------- the status views agree
d = project(); s = Session(d, "s1")
s.journal("todo", "chore"); s.journal("todo", "auto", "on")
code, out = s.journal("todo")
check("the list says auto ON", "auto ON" in out, True)
code, out = s.journal()
check("the status page says auto on", "1 waiting, auto on" in out, True)
code, out = s.journal("todo", "auto")
check("todo auto alone reports the state", "auto is ON" in out, True)
s.journal("start", "w")
code, out = s.journal("todo", "auto", "on")
check("auto on with work open says what the agent is working on", "Agent currently working on: w" in out, True)

# ---------------------------------------------------------------- waiting on the user
d = project(); s = Session(d, "s1")
s.journal("todo", "needs a ruling"); s.journal("todo", "plain chore"); s.journal("todo", "another ruling")
s.journal("todo", "auto", "on"); s.start()
label, text = s.stop()
check("the hold names to-do 1 and says how to put a question on the record", (label, "todos start 1" in text, "todos ask 1" in text), (AUTO_NEXT + "3 to-do(s) waiting", True, True))
code, out = s.journal("todo", "ask", "1")
check("ask wants the question", code, 1)
code, out = s.journal("todo", "ask", "1", "Empty, None or Void for the component name?")
check("ask puts the question on the record", (code, "waits on the user" in out), (0, True))
label, text = s.stop(after_hold=True)
check("the stop after asking passes", label, "")
label, text = s.stop()
check("the next turn's hold skips it and names to-do 2, showing the question beside 1",
      (label, "todos start 2" in text, "waits on the user: Empty, None or Void" in text), (AUTO_NEXT + "3 to-do(s) waiting", True, True))
code, out = s.journal("todo")
check("the list shows the question under the to-do", ("waits on the user" in out, "? Empty, None or Void" in out), (True, True))
code, out = s.journal()
check("the status page counts it", "3 waiting, 1 on the user, auto on" in out, True)
ctx = s.start()
# THE QUESTIONS DO NOT CROSS, THE FACT THAT THERE ARE SOME DOES. A question's text is
# readable on demand; injecting it charged the window for something the agent could not act
# on until the user had spoken anyway.
check("the doorway counts what waits on the user rather than quoting it",
      ("waiting on the user: Empty" in ctx, "journal todos" in ctx), (False, True))
check("and `journal carry` still has it in full",
      "waiting on the user: Empty" in s.journal("carry")[1], True)
s.journal("todo", "start", "2"); s.journal("end", "plain chore", "--todo")
s.journal("todo", "ask", "3", "keep or drop the abstract Wizard factory?")
label, text = s.stop()
check("every remaining to-do waits on the user, and nothing is asked of the agent",
      ("nothing on the list can be picked up" in label, "what each waits on" in text), (True, True))
label, text = s.stop()
check("and not repeated for the same state", (label, text), ("", ""))
s.say("None. And drop the factory.", "user")
code, out = s.journal("todo", "start", "1")
check("the user answered: start picks it up; the question stays as history", (code, bool(todo._get(d / ".journal", "default", 1)[0].get("started"))), (0, True))
label, text = s.stop()
check("that to-do is open work now: the open hold", label, AUTO_OPEN)
s.journal("end", "needs a ruling", "--todo")
label, text = s.stop()
check("with 3 still waiting on the user, the idle stop says so once more",
      "nothing on the list can be picked up" in label, True)
s.journal("todo", "auto", "off")
code, out = s.journal("todo", "ask", "3", "still?")
check("ask works with auto off too — it is a fact about the to-do", code, 0)
code, out = s.journal("todo", "done", "3", "dropped per the user")
check("a to-do waiting on the user can be closed without starting", code, 0)
code, out = s.journal("todo", "ask", "3", "again")
check("but not asked once done", code, 1)

# ---------------------------------------------------------------- open work is never a way to go quiet
# Every way a piece of work can be open at a stop while auto is on, and every one is held
# at every turn. The only stop that passes is the one that follows a hold.
d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("start", "w"); s.start()
labels = [s.stop()[0] for _ in range(5)]
check("five turns in a row with work open: held five times", labels, [AUTO_OPEN] * 5)
s.journal("work", "update", "halfway; waiting on nothing")
check("an update does not end it: still held", s.stop()[0], AUTO_OPEN)
code, out = s.journal("end", "the wrong words")
check("end with the wrong words closes nothing", code, 1)
check("and it is still held", s.stop()[0], AUTO_OPEN)
s.journal("start", "second piece")
label, text = s.stop()
# ONE PER LINE, NOT JOINED INTO A SENTENCE. They used to arrive as "w; second piece" inside
# the instruction; nine of them was a paragraph the user sent a screenshot of.
check("two pieces open: held, naming both, one per line",
      (label, "\n  - w\n" in text + "\n", "\n  - second piece\n" in text + "\n"),
      (AUTO_OPEN, True, True))
s.journal("end", "w")
check("one ended, one still open: held", s.stop()[0], AUTO_OPEN)
s.journal("end", "second piece")
check("both ended, nothing waiting: silent", s.stop()[0], "")

d = project(); s = Session(d, "s1")
s.journal("start", "opened before auto"); s.start()
check("auto off: the plain still-open hold, once", (s.stop()[0], s.stop()[0]), ("journal reminded Claude: work still open", ""))
s.journal("todo", "auto", "on")
check("switching auto on with that work open: held from then on, every stop", (s.stop()[0], s.stop()[0]), (AUTO_OPEN, AUTO_OPEN))
s.journal("todo", "auto", "off")
check("switching it off again: quiet (the plain hold was already said for this work)", s.stop()[0], "")

d = project(); s1 = Session(d, "s1"); s2 = Session(d, "s2")
s1.journal("todo", "auto", "on"); s2.journal("start", "opened in s2"); s1.start()
check("work opened by another session: this one is held every stop too", (s1.stop()[0], s1.stop()[0]), (AUTO_OPEN, AUTO_OPEN))
s2.journal("end", "opened in s2")
check("ended over there: silent here", s1.stop()[0], "")

d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("todo", "chore"); s.journal("todo", "start", "1"); s.start()
check("a to-do started is open work: held", s.stop()[0], AUTO_OPEN)
ctx = s.start("compact")
check("after a compaction the block still lists it as open", "chore" in ctx and "STILL OPEN" in ctx, True)
check("and the stop after the compaction is held", s.stop()[0], AUTO_OPEN)
s3 = Session(d, "s3"); s3.start()
check("a fresh session with that work open: held at its first stop", s3.stop()[0], AUTO_OPEN)

d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("start", "w"); s.start()
s.say("go", "user"); s.say("no tag")
check("an untagged message comes first", s.stop()[0], "journal reminded Claude: 1 untagged message(s)")
s.say("[!reply] tagged")
check("then the open-work hold, and it keeps coming", (s.stop()[0], s.stop()[0]), (AUTO_OPEN, AUTO_OPEN))

d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("start", "on default")
s.journal("switch", "default"); s.journal("switch", "other"); s.start()
check("on another environment, default's open work is not this environment's: not held", s.stop()[0], "")
s.journal("switch", "--back")
check("back on default: held", s.stop()[0], AUTO_OPEN)

d = project(); s = Session(d, "s1")
s.journal("todo", "auto", "on"); s.journal("start", "w")
check("a subagent's stop with work open: nothing", s.fire("Stop", agent_id="x").strip(), "")
check("and the stop right after a hold passes, but only that one",
      (s.stop()[0], s.stop(after_hold=True)[0], s.stop()[0]), (AUTO_OPEN, "", AUTO_OPEN))

# ---------------------------------------------------------------- the stall nudge
d = project(); s = Session(d, "s1")
(d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 1000000, "stall_calls": 5}))
s.journal("todo", "auto", "on"); s.journal("todo", "hard one"); s.journal("todo", "start", "1"); s.start()
call = dict(tool_name="Read", tool_input={}, tool_response="x")
outs = [s.fire("PostToolUse", **call) for _ in range(4)]
check("under the limit: silent", [o.strip() for o in outs], [""] * 4)
out = s.fire("PostToolUse", **call)
check("at the limit: the stall nudge, naming the to-do and the way out",
      ("5 tool calls on to-do 1" in out, "todos ask 1" in out), (True, True))
outs = [s.fire("PostToolUse", **call) for _ in range(6)]
check("said once, not on every call after", [o.strip() for o in outs], [""] * 6)
s.journal("work", "update", "found the cause; fixing")
outs = [s.fire("PostToolUse", **call) for _ in range(4)]
check("an update restarts the count: silent again under the limit", [o.strip() for o in outs], [""] * 4)
out = s.fire("PostToolUse", **call)
check("and nudges again at the next limit", "5 tool calls on to-do 1" in out, True)
s.journal("end", "hard one", "--todo")
outs = [s.fire("PostToolUse", **call) for _ in range(6)]
check("with no started to-do there is nothing to count", [o.strip() for o in outs], [""] * 6)
d2 = project(); s2 = Session(d2, "s1")
(d2 / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 1000000, "stall_calls": 0}))
s2.journal("todo", "x"); s2.journal("todo", "start", "1"); s2.start()
outs = [s2.fire("PostToolUse", **call) for _ in range(50)]
check("stall_calls 0 turns it off", any(o.strip() for o in outs), False)

# ---------------------------------------------------------------- the user answers
d = project(); s = Session(d, "s1")
s.journal("todo", "needs a ruling"); s.journal("todo", "plain chore"); s.journal("todo", "auto", "on"); s.start()
s.journal("todo", "ask", "1", "Empty, None or Void?")
label, text = s.stop()
check("asked: the hold skips it and names to-do 2", (label, "todos start 2" in text), (AUTO_NEXT + "2 to-do(s) waiting", True))
code, out = s.journal("todo", "answer", "2", "x")
check("answer refuses a to-do with no question", (code, "not waiting on a question" in out), (1, True))
code, out = s.journal("todo", "answer", "1")
check("answer wants the answer", code, 1)
code, out = s.journal("todo", "answer", "1", "None — it matches Option::none")
check("the user answers from the terminal", (code, "answered to-do 1" in out, "picks it up first" in out), (0, True, True))
label, text = s.stop()
check("the next stop says the user answered, quotes the answer, and hands that to-do first",
      (label, "asked:    Empty, None or Void?" in text, "answered: None — it matches Option::none" in text, "todos start 1" in text),
      ("journal reminded Claude: auto is on, the user answered to-do 1", True, True, True))
code, out = s.journal("todo")
check("the list shows question and answer under the to-do", ("? Empty, None or Void?" in out, "→ None — it matches" in out, "answered by the user" in out), (True, True, True))
code, out = s.journal()
check("the status page counts it", "2 waiting, 1 answered, auto on" in out, True)
code, out = s.journal("todo", "1")
check("the brief shows the exchange", ("THE USER ANSWERED" in out, "→ None — it matches" in out), (True, True))
ctx = s.start()
# AN ANSWERED TO-DO IS THE USER SAYING TO DO IT, so the doorway must say there IS one — a
# count of 2 waiting and a count of 2 waiting with 1 answered look identical otherwise. The
# ANSWER itself is what broke the block: two of them measured 7,014 characters.
check("the doorway says an answered one exists, and does not quote the answer",
      ("ANSWERED by the user: None" in ctx, "has ANSWERED" in " ".join(ctx.split())), (False, True))
check("and `journal carry` still leads with it in full",
      ("ANSWERED by the user: None" in s.journal("carry")[1],
       "pick those up first" in s.journal("carry")[1]), (True, True))
s.journal("todo", "start", "1")
check("started: the answer stays on the record", todo._get(d / ".journal", "default", 1)[0].get("answer"), "None — it matches Option::none")
label, text = s.stop()
check("it is open work now", label, AUTO_OPEN)
s.journal("end", "needs a ruling", "--todo")
label, text = s.stop()
check("then the list continues with to-do 2", (label, "todos start 2" in text), (AUTO_NEXT + "1 to-do(s) waiting", True))

# auto off: an answer is the user's word to do that one
d = project(); s = Session(d, "s1")
s.journal("todo", "q one"); s.journal("todo", "q two"); s.start()
s.journal("todo", "ask", "1", "a or b?"); s.journal("todo", "ask", "2", "c or d?")
label, text = s.stop()
check("auto off, both waiting on the user: the list is reported, not started",
      label.endswith("to-do(s) waiting on `default`"), True)
s.journal("todo", "answer", "2", "d")
label, text = s.stop()
check("auto off: an answered to-do is held once, as the user's word to do it",
      (label, "todos start 2" in text, "answered: d" in text), ("journal reminded Claude: the user answered to-do 2", True, True))
label, text = s.stop(after_hold=True)
check("the stop after passes", label, "")
label, text = s.stop()
check("and the same answered set is not held again", label, "")
s.journal("todo", "answer", "1", "a")
label, text = s.stop()
check("a new answer is a new state: held again, naming the first answered", label, "journal reminded Claude: the user answered to-do 1")
s.journal("todo", "start", "2"); s.journal("end", "q two", "--todo")
label, text = s.stop()
check("after 2 is done, 1 remains answered: held for it", label, "journal reminded Claude: the user answered to-do 1")

# ---------------------------------------------------------------- after another hold, auto still speaks
d = project(); s = Session(d, "s1")
(d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
s.journal("todo", "chore"); s.journal("todo", "auto", "on"); s.start()
s.say("go", "user")
with s.path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {"role": "assistant",
             "content": [{"type": "text", "text": "[!reply] deciding"}], "usage": {"input_tokens": 191000}}}) + "\n")
label, _ = s.stop()
check("the context rung comes first", label.startswith("journal reminded Claude: context 96% full"), True)
s.journal("nothing", "only reads")
label, text = s.stop(after_hold=True)
check("the rung resolved: the same turn raises the auto hold, not silence",
      (label, "todos start 1" in text), (AUTO_NEXT + "1 to-do(s) waiting", True))
label, _ = s.stop(after_hold=True)
check("the stop after auto's own hold passes", label, "")

# ---------------------------------------------------------------- subagents never
d = project(); s = Session(d, "s1")
s.journal("todo", "chore"); s.journal("todo", "auto", "on")
out = s.fire("Stop", agent_id="abc")
check("a subagent's stop is nothing to auto", out.strip(), "")

# ------------------------------------- `journal next` never serves a stale snapshot
# THE HOLD'S DETAILS ARE A PHOTOGRAPH OF ONE STOP. They were written into the runtime file
# and nothing refreshed them, so a loop firing `journal next` every fifteen minutes kept
# being handed the same frozen listing — including to-dos CLOSED since, offered as the next
# thing to do while `journal todo` correctly showed them done. Two commands, one store, two
# answers, and an agent in auto mode reads the wrong one.
d = project(); s = Session(d, "s1")
s.journal("todo", "the one that gets closed")
s.journal("todo", "the one that is really next")
s.journal("todo", "auto", "on")
label, _ = s.stop()
check("the hold sends the agent to `journal next`", label.startswith(AUTO_NEXT), True)
code, first = s.journal("next")
check("`journal next` answers with the hold's details", (code, "the one that gets closed" in first), (0, True))

s.journal("todo", "start", "1")
s.journal("work", "end", "the one that gets closed", "--todo")
code, again = s.journal("next")
check("after that to-do is closed, `journal next` does NOT still offer it",
      (code, "the one that gets closed" in again), (0, False))
check("it names the one that really is next", "the one that is really next" in again, True)
check("and `journal todo` agrees with it, which is the whole point",
      "the one that gets closed" in s.journal("todo")[1].split("done")[0], False)

# ------------------------------------------------- auto without a loop refuses to write
# The whole point of this one: a HOLD can be worked through — once per stop-chain, and it
# arrives when the agent is trying to finish — so auto was being turned on with no loop
# behind it. A denial cannot be stepped over.
def loud():
    """A project with the loop subject NOT silenced: this suite silences it everywhere else."""
    d = project()
    (d / ".journal" / "settings.json").write_text(json.dumps(
        {"one_session_per_environment": False, "context_window": 1000000}))
    return d


def write_call(s):
    out = s.fire("PreToolUse", tool_name="Write",
                 tool_input={"file_path": str(s.d / "x.txt"), "content": "x"})
    if not out.strip():
        return ""
    got = json.loads(out).get("hookSpecificOutput", {})
    return got.get("permissionDecisionReason", "") if got.get("permissionDecision") == "deny" else ""

d9 = loud()
s9 = Session(d9, "s9")
s9.fire("SessionStart", source="startup")
s9.journal("switch", "default")          # unbound is refused for its own reason, first
s9.journal("work", "start", "something to write under")
check("with auto off, a write is not refused for a loop", write_call(s9), "")

s9.journal("todo", "add", "a to-do the loop would pick up")
s9.journal("todos", "auto", "on")
denied = write_call(s9)
check("auto on with no loop refuses the next write", bool(denied), True)
check("and the refusal names the loop command", "journal next" in denied, True)
check("and the two ways out", ("loop set" in denied, "auto off" in denied), (True, True))
check("a READ is never gated",
      s9.fire("PreToolUse", tool_name="Read", tool_input={"file_path": "x"}).strip(), "")
check("and the journal's own CLI is never gated — it is the way out",
      s9.fire("PreToolUse", tool_name="Bash",
              tool_input={"command": ".journal/journal.py loop set"}).strip(), "")

s9.journal("loop", "set")
check("once a loop is known the same write goes through", write_call(s9), "")

def ask_call(s):
    out = s.fire("PreToolUse", tool_name="AskUserQuestion",
                 tool_input={"questions": [{"question": "Which path?", "header": "Path",
                                            "options": [], "multiSelect": False}]})
    if not out.strip():
        return ""
    got = json.loads(out).get("hookSpecificOutput", {})
    return got.get("permissionDecisionReason", "") if got.get("permissionDecision") == "deny" else ""

# A QUESTION TO THE USER HALTS THE SESSION, and auto was switched on to be away.
denied = ask_call(s9)
check("with auto on, AskUserQuestion is refused", bool(denied), True)
check("and the refusal names the two ways out", ("todos ask" in denied, "work update" in denied), (True, True))
s9.journal("todos", "auto", "off")
check("with auto off, the same question goes through", ask_call(s9), "")
s9.journal("todos", "auto", "on")

# turning auto ON says so at the moment it becomes true, not only at the next stop
d10 = loud()
s10 = Session(d10, "s10")
s10.fire("SessionStart", source="startup")
s10.journal("switch", "default")
code, said = s10.journal("todos", "auto", "on")
check("`auto on` teaches the loop in its own confirmation",
      ("START A LOOP NOW" in said, "journal next" in said), (True, True))

# THE HOLD STILL YIELDS. Forcing belongs in the gate, not in a subject that never steps
# aside: a loop hold that re-raised itself every stop starved the queue behind it and the
# chain could not end. It fires once per chain, like every other subject, and the WRITE is
# what is refused meanwhile.
s10.journal("todo", "add", "something for the loop to pick up")
s10.say("working", who="assistant")
first = s10.stop()[0]
again = s10.stop(after_hold=True)[0]
check("the loop hold fires", "loop" in first, True)
check("and then yields, so the queue behind it still drains", "loop" in again, False)

# ─────────── auto predicts the stop, so it must ask the stop's question ────────────────────
# `todos auto on` named the first OPEN to-do while the stop hook it was predicting picks the
# first READY one — so it promised to start a row that waits on the user. Measured live: it
# named a to-do that had been waiting on the user for five hours.
d = project(); s = Session(d, "s1")
s.journal("todo", "waits on a person"); s.journal("todo", "can be worked")
s.journal("todo", "ask", "1", "which way?")
code, out = s.journal("todo", "auto", "on")
check("auto names the first READY to-do, never one the stop would skip",
      ("starts to-do 2" in out, "starts to-do 1" in out), (True, False))
s.journal("todo", "ask", "2", "and this one too?")
s.journal("todo", "auto", "off")
code, out = s.journal("todo", "auto", "on")
check("with every row unstartable it says so, rather than naming one or claiming the list is empty",
      ("none of the 2 waiting to-do(s) can be started" in " ".join(out.split()),
       "nothing is waiting" in out), (True, False))

# ─────────── an unstartable list names EVERY reason, not the first two ─────────────────────
# Measured live: a list holding one to-do waiting on the user and one set aside reported
# "1 set aside on a condition" and never mentioned the question — while `journal next`, asked
# the same thing one command later, reported the question and never mentioned the set-aside
# row. Two messages, two different halves of the truth, neither wrong on its own.
d = project(); s = Session(d, "s1")
s.journal("todo", "one that waits on a person"); s.journal("todo", "one set aside")
s.journal("todo", "auto", "on")
s.journal("todo", "ask", "1", "which way?")
s.journal("todo", "block", "2", "the release has to land first")
label, text = s.stop()
_flat = " ".join((label + " " + text).split())
check("both reasons are counted, and the one the user can act on is first",
      ("1 waiting on your answer" in _flat, "1 set aside on a condition" in _flat), (True, True))

# ─────────── a held listing is shown only while it is still true ───────────────────────────
# `journal next` prints the detail the last hold wrote, and a LISTING of what is waiting goes
# on being handed back after the rows in it are closed. Seen twice in one session: `work end`
# closed a row, printed "to-do N is done with it", and the very next `journal next` offered N
# as the thing to start. Reading it cleared the snapshot, so the second call was right —
# which is how it stayed hidden. `next` is the command auto tells an agent to run, so the one
# stale read lands on the reader least able to notice it.
d = project(); s = Session(d, "s1")
s.journal("todo", "the first row"); s.journal("todo", "the second row")
s.journal("todo", "auto", "on")
label, text = s.stop()
check("the hold's detail lists both rows", ("the first row" in text, "the second row" in text),
      (True, True))
s.journal("todo", "done", "1", "closed behind the snapshot's back")
code, out = s.journal("next")
check("with a row closed since, `next` drops the snapshot and answers live",
      ("the first row" in out, "to-do 2" in out), (False, True))
label, text = s.stop()
s.journal("todo", "add", "a third row")
check("a snapshot the record has not moved past is still shown in full",
      "the second row" in s.journal("next")[1] or "to-do 2" in s.journal("next")[1], True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
