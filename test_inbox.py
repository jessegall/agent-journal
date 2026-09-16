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
check("show reads it with the next steps", (code, "rename the parser module" in out, "messages process 1" in out),
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
# a plan is written FROM a message often enough that the plan page links back to it: the part has to be able to say so
j("plans", "add", "One switch for auto mode", "--goal=auto is one project-wide setting")
code, out = j("inbox", "process", "1", "--part=the parser", "--became=plan 1")
check("a part can become a plan, which is what the plan page links back by",
      (code, "became plan 1" in out, stored()[0]["parts"][-1]["became"]), (0, True, ["plan:1"]))
code, out = j("inbox", "process", "1", "--part=the parser", "--became=plan 9")
check("a part cannot become a plan that does not exist", (code, "no plan 9" in out), (1, True))
code, out = j("inbox", "process", "1", "--part=rename", "--became=banana")
check("what a part became must be a reference", (code, "noted" in out), (1, True))
code, out = j("inbox", "process", "1", "--part=rename")
check("a part must say what it became", code, 1)
code, out = j("inbox", "process", "9", "--part=x", "--became=noted")
check("there is no message 9", code, 1)
check("refused parts wrote nothing", len(stored()[0]["parts"]), 3)

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
      [(2, "waiting", ["question 1"]), (1, "processed", ["to-do 1", "pin 1", "noted", "plan 1"])])
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
      "the user left 1 message(s) for you")

# ------------------------------------------------------------------ a tool call mentions a new message once
read = {"tool_name": "Read", "tool_input": {"file_path": "x"}, "tool_response": "ok"}
check("the first tool call after a message mentions it", "1 new message(s)" in fire("PostToolUse", **read), True)
check("and the next one does not repeat it", "new message" in fire("PostToolUse", **read), False)
j("inbox", "add", "one more thing")
check("a newer message is mentioned in its turn", "1 new message(s)" in fire("PostToolUse", **read), True)

# ------------------------------------------------------------------ a tool call mentions a new comment once
j("todos", "add", "a thing to comment on")
j("comments", "add", "todo 1", "please check this one first")
check("the first tool call after a comment mentions it, even while the stop is busy with messages",
      "1 new comment(s)" in fire("PostToolUse", **read), True)
check("and the next one does not repeat it", "new comment" in fire("PostToolUse", **read), False)

# ------------------------------------------------------------------ a message carries files
import re  # noqa: E402
_src = Path(tempfile.mkdtemp())
(_src / "shot.png").write_bytes(b"\x89PNGdata")
(_src / "notes.txt").write_text("remember this")
code, out = j("messages", "add", "see the screenshot and notes", f"--file={_src / 'shot.png'}", f"--file={_src / 'notes.txt'}")
_mn = int(re.search(r"message (\d+)", out).group(1))
_held = d / ".journal" / "environments" / "default" / "message-files" / str(_mn)
check("the files are copied into the environment at once", (code, (_held / "shot.png").read_bytes(), (_held / "notes.txt").read_text()),
      (0, b"\x89PNGdata", "remember this"))
code, out = j("messages", "show", str(_mn))
check("show lists each file, where it is held, and that it is not filed", ("shot.png" in out, "message-files" in out, "not filed yet" in out),
      (True, True, True))
j("messages", "process", str(_mn), "--part=see the screenshot", "--became=noted")
code, out = j("messages", "done", str(_mn))
check("done is refused while a file is not filed, naming it", (code, "shot.png" in out, "notes.txt" in out), (1, True, True))
P.cli("docs", "add", "Screens", "--abstract=where screenshots go", "--brief", stdin="intro\n")
code, out = j("messages", "file", str(_mn), "shot.png", "doc Screens")
check("a file is filed into a doc: copied there, the held copy gone",
      (code, "filed into doc" in out, (_held / "shot.png").exists(),
       any(x.name == "shot.png" for x in (d / ".journal" / "docs").rglob("shot.png"))), (0, True, False, True))
code, out = j("messages", "file", str(_mn), "shot.png", "keep")
check("twice is refused", code, 1)
code, out = j("messages", "file", str(_mn), "nothere.txt", "keep")
check("a name it does not hold is refused", code, 1)
code, out = j("messages", "file", str(_mn), "notes.txt", "keep")
check("keep leaves it where it is held", (code, (_held / "notes.txt").is_file()), (0, True))
code, out = j("messages", "done", str(_mn))
check("and then done is allowed", code, 0)

# ------------------------------------------------------------------ a file is taken off a message
(_src / "extra.log").write_text("not needed after all")
code, out = j("messages", "add", "and the log too", f"--file={_src / 'extra.log'}")
_dn = int(re.search(r"message (\d+)", out).group(1))
_dheld = d / ".journal" / "environments" / "default" / "message-files" / str(_dn)
code, out = j("messages", "detach", str(_dn), "extra.log")
check("removing a file wants a reason", (code, (_dheld / "extra.log").is_file()), (1, True))
code, out = j("messages", "detach", str(_dn), "extra.log", "the user sent the wrong file")
check("a removed file moves to struck/, not deleted", (code, (_dheld / "extra.log").exists(), (_dheld / "struck" / "extra.log").read_text()),
      (0, False, "not needed after all"))
check("the message still lists it, marked removed with the reason", "removed: the user sent the wrong file" in j("messages", "show", str(_dn))[1], True)
code, out = j("messages", "detach", str(_dn), "extra.log", "again")
check("removing it twice is refused", code, 1)
j("messages", "process", str(_dn), "--part=and the log too", "--became=noted")
check("a removed file does not hold up done", j("messages", "done", str(_dn))[0], 0)
code, out = j("messages", "detach", str(_mn), "shot.png", "it is in the doc")
check("a file already filed into a doc is removed there, not from the message", (code, "docs detach" in out), (1, True))

# ------------------------------------------------------------------ files are added to a message already sent
(_src / "late.txt").write_text("forgot this one")
code, out = j("messages", "attach", str(_dn))
check("attach wants at least one file", code, 1)
code, out = j("messages", "attach", str(_dn), f"--file={_src / 'late.txt'}")
check("a file is added to a processed message and held with it", (code, (_dheld / "late.txt").read_text()), (0, "forgot this one"))
code, out = j("messages", "attach", str(_dn), f"--file={_src / 'late.txt'}")
check("a second file of the same name gets its own name", (code, (_dheld / "late-2.txt").is_file()), (0, True))
check("added from the terminal, it leaves no comment", "added late.txt" in j("comments", "--all")[1], False)

# ------------------------------------------------------------------ a follow-up comment on a message
code, out = j("comments", "add", f"message {_dn}", "one more thing: it only happens on Safari")
check("a comment can be about a message", code, 0)
check("the comments list names the message it is on", f"message {_dn}" in j("comments")[1], True)
code, out = j("comments", "add", "message 999", "about a message that is not there")
check("a comment on a message that does not exist is refused", code, 1)

# ------------------------------------------------------------------ archive
code, out = j("messages", "add", "never mind this one")
_an = int(re.search(r"message (\d+)", out).group(1))
code, out = j("messages", "archive", str(_an))
check("archive wants a reason", code, 1)
code, out = j("messages", "archive", str(_an), "the user said never mind")
check("a waiting message is archived with its reason", (code, "is archived" in out), (0, True))
code, out = j("messages")
check("it leaves the list and says how many are archived", ("never mind this one" in out, "1 archived" in out), (False, True))
check("and --all still shows it", "never mind this one" in j("messages", "--all")[1], True)
code, out = j("messages", "archive", str(_an), "again")
check("twice is refused", code, 1)
code, out = j("messages", "process", str(_an), "--part=never mind", "--became=noted")
check("an archived message cannot be processed", code, 1)

# ------------------------------------------------------------------ a reply under a message
code, out = j("messages", "add", "rename the flag to --json")
_rn = int(re.search(r"message (\d+)", out).group(1))
check("a reply wants its text", j("messages", "reply", str(_rn))[0], 1)
code, out = j("messages", "reply", str(_rn), "Renamed it to --format=json instead: --json was already taken by export.")
check("the agent replies to a waiting message", (code, "replied to message" in out), (0, True))
code, out = j("messages", "show", str(_rn))
check("show lists the reply, by the agent", ("REPLIES" in out.upper(), "--format=json instead" in out, "the agent" in out), (True, True, True))
j("messages", "process", str(_rn), "--part=rename the flag", "--became=noted")
j("messages", "done", str(_rn))
check("a processed message can still be replied to", j("messages", "reply", str(_rn), "One more thing: the old flag still works.")[0], 0)
check("a message that is not there is refused", j("messages", "reply", "999", "x")[0], 1)

j("messages", "add", "the lantern relay clicks at night")
code, out = j("messages", "waiting")
check("messages waiting prints a waiting message in full", (code, "the lantern relay clicks at night" in out), (0, True))
_wn = max(int(line.split()[1]) for line in out.splitlines() if line.startswith("MESSAGE "))
j("messages", "process", str(_wn), "--part=the lantern relay clicks", "--became=noted")
j("messages", "done", str(_wn))
code, out = j("messages", "waiting")
check("and once it is processed it is no longer listed", (code, "the lantern relay clicks at night" in out), (0, False))

j("messages", "add", "the agent reads this one")
_n = len(stored())
check("a message nobody has read has no read time", stored()[-1].get("read"), None)
j("messages", "show", str(_n))
_read = stored()[-1].get("read")
code, out = j("messages")
check("once the agent reads it, it is still waiting but marked as being handled",
      (bool(_read), stored()[-1].get("processed"), "being handled" in out), (True, None, True))
j("messages", "add", "and this one is read by waiting")
j("messages", "waiting")
check("reading the waiting messages marks each as being handled", bool(stored()[-1].get("read")), True)

j("messages", "add", "are we caching the build already? also add a to-do to speed up the linter")
_q = len(stored())
code, out = j("messages", "reply", str(_q), "Yes, since last week.", "--part=are we caching the build already?")
_m = stored()[-1]
check("a reply with --part answers that question: the part is recorded as answered and the reply names it",
      (code, [p["became"] for p in _m["parts"]], _m["replies"][-1].get("part")), (0, [["answered"]], "are we caching the build already?"))
import notifications as _notes  # noqa: E402
check("and the user is notified", any(f"message {_q}" in x["text"] for x in _notes._all(d / ".journal", "default")), True)
code, out = j("messages", "reply", str(_q), "no", "--part=words that are not there")
check("a part that is not in the message is refused", code, 1)
code, out = j("messages", "show", str(_q))
check("showing a message says how to answer a question in it", "--part=" in out and "messages reply" in out, True)

j("messages", "add", "would the log read better newest at the bottom?")
_f = len(stored())
code, out = j("messages", "reply", str(_f), "Yes, I think so.", "--part=would the log read better newest at the bottom?",
              "--follow-up=Should I switch the log to newest at the bottom?", "--option=Switch it", "--option-description=newest right above the box",
              "--option=Leave it", "--pick=1")
import questions as _qs  # noqa: E402
_asked = [q for n, q in _qs.about(d / ".journal", f"inbox:{_f}", "default")]
check("a reply can end with a follow-up question about the message, with its options and pick",
      (code, [q["text"] for q in _asked], [o["label"] for o in (_asked[0]["options"] if _asked else [])], _asked[0]["pick"] if _asked else None),
      (0, ["Should I switch the log to newest at the bottom?"], ["Switch it", "Leave it"], 1))
j("messages", "add", "and what about the colours?")
_g = len(stored())
code, out = j("messages", "reply", str(_g), "Either works.", "--part=and what about the colours?",
              "--follow-up=Which? A) blue B) green")
check("a follow-up that lists its choices in its text is refused, and the reply is not written either",
      (code, "--option=" in out, stored()[-1].get("replies")), (1, True, None))

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
