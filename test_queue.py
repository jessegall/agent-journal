#!/usr/bin/env python3
"""The stop queue: one subject per stop, each once per turn, pending until resolved.

    .journal/test_queue.py

Every edge the queue has: the order; a subject raised once per turn however many stops
follow; an unresolved subject returning next turn and a resolved one not; a turn with
every subject pending draining in as many stops and then passing; the queue never
looping; and what "resolved" means for each subject.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


class S:
    def __init__(self, window=200000):
        self.d = Path(tempfile.mkdtemp()) / "proj"
        (self.d / ".claude").mkdir(parents=True)
        shutil.copytree(SRC, self.d / ".journal", ignore=shutil.ignore_patterns(
            "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
        (self.d / ".journal" / "settings.json").write_text(json.dumps({"context_window": window}))
        tdir = transcript.project_dir(self.d); tdir.mkdir(parents=True, exist_ok=True)
        self.path = tdir / "s1.jsonl"; self.path.write_text("")
        self.J = str(self.d / ".journal" / "journal.py")
        self.env = {**os.environ, transcript.SESSION_ENV: "s1"}
        self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        payload = {"hook_event_name": event, "session_id": "s1", "transcript_path": str(self.path), **extra}
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
        out = self.fire("Stop", stop_hook_active=after)
        if not out.strip():
            return ""
        got = json.loads(out)
        if got.get("decision") == "block":
            return got["reason"].replace("journal reminded Claude: ", "")
        return "context:" + (got.get("hookSpecificOutput") or {}).get("additionalContext", "")[:40]


# ---------------------------------------------------------------- the order, one per stop
s = S()
s.j("todo", "chore"); s.j("todo", "auto", "on")
s.j("work", "start", "the sweep")
s.user("also fix the banner later")
s.say("no tag; I'll do the banner after this", tokens=191000)
seq = [s.stop(), s.stop(True), s.stop(True), s.stop(True), s.stop(True), s.stop(True)]
check("every pending subject, in order, one per stop, then pass — nothing loops",
      seq, ["context 96% full", "work deferred in words, not parked", "1 untagged message(s)",
            "auto is on, work still open", "", ""])
check("the same turn never raises a subject twice", seq.count("context 96% full"), 1)

# ---------------------------------------------------------------- unresolved comes back, resolved does not
s.say("[!reply] no decision yet; I will do the banner after this")
seq = [s.stop(), s.stop(True), s.stop(True), s.stop(True)]
check("next turn: the undecided context and the open work come back; the tagged message and the parked... no, the deferral still pending too",
      seq, ["context 96% full, still undecided", "work deferred in words, not parked", "auto is on, work still open", ""])
s.j("nothing", "only reads"); s.j("todo", "fix the banner"); s.j("work", "end", "the sweep")
s.say("[!reply] all handled")
seq = [s.stop(), s.stop(True)]
check("everything resolved: only auto, with the next to-do, then pass",
      (seq[0].startswith("auto is on, 2 to-do(s) waiting"), seq[1]), (True, ""))

# ---------------------------------------------------------------- a fresh turn resets the once-per-turn marks
s2 = S()
s2.user("go")
s2.say("no tag one")
check("turn 1: untagged", s2.stop(), "1 untagged message(s)")
s2.say("no tag two")
check("same turn, a second untagged message: not raised again (once per turn)", s2.stop(True), "")
check("a new turn: raised", s2.stop(), "1 untagged message(s)")
s2.say("[!reply] tagged")
check("tagged: resolved", s2.stop(), "")

# ---------------------------------------------------------------- auto after a resolved rung, in the same turn
s3 = S()
s3.j("todo", "chore"); s3.j("todo", "auto", "on")
s3.user("go"); s3.say("[!reply] working", tokens=191000)
check("rung first", s3.stop(), "context 96% full")
s3.j("nothing", "only reads")
check("decided: the same turn raises auto with the next to-do", s3.stop(True).startswith("auto is on, 1 to-do(s) waiting"), True)
check("then passes", s3.stop(True), "")
s3.j("todo", "start", "1")
check("a new turn with the to-do open: the auto-open hold", s3.stop(), "auto is on, work still open")
check("once", s3.stop(True), "")
s3.j("work", "end", "chore")
check("done: list empty, silence", s3.stop(), "")

# ---------------------------------------------------------------- auto off: open work once per piece, ever
s4 = S()
s4.j("work", "start", "w"); s4.user("go"); s4.say("[!reply] ok")
check("open work raised once", s4.stop(), "work still open")
check("not again this turn", s4.stop(True), "")
check("nor next turn without a change: once per piece of work", s4.stop(), "")
s4.j("work", "start", "second")
check("a new piece: raised", s4.stop(), "work still open")

# ---------------------------------------------------------------- said-as-context lines only when nothing is held
s5 = S()
s5.j("todo", "waiting one"); s5.user("go"); s5.say("no tag")
check("a hold outranks the to-do reminder", s5.stop(), "1 untagged message(s)")
s5.say("[!reply] tagged")
check("with nothing held, the reminder is said as context", s5.stop().startswith("context:journal: 1 to-do(s) waiting"), True)
check("and once per state", s5.stop(), "")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
