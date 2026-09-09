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
import transcript  # noqa: E402

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
        shutil.copytree(SRC, self.d / ".journal", ignore=shutil.ignore_patterns(
            "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal",
            ".git", ".claude", "__pycache__"))
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
                              capture_output=True, text=True, timeout=60).stdout

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
        return subprocess.run([self.J, *a], env=self.env, capture_output=True, text=True, timeout=60)

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
chain = [s.stop(), s.stop(True), s.stop(True)]
check("said at the head of the chain", R in chain[0][1], True)
check("and the user sees it too, in their own line", R in chain[0][0], True)
check("the agent's copy names the command that ends it",
      'journal reminders done' in chain[0][1], True)
# THE LOOP THIS COST A LIVE SESSION. A Stop that returns anything is re-entered with
# `stop_hook_active`, so a reminder that answered its own re-entry woke the session again
# with nobody asking for anything — three times, in front of the user.
check("NOT on the re-entries it would otherwise cause",
      [R in read for _, read in chain[1:]], [False, False])
s.say("[!reply] and again"); s.user("more"); s.say("[!reply] fine")
check("but at the head of the NEXT chain, every time", R in s.stop()[1], True)

# ------------------------------------------------------------------ it rides a hold, never competes with it
s2 = S()
s2.j("reminders", "add", R)
s2.user("go"); s2.say("no tag at all")
seen, read = s2.stop()
check("the queue still raises its subject", "untagged" in seen, True)
check("and the reminder rides along in the same reply", R in read, True)
check("the user's line carries the reminder above the hold's own",
      seen.splitlines()[0].startswith("journal: reminded"), True)

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

s6 = S(reminder_every=0, hold_stop_on_untagged=False)
s6.j("reminders", "add", R)
check("reminder_every 0 leaves it to the stop", [R in s6.tool() for _ in range(5)], [False] * 5)
check("the stop still says it", R in s6.stop()[1], True)

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
check("back where it was written, it is said again", R in s8.stop()[1], True)
check("moved", s8.j("reminders", "move", "1", "elsewhere").returncode, 0)
check("gone from here", s8.stop(), ("", ""))
s8.j("switch", "elsewhere")
check("and standing there", R in s8.stop()[1], True)

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

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
