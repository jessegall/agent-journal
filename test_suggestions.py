#!/usr/bin/env python3
"""suggestions.py: the agent proposes, the user accepts, adjusts or declines; the agent is told."""
import json, os, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
P = testkit.Project(d)
root = d / ".journal"


def j(*a, stdin=""):
    return P.cli(*a, stdin=stdin)


def stored():
    f = root / "environments" / "default" / "suggestions.json"
    return json.loads(f.read_text())["suggestions"] if f.is_file() else []


j("todos", "add", "build the export")

check("a suggestion needs its reasoning", j("suggest", "drop the render cache", "--brief", stdin="")[0], 1)
code, out = j("suggest", "drop the render cache", "--about=todo 1", "--brief", stdin="It is stale half the time and costs 40ms.\n")
check("a suggestion is filed, about a to-do", (code, "suggestion 1: drop the render cache (about to-do 1)" in out), (0, True))
check("stored on this environment's own file", [(s["title"], s["links"]) for s in stored()], [("drop the render cache", ["todo:1"])])

for t in ("split hook.py into modules", "rename the parser", "add a --json flag everywhere", "cache overview per request"):
    j("suggest", t, "--brief", stdin="because\n")
code, out = j("suggest", "one too many", "--brief", stdin="x\n")
check("five undecided is the most; a sixth is refused, naming them", (code, "withdraw one" in out, "rename the parser" in out), (1, True, True))

code, out = j("suggestions", "withdraw", "5")
check("withdraw wants a reason", code, 1)
check("the agent withdraws one with a reason", j("suggestions", "withdraw", "5", "fixed another way")[0], 0)

code, out = j("suggestions", "decline", "2", "not before 2.0")
check("the user declines one, with a reason", (code, "declined: not before 2.0" in out), (0, True))
code, out = j("suggest", "split hook.py into smaller modules", "--brief", stdin="again\n")
check("filing a declined one again is refused, showing the decline", (code, "was declined" in out, "not before 2.0" in out), (1, True, True))
check("--despite without --because is refused", j("suggest", "split hook.py into smaller modules", "--despite=2", "--brief", stdin="x\n")[0], 1)
code, out = j("suggest", "split hook.py into smaller modules", "--despite=2", "--because=2.0 has shipped", "--brief", stdin="x\n")
check("--despite with what changed is allowed", code, 0)

code, out = j("suggestions", "accept", "1")
check("accepting files a to-do", (code, "to-do 2 is filed" in out), (0, True))
check("linked both ways", (stored()[0]["became"], "suggestion: 1" in (root / "environments" / "default" / "todo").joinpath(
      next(x.name for x in (root / "environments" / "default" / "todo").iterdir() if x.name.startswith("002"))).read_text()), ("todo:2", True))
check("a decided one cannot be decided again", j("suggestions", "decline", "1", "x")[0], 1)
code, out = j("suggestions", "adjust", "3", "only rename the public name")
check("adjusting files a to-do carrying the user's change", (code, "with your change" in out), (0, True))
code, out = j("todos", "show", "3")
check("the to-do says what the user changed", "only rename the public name" in out, True)

code, out = j("suggestions")
check("the list shows what still waits on the user", ("add a --json flag everywhere" in out, "drop the render cache" in out), (True, False))
check("--all shows the decided ones too", "drop the render cache" in j("suggestions", "--all")[1], True)

# ------------------------------------------------------------------ a stop tells the agent, once
import transcript  # noqa: E402
tdir = transcript.project_dir(d)
tdir.mkdir(parents=True, exist_ok=True)
tpath = tdir / "s1.jsonl"
tpath.write_text("")


def fire(event, **extra):
    return P.hook(event, session_id="s1", transcript_path=str(tpath), **extra)[1]


def turn(user_text, reply):
    with tpath.open("a") as fh:
        fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": f"u{os.urandom(3).hex()}",
                             "message": {"role": "user", "content": user_text}}) + "\n")
    fire("UserPromptSubmit", prompt=user_text)
    with tpath.open("a") as fh:
        fh.write(json.dumps({"type": "assistant", "uuid": f"a{os.urandom(3).hex()}", "message": {
            "role": "assistant", "content": [{"type": "text", "text": reply}],
            "usage": {"input_tokens": 1000}}}) + "\n")


fire("SessionStart", source="startup")
turn("how is it going", "[!reply] fine")
label, text = testkit.hold(fire("Stop", stop_hook_active=False))
check("the stop tells the agent what the user decided",
      ("suggestion" in (label or ""), "drop the render cache" in (text or ""), "not before 2.0" in (text or "")), (True, True, True))
turn("and now", "[!reply] still fine")
label, text = testkit.hold(fire("Stop", stop_hook_active=False))
check("and not twice", "drop the render cache" in (text or ""), False)

# ------------------------------------------------------------------ a reply that proposes a change earns a quiet hint
turn("fix the parser", "[!reply] Fixed it. We could also drop the old cache entirely, it is never read.")
out = fire("Stop", stop_hook_active=False)
check("a reply proposing a change nobody asked for is told a suggestion exists, without a hold",
      ("proposes a change" in out, "journal.py suggest" in out, '"decision": "block"' in out), (True, True, False))
out = fire("Stop", stop_hook_active=False)
check("once per reply", "proposes a change" in out, False)
turn("what do you think we should do about the cache?", "[!reply] We could drop it; it is never read.")
check("not when the user asked for an opinion", "proposes a change" in fire("Stop", stop_hook_active=False), False)
turn("rename the flag", "[!reply] Renamed. Nothing else changed.")
check("not when the reply proposes nothing", "proposes a change" in fire("Stop", stop_hook_active=False), False)

# ------------------------------------------------------------------ the user's verbs are the user's
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py suggestions accept 4"})
check("the agent running accept is refused", "deny" in out, True)
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py suggestions decline 4 no"})
check("and decline", "deny" in out, True)
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py suggestions withdraw 4 no"})
check("withdrawing its own is the agent's to do", "the user's to make" in out, False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
