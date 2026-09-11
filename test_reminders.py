#!/usr/bin/env python3
"""Reminders: the one thing here that repeats, and everything that must not break it.

    .journal/test_reminders.py

A reminder is said at EVERY stop and every `reminder_every` tool calls, ahead of the stop
queue and without spending its one slot. So what is tested is mostly the repetition
itself — that it survives a hold, a silenced queue, three stops in a row, and a fresh turn
— plus the parts that are ordinary catalogue behaviour: the cap, the required reason, the
environment it belongs to, and the number that never shifts.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


class S:
    def __init__(self, **conf):
        self.d = Path(tempfile.mkdtemp()) / "proj"
        (self.d / ".claude").mkdir(parents=True)
        testkit.make(self.d, SRC)
        (self.d / ".journal" / "settings.json").write_text(json.dumps(conf))
        tdir = transcript.project_dir(self.d); tdir.mkdir(parents=True, exist_ok=True)
        self.path = tdir / "s1.jsonl"; self.path.write_text("")
        self.J = str(self.d / ".journal" / "journal.py")
        self.env = {**os.environ, transcript.SESSION_ENV: "s1"}
        self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        payload = {"hook_event_name": event, "session_id": "s1",
                   "transcript_path": str(self.path), **extra}
        return subprocess.run([str(self.d / ".journal" / "hook.py")], input=json.dumps(payload),
                              capture_output=True, text=True, timeout=180).stdout

    def user(self, text):
        with self.path.open("a") as fh:
            fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": f"u{len(text)}",
                                 "message": {"role": "user", "content": text}}) + "\n")
        self.fire("UserPromptSubmit", prompt=text)

    def say(self, text, tokens=1000):
        with self.path.open("a") as fh:
            fh.write(json.dumps({"type": "assistant", "uuid": f"a{os.urandom(3).hex()}", "message": {
                "role": "assistant", "content": [{"type": "text", "text": text}],
                "usage": {"input_tokens": tokens}}}) + "\n")

    def j(self, *a):
        return subprocess.run([self.J, *a], env=self.env, capture_output=True, text=True, timeout=180)

    def stop(self, after=False):
        """The whole reply: (what the user sees, what the agent reads)."""
        out = self.fire("Stop", stop_hook_active=after)
        if not out.strip():
            return "", ""
        got = json.loads(out)
        seen = got.get("systemMessage", "") or got.get("reason", "")
        read = (got.get("hookSpecificOutput") or {}).get("additionalContext", "")
        return seen, read

    def tool(self):
        out = self.fire("PostToolUse", tool_name="Bash", tool_input={"command": "true"},
                        tool_response={"stdout": ""})
        if not out.strip():
            return ""
        return (json.loads(out).get("hookSpecificOutput") or {}).get("additionalContext", "")


R = "always run the suites before saying a change works"

# ------------------------------------------------------------------ said at every stop, forever
s = S(hold_stop_on_untagged=False)
s.user("go"); s.say("[!reply] fine")
check("nothing standing: the stop says nothing", s.stop(), ("", ""))
s.j("reminders", "add", R)
# WITH NOTHING ELSE PENDING, THE STOP TELLS THE USER AND NOBODY ELSE. `additionalContext`
# at a stop re-opens the turn — the reference says so and this session watched it happen —
# so a reminder with nothing to do would wake the session for no reason. The person gets
# their confirmation in `systemMessage`; the agent is reminded mid-turn and at every start,
# where reminding costs no turn.
chain = [s.stop(), s.stop(True), s.stop(True)]
check("the user is told", R in chain[0][0], True)
check("and the turn is not re-opened for it", chain[0][1], "")
check("no furniture rides with it: the retire command is taught where it is read on purpose",
      'journal reminders done' in chain[0][0], False)

# ------------------------------------------------------------------ it rides a hold, never competes with it
s2 = S()
s2.j("reminders", "add", R)
s2.user("go"); s2.say("no tag at all")
seen, read = s2.stop()
# WHEN SOMETHING IS ALREADY HOLDING, the reminder rides along for free: the turn is being
# re-opened anyway, so the agent reads it there.
check("the queue still raises its subject", "untagged" in read, True)
check("and the reminder rides along in the same reply", R in read, True)
# A REMINDER IS NOT AN ERROR, AND NEITHER IS A NUDGE. Guidance goes in the field the
# harness does not announce as a failure.
check("and nothing is labelled an error", json.loads(s2.fire("Stop")).get("decision"), None)

# ------------------------------------------------------------------ retiring it, and only with a reason
s3 = S(hold_stop_on_untagged=False)
s3.j("reminders", "add", R)
check("done wants a reason", s3.j("reminders", "done", "1").returncode, 1)
check("retired", s3.j("reminders", "done", "1", "the release is cut").returncode, 0)
check("and the stop falls silent again", s3.stop(), ("", ""))
check("the text is still there under --all", R in s3.j("reminders", "--all").stdout, True)
check("a second retirement is refused", s3.j("reminders", "done", "1", "again").returncode, 1)

# ------------------------------------------------------------------ the number never shifts
s4 = S(hold_stop_on_untagged=False)
s4.j("reminders", "add", "first"); s4.j("reminders", "add", "second")
s4.j("reminders", "done", "1", "done with it")
s4.j("reminders", "add", "third")
out = s4.j("reminders").stdout
check("a retired reminder keeps its number; the next one gets the next",
      ("1  first" in out, "2  second" in out, "3  third" in out), (False, True, True))

# ------------------------------------------------------------------ mid-turn, every N tool calls
s5 = S(reminder_every=3, hold_stop_on_untagged=False)
s5.j("reminders", "add", R)
check("nothing before the interval", [R in s5.tool() for _ in range(2)], [False, False])
check("and then, on the third", R in s5.tool(), True)
check("the count restarts", [R in s5.tool() for _ in range(2)], [False, False])
s5.stop()
check("a stop restarts it too — the interval is from when it was last SEEN",
      [R in s5.tool() for _ in range(2)], [False, False])
check("...and fires on the third after that", R in s5.tool(), True)

# THE REPEATED FORM CARRIES NO FURNITURE. Three lines of scaffolding around one line of
# instruction, delivered every N tool calls all session, is how a reader is taught to skim
# the instruction itself.
sT = S(reminder_every=1, hold_stop_on_untagged=False)
sT.j("reminders", "add", R, "--until=the release is cut")
mid = sT.tool()
check("mid-turn: the instruction and its condition", (R in mid, "the release is cut" in mid), (True, True))
check("and nothing else — no command, no gloss on what until means",
      ("journal reminders done" in mid, "without asking" in mid), (False, False))
seen, read = sT.stop()
check("the stop's copy is the same one form — no gloss there either",
      "journal reminders done" in seen, False)
check("and it is still the instruction and its condition",
      (R in seen, "the release is cut" in seen), (True, True))

s6 = S(reminder_every=0, hold_stop_on_untagged=False)
s6.j("reminders", "add", R)
check("reminder_every 0 leaves it to the stop", [R in s6.tool() for _ in range(5)], [False] * 5)
check("the stop still says it", R in "".join(s6.stop()), True)

s7 = S(reminder_every=2, silenced=["reminders"], hold_stop_on_untagged=False)
s7.j("reminders", "add", R)
check("silenced: neither half speaks", (s7.tool(), s7.tool(), s7.stop()), ("", "", ("", "")))

# ------------------------------------------------------------------ it belongs to an environment
s8 = S(hold_stop_on_untagged=False)
s8.j("reminders", "add", R)
s8.j("prepare", "elsewhere"); s8.j("switch", "elsewhere")
check("another environment does not inherit it", s8.stop(), ("", ""))
check("nor does its list", "Nothing is being repeated" in s8.j("reminders").stdout, True)
s8.j("switch", "default")
# THESE ARE ABOUT SCOPE, NOT ABOUT WHICH FIELD: whether something else happens to be
# holding at the same stop decides that, and it is not what is under test here.
check("back where it was written, it is said again", R in "".join(s8.stop()), True)
check("moved", s8.j("reminders", "move", "1", "elsewhere").returncode, 0)
check("gone from here", R in "".join(s8.stop()), False)
s8.j("switch", "elsewhere")
check("and standing there", R in "".join(s8.stop()), True)

# ------------------------------------------------------------------ the cap
s9 = S(reminder_max_chars=40, hold_stop_on_untagged=False)
long = s9.j("reminders", "add", "x" * 60)
check("a paragraph is refused", (long.returncode, "60 characters" in long.stdout + long.stderr), (1, True))
check("nothing was written", "Nothing is being repeated" in s9.j("reminders").stdout, True)
check("a line fits", s9.j("reminders", "add", "x" * 40).returncode, 0)

# ------------------------------------------------------------------ the start block and the far side of a compaction
s10 = S(hold_stop_on_untagged=False)
s10.j("reminders", "add", R, "--until=the release is cut")
carry = s10.j("carry").stdout
check("handed to a fresh session at its start", R in carry, True)
check("with the condition it is judged against", "the release is cut" in carry, True)

# THE LISTING IS ONE LOOP, AND SCOPE IS NOT WHAT THAT MEANS. A reminder belongs to one
# environment exactly as a pin does; a rule belongs to the project. Sharing `entries.rows`
# says nothing about any of that, and the first version of this refactor left the old copy
# in the file while the changelog said it was gone.
import inspect as _i, reminders as _r, pins as _p, state as _s
# to-do 11 (2026-09-11): `render` now goes through `rows_response` — the same response
# the web viewer serves as JSON — rather than `listing` directly; the chain still ends
# at `entries.rows` and still never rebuilds a row's text by hand.
check("reminders has no second copy of the listing",
      ("entries.rows" in _i.getsource(_r.listing),
       "rows_response(" in _i.getsource(_r.render),
       "listing(" in _i.getsource(_r.rows_response),
       "fmt.numbered" in _i.getsource(_r.render)), (True, True, True, False))
check("and neither does pins", "entries.rows" in _i.getsource(_p.listing), True)
check("a reminder is bound to its environment, like a pin, and a rule is not",
      (sorted(_s.TRACKED), "rules" in _s.TRACKED, "rules" in _s.IN_RECORD),
      (["pins", "reminders", "work"], False, True))

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
