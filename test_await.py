#!/usr/bin/env python3
"""Work that waits on something is not nudged, until the wait runs out.

    .journal/test_await.py

Every edge: `work await` refuses with nothing open, refuses without a timeout, and refuses
to guess between two open pieces; a waiting piece is skipped by the stop hold while its own
siblings are still held; the wait ends the moment an update or a close arrives; when it
expires the hold comes back FIRST, names what was awaited and for how long, and is said
once; `--for` overrides the default and is capped; and a subagent's wait is its own.
"""
import json, os, shutil, subprocess, sys, tempfile, time
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, transcript, work  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def project(settings=None):
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
        "runtime", "state.json*", "record.json*", "todo", "docs", "tools",
        ".journal", ".git", ".claude", "__pycache__", ".idea"))
    (d / ".journal" / "settings.json").write_text(json.dumps(
        settings or {"silenced": ["loop"], "one_session_per_environment": False}))
    transcript.project_dir(d).mkdir(parents=True, exist_ok=True)
    return d


class S:
    def __init__(self, d, stem):
        self.d, self.stem = d, stem
        self.path = transcript.project_dir(d) / f"{stem}.jsonl"
        self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.J = str(d / ".journal" / "journal.py")
        self.n = 0
        self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        payload = {"hook_event_name": event, "session_id": self.stem,
                   "transcript_path": str(self.path), **extra}
        p = subprocess.run([str(self.d / ".journal" / "hook.py")], input=json.dumps(payload),
                           capture_output=True, text=True, timeout=60)
        return p.stdout

    def say(self, text):
        self.n += 1
        with self.path.open("a") as fh:
            fh.write(json.dumps({"type": "assistant", "uuid": f"a{self.n}", "message": {
                "role": "assistant", "content": [{"type": "text", "text": text}]}}) + "\n")

    def stop(self):
        out = self.fire("Stop")
        if not out.strip():
            return ""
        got = json.loads(out)
        return got.get("hookSpecificOutput", {}).get("additionalContext", "") or got.get("reason", "")

    def j(self, *a, stdin=None):
        p = subprocess.run([self.J, *a], env=self.env, input=stdin,
                           capture_output=True, text=True, timeout=60)
        return p.returncode, (p.stdout + p.stderr).strip()


# ---------------------------------------------------------------- it refuses what it must
d = project()
s = S(d, "aaaaaaaa-0000-4000-8000-000000000001")
s.j("switch", "w")
code, out = s.j("work", "await", "the build")
check("with nothing open there is nothing to wait on", (code, "nothing is open to wait on" in out), (1, True))
s.j("work", "start", "the first thing")
code, out = s.j("work", "await")
check("await wants what is being waited for",
      (code, "wants the words" in out and "work await" in out), (1, True))
code, out = s.j("work", "await", "the build", "--for=0")
check("a wait with no timeout is refused: nothing waits forever",
      (code, "nothing may wait forever" in out), (1, True))
s.j("work", "start", "the second thing")
code, out = s.j("work", "await", "the build")
check("with two open it refuses to guess which one waits",
      (code, "would have to guess" in out, '--on="the first thing"' in out), (1, True, True))
code, out = s.j("work", "await", "the build", "--on=nothing by that name")
check("--on that matches nothing open is refused", (code, "names no open work" in out), (1, True))

# ---------------------------------------------------------------- the hold leaves a wait alone
code, out = s.j("work", "await", "a subagent", "--on=the first thing")
check("the wait is taken", (code, "waiting on a subagent" in out, "not held for 20 minute(s)" in out),
      (0, True, True))
s.say("[!info] dispatched")
held = s.stop()
check("the waiting piece is not named at the stop", "the first thing" in held, False)
check("but its sibling still is", "the second thing" in held, True)
s.j("work", "end", "the second thing")
s.say("[!info] still waiting")
check("with only the waiting piece open, the stop is silent", s.stop(), "")

# ---------------------------------------------------------------- progress ends the wait
s.j("work", "update", "the subagent reported", "--on=the first thing")
items = json.loads((d / ".journal" / "record.json").read_text())["tracks"]["w"]["work"]
check("an update clears the wait, whatever the clock says",
      [w for w in items if w["subject"] == "the first thing"][0].get("awaiting"), None)
s.say("[!info] filed")
check("and the hold comes back", "the first thing" in s.stop(), True)

# ---------------------------------------------------------------- it expires, and says so once
d2 = project()
s2 = S(d2, "bbbbbbbb-0000-4000-8000-000000000002")
s2.j("switch", "w")
s2.j("work", "start", "the long one")
s2.j("work", "await", "a build that died", "--for=1")
items = json.loads((d2 / ".journal" / "record.json").read_text())
items["tracks"]["w"]["work"][0]["awaiting"]["until"] = time.time() - 300
(d2 / ".journal" / "record.json").write_text(json.dumps(items))
s2.say("[!info] tagged")
held = s2.stop()
check("an expired wait holds, names what was awaited and for how long",
      ("a build that died" in held, "has been waiting" in held, "the long one" in held),
      (True, True, True))
check("it offers all three ways out", ("work update" in held, "work await" in held, "work end" in held),
      (True, True, True))
s2.say("[!info] tagged again")
check("and it is said once: the wait is cleared by saying it",
      "has been waiting" in s2.stop(), False)

# ---------------------------------------------------------------- the wait names what it waits on
d4 = project()
s4 = S(d4, "dddddddd-0000-4000-8000-000000000004")
s4.j("switch", "w")
s4.j("work", "start", "dispatched something")
code, out = s4.j("work", "await", "the hand-off agent", "--agent=a46ad2e1ca911d229")
check("an agent id is recorded and said back",
      (code, "agent a46ad2e1ca911d229" in out), (0, True))
s4.say("[!info] tagged")
check("and the piece is still not held while it waits", "dispatched something" in s4.stop(), False)

# a pid that is alive: this test process itself
d5 = project()
s5 = S(d5, "eeeeeeee-0000-4000-8000-000000000005")
s5.j("switch", "w")
s5.j("work", "start", "waiting on a process")
code, out = s5.j("work", "await", "this very test", f"--pid={os.getpid()}")
check("a live pid is watched, and said", (code, f"pid {os.getpid()}" in out, "the pid is watched" in out),
      (0, True, True))
s5.say("[!info] tagged")
check("a live pid keeps the wait", "waiting on a process" in s5.stop(), False)

# a pid that is gone: the wait is over early, whatever the clock says
dead_pid = subprocess.Popen([sys.executable, "-c", "pass"])
dead_pid.wait()
s5.j("work", "update", "reset", "--on=waiting on a process")
s5.j("work", "await", "a process that already exited", f"--pid={dead_pid.pid}")
s5.say("[!info] tagged")
held = s5.stop()
check("an exited pid ends the wait at the next stop, without burning the timeout",
      (f"pid {dead_pid.pid}" in held, "has exited" in held), (True, True))
check("check(): a dead pid is not alive", work.alive(dead_pid.pid), False)
check("and this process is", work.alive(os.getpid()), True)

code, out = s5.j("work", "await", "x", "--pid=nope")
check("--pid wants a number", (code, "--pid wants a number" in out), (1, True))

# ---------------------------------------------------------------- --for, and its cap
d3 = project()
s3 = S(d3, "cccccccc-0000-4000-8000-000000000003")
s3.j("switch", "w")
s3.j("work", "start", "a thing")
code, out = s3.j("work", "await", "a review", "--for=45")
check("--for sets the wait", (code, "not held for 45 minute(s)" in out), (0, True))
code, out = s3.j("work", "await", "a review", "--for=9999")
check("a wait past the cap is capped, and said", ("capped at 120" in out, "120 minute(s)" in out),
      (True, True))
code, out = s3.j("work", "await", "a review", "--for=nope")
check("--for wants a number", (code, "--for wants minutes" in out), (1, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
