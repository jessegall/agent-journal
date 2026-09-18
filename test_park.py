#!/usr/bin/env python3
import json, os, sys, tempfile
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


def project(settings=None):
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    testkit.make(d, SRC)
    (d / ".journal" / "settings.json").write_text(json.dumps(
        settings or {"silenced": ["loop"], "one_session_per_environment": False}))
    transcript.project_dir(d).mkdir(parents=True, exist_ok=True)
    return d


class S:
    def __init__(self, d, stem):
        self.d, self.stem = d, stem
        self.path = transcript.project_dir(d) / f"{stem}.jsonl"
        self.path.write_text("")
        self.P = testkit.Project(d)
        self.n = 0
        self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        return self.P.hook(event, session_id=self.stem,
                           transcript_path=str(self.path), **extra)[1]

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
        code, out = self.P.cli(*a, session=self.stem, stdin=stdin or "")
        return code, out.strip()

    def rows(self, env="w"):
        return json.loads((self.d / ".journal" / "environments" / env / "work.json").read_text())["work"]


# ---------------------------------------------------------------- it refuses what it must
d = project()
s = S(d, "aaaaaaaa-0000-4000-8000-000000000001")
s.j("switch", "w")
code, out = s.j("work", "park", "waiting on the user")
check("with nothing open there is nothing to park", (code, "nothing is open to park" in out), (1, True))
s.j("work", "start", "the first thing")
code, out = s.j("work", "park")
check("parking wants a reason", (code, "wants why it is set aside" in out and "work park" in out), (1, True))
s.j("work", "start", "the second thing")
code, out = s.j("work", "park", "waiting on the user")
check("with two open it refuses to guess which one is parked",
      (code, "would have to guess" in out, '--on="the first thing"' in out), (1, True, True))
code, out = s.j("work", "park", "a reason", "--on=nothing by that name")
check("--on that matches nothing open is refused", (code, "names no open work" in out), (1, True))

# ---------------------------------------------------------------- parked work stays open, and is left alone
code, out = s.j("work", "park", "the user has to decide the shape", "--on=the first thing")
check("the park is taken and says what picks it up again",
      (code, "parked: `the first thing`" in out, "stays open" in out, "work update" in out),
      (0, True, True, True))
check("the work is still open, with the reason on it",
      [(w["subject"], bool(w.get("ended")), (w.get("parked") or {}).get("why")) for w in s.rows()
       if w["subject"] == "the first thing"],
      [("the first thing", False, "the user has to decide the shape")])
code, out = s.j("open")
check("`journal open` still lists it — parking is not closing", "the first thing" in out, True)

s.say("[!info] asked the user")
held = s.stop()
check("the parked piece is not named at the stop", "the first thing" in held, False)
check("but its sibling still is", "the second thing" in held, True)
s.j("work", "end", "the second thing")
s.say("[!info] still parked")
check("with only the parked piece open, the stop is silent", s.stop(), "")

# ---------------------------------------------------------------- the first update picks it up again
s.j("work", "update", "they answered: it is a flag on the open row")
check("an update clears the park",
      [(w.get("parked") or None) for w in s.rows() if w["subject"] == "the first thing"], [None])
s.say("[!info] filed")
check("and the hold comes back", "the first thing" in s.stop(), True)
s.j("work", "end", "the first thing")

# ---------------------------------------------------------------- asking parks, it does not finish
d2 = project()
s2 = S(d2, "bbbbbbbb-0000-4000-8000-000000000002")
s2.j("switch", "w")
s2.j("todos", "add", "make the widget resize")
s2.j("todos", "start", "1")
code, out = s2.j("todos", "ask", "1", "should it resize by hand or on its own?")
check("asking parks the work of that title, and says it is not finished",
      (code, "parked the work" in out, "not finished" in out), (0, True, True))
check("the work is open and parked on the question",
      [(bool(w.get("ended")), "should it resize" in ((w.get("parked") or {}).get("why") or ""))
       for w in s2.rows()], [(False, True)])

# ---------------------------------------------------------------- blocking parks too
d3 = project()
s3 = S(d3, "cccccccc-0000-4000-8000-000000000003")
s3.j("switch", "w")
s3.j("todos", "add", "swap the loader")
s3.j("todos", "start", "1")
code, out = s3.j("todos", "block", "1", "the rig batch has to run first")
check("blocking parks the work rather than ending it",
      (code, "parked the work" in out), (0, True))
check("and the row is open, with the condition as its reason",
      [(bool(w.get("ended")), (w.get("parked") or {}).get("why")) for w in s3.rows()],
      [(False, "the rig batch has to run first")])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
