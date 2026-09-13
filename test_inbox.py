#!/usr/bin/env python3
"""inbox.py: leave a message, split it into parts, mark it processed."""
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


def j(*a):
    return P.cli(*a)


def stored():
    f = d / ".journal" / "environments" / "default" / "inbox.json"
    return json.loads(f.read_text())["inbox"] if f.is_file() else []


# ------------------------------------------------------------------ something a part can become
j("todos", "add", "build the thing")
j("pins", "add", "a fact worth keeping")

# ------------------------------------------------------------------ leave a message
code, out = j("inbox", "add", "rename the parser module, and remember the port is 8420")
check("a message goes in", (code, "message 1" in out), (0, True))
code, out = j("inbox", "also check the flaky test")
check("the bare noun takes a message too", (code, "message 2" in out, "2 waiting" in out), (0, True, True))
check("stored on this environment, unprocessed",
      [(m["text"][:6], m["processed"], m["source"]) for m in stored()],
      [("rename", None, "cli"), ("also c", None, "cli")])
code, out = j("inbox", "add")
check("a message needs its text", code, 1)
code, out = j("inbox", "7")
check("a bare number reads a message rather than filing one", (code, len(stored())), (1, 2))

# ------------------------------------------------------------------ list and show
code, out = j("inbox")
check("listed", ("rename the parser" in out, "also check the flaky test" in out, "2 waiting, 0 processed" in out),
      (True, True, True))
code, out = j("inbox", "show", "1")
check("show reads it with the next steps", (code, "rename the parser module" in out, "inbox process 1" in out),
      (0, True, True))

# ------------------------------------------------------------------ process
code, out = j("inbox", "process", "1", "--part=rename the parser module", "--became=todo 1")
check("a part is recorded with what it became", (code, "became to-do 1" in out), (0, True))
code, out = j("inbox", "process", "1", "--part=the port is 8420", "--became=pin 1", "--became=noted")
check("a part can become several things", (code, stored()[0]["parts"][1]["became"]), (0, ["pin:1", "noted"]))
code, out = j("inbox", "process", "1", "--part=something never said", "--became=noted")
check("a part that is not in the message is refused", (code, "not in message 1" in out), (1, True))
code, out = j("inbox", "process", "1", "--part=rename", "--became=todo 99")
check("a part cannot become a to-do that does not exist", code, 1)
code, out = j("inbox", "process", "1", "--part=rename", "--became=banana")
check("what a part became must be a reference", (code, "noted" in out), (1, True))
code, out = j("inbox", "process", "1", "--part=rename")
check("a part must say what it became", code, 1)
code, out = j("inbox", "process", "9", "--part=x", "--became=noted")
check("there is no message 9", code, 1)
check("refused parts wrote nothing", len(stored()[0]["parts"]), 2)

# ------------------------------------------------------------------ done
code, out = j("inbox", "done", "2")
check("a message with no parts cannot be done", (code, "no parts" in out), (1, True))
code, out = j("inbox", "done", "1")
check("processed, naming what it became", (code, "to-do 1, pin 1, noted" in out, "1 waiting" in out),
      (0, True, True))
code, out = j("inbox", "done", "1")
check("done twice is refused", code, 1)
code, out = j("inbox", "process", "1", "--part=rename", "--became=noted")
check("a processed message takes no more parts", code, 1)
code, out = j("inbox")
check("waiting messages list before processed ones",
      out.index("also check the flaky test") < out.index("rename the parser"), True)
check("nothing is deleted", len(stored()), 2)

# ------------------------------------------------------------------ an unclear part becomes a question
code, out = j("questions", "add", "which flaky test?", "--about=inbox 2")
check("a question can be about an inbox message", (code, "about inbox message 2" in out), (0, True))
code, out = j("questions", "add", "x?", "--about=inbox 9")
check("but not about a message that does not exist", code, 1)
code, out = j("inbox", "process", "2", "--part=the flaky test", "--became=question 1")
check("the unclear part records the question it became", (code, "became question 1" in out), (0, True))
code, out = j("inbox", "show", "2")
check("show lists the parts and the questions about it",
      ("«the flaky test»" in out, "which flaky test?" in out), (True, True))

# ------------------------------------------------------------------ per environment
j("prepare", "elsewhere")
code, out = j("inbox")
check("another environment has its own inbox", "also check" in out, False)
j("switch", "default")

# ------------------------------------------------------------------ the web viewer's shape
sys.path.insert(0, str(d / ".journal"))
import inbox as inbox_mod  # noqa: E402
root = d / ".journal"
rows = inbox_mod.rows_response(root, "default")
check("rows carry status and labelled parts",
      [(r["n"], r["status"], [b["label"] for p in r["parts"] for b in p["became"]]) for r in rows],
      [(2, "waiting", ["question 1"]), (1, "processed", ["to-do 1", "pin 1", "noted"])])
check("unprocessed reads what waits", [n for n, _ in inbox_mod.unprocessed(root, "default")], [2])

# ------------------------------------------------------------------ writes are writes to the hook
import hook  # noqa: E402
cmd = lambda c: {"tool_name": "Bash", "tool_input": {"command": c}}  # noqa: E731
check("adding, processing and closing are writes; reading is not",
      [hook._journal_write(cmd(f".journal/journal.py {c}")) for c in
       ("inbox add x", "inbox 'a message'", "inbox process 1 --part=x --became=noted", "inbox done 1",
        "inbox", "inbox show 1")],
      ["inbox", "inbox", "inbox", "inbox", None, None])

# ------------------------------------------------------------------ the stop holds while a message waits
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
label, _ = testkit.hold(fire("Stop", stop_hook_active=False))
check("the stop holds while a message waits, ahead of the rest of the queue", label,
      "the user left 1 message(s) in the inbox")

# ------------------------------------------------------------------ a tool call mentions a new message once
read = {"tool_name": "Read", "tool_input": {"file_path": "x"}, "tool_response": "ok"}
check("the first tool call after a message mentions it", "1 new message(s)" in fire("PostToolUse", **read), True)
check("and the next one does not repeat it", "new message" in fire("PostToolUse", **read), False)
j("inbox", "add", "one more thing")
check("a newer message is mentioned in its turn", "1 new message(s)" in fire("PostToolUse", **read), True)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
