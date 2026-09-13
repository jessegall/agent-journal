#!/usr/bin/env python3
"""comments.py: comment on a resource, the stop nudge, and closing one."""
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


def j(*a):
    return P.cli(*a)


def stored():
    f = root / "environments" / "default" / "comments.json"
    return json.loads(f.read_text())["comments"] if f.is_file() else []


# ------------------------------------------------------------------ something to comment on
j("todos", "add", "build the thing")
j("reminders", "add", "say hi")

# ------------------------------------------------------------------ comment
code, out = j("comments", "add", "todo 1", "split this into two")
check("a comment on a to-do", (code, "comment 1 on to-do 1" in out), (0, True))
check("stored on this environment's own file, about one ref", [(c["about"], c["text"]) for c in stored()],
      [("todo:1", "split this into two")])
code, out = j("comments", "add", "reminder 1", "this one can go")
check("a comment on a reminder", (code, "comment 2 on reminder 1" in out), (0, True))
code, out = j("comments", "add", "todo 9", "nothing there")
check("a ref to nothing is refused", code, 1)
code, out = j("comments", "add", "question 1", "no")
check("something a comment cannot be about is refused, naming what it can", (code, "reminder 1" in out), (1, True))
code, out = j("comments", "add", "todo 1", " ")
check("an empty comment is refused", code, 1)

code, out = j("comments")
check("the list shows what is not handled", ("split this into two" in out, "this one can go" in out, "not seen yet" in out),
      (True, True, True))

# ------------------------------------------------------------------ writes are writes to the hook
import hook  # noqa: E402
cmd = lambda c: {"tool_name": "Bash", "tool_input": {"command": c}}  # noqa: E731
check("commenting and closing are writes; reading is not",
      [hook._journal_write(cmd(f".journal/journal.py {c}")) for c in
       ("comments add 'todo 1' x", "comments done 1 y", "comments", "comments show 1")],
      ["comments", "comments", None, None])

# ------------------------------------------------------------------ a real stop tells the agent, once
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
check("the stop names every new comment and what it is about",
      (label, "comment 1 on to-do 1: split this into two" in text, "comment 2 on reminder 1" in text, "comments done" in text),
      ("the user left 2 comments", True, True, True))
turn("and now", "[!reply] still fine")
label, text = testkit.hold(fire("Stop", stop_hook_active=False))
check("and does not tell them twice", "split this into two" in (text or ""), False)

# ------------------------------------------------------------------ handled
code, out = j("comments", "done", "1", "split into to-dos 2 and 3")
check("done says what was done", (code, "comment 1 on to-do 1 is handled: split into to-dos 2 and 3" in out), (0, True))
code, out = j("comments", "done", "1", "again")
check("twice is refused", code, 1)
code, out = j("comments", "done", "2")
check("done wants what was done", code, 1)
code, out = j("comments")
check("a handled comment leaves the list", "split this into two" in out, False)
code, out = j("comments", "--all")
check("--all still shows it", "split this into two" in out, True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
