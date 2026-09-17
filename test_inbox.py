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
# research the user asked for ends in a report (rule 9), so a part has to be able to say it became one
code, out = j("inbox", "process", "1", "--part=the parser", "--became=report 9")
check("a part cannot become a report that does not exist", (code, "no report 9" in out), (1, True))
code, out = j("inbox", "process", "1", "--part=the parser", "--became=doc 9")
check("nor a doc that does not exist", (code, "no doc 9" in out), (1, True))
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
# A LATE PART IS STILL THE TRUTH ABOUT WHAT THE USER SAID: a plan asked for in a message that was
# already closed had nothing to link back to, and an answer that came an hour later had nowhere to go.
code, out = j("inbox", "process", "1", "--part=rename", "--became=noted")
check("a processed message still takes a late part, and says it was already processed",
      (code, "was already processed" in out, "became noted" in out), (0, True, True))
code, out = j("inbox", "reply", "1", "it is done now", "--part=rename the parser module")
check("and a late answer to one of its parts", (code, "answered part of message 1" in out), (0, True))
code, out = j("inbox", "done", "1")
check("but it is not processed a second time", code, 1)
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
      [(2, "waiting", ["question 1"]),
       (1, "processed", ["to-do 1", "pin 1", "noted", "plan 1", "noted", "answered"])])
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
check("the stop holds while a message waits, ahead of the rest of the queue, and NAMES THE OLDEST",
      label, "the user left 1 message(s) for you, the oldest being message 2")

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
# WHERE A TRANSCRIPT LIVES, decided by the user: it stays a message attachment. What that has to mean is
# that it is outside the catalogue and never handed to a session — the reason no "hidden doc" flag was
# built. Asserted against the real functions rather than described in a reply.
import docs as _docs  # noqa: E402
check("a held attachment is in no doc: the catalogue does not contain it",
      [x for x in _docs.all_docs(root) if "shot.png" in json.dumps(x)], [])
check("and a session start is never handed it",
      "message-files" in _docs.carry(root, track="default") or "shot.png" in _docs.carry(root, track="default"), False)
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

# ------------------------------------------------- quoting the thread, the other direction from --part
code, out = j("messages", "reply", str(_rn), "Then leave it.", "--quoting=already taken by export")
check("a reply may quote words really said in the thread", (code, "replied to message" in out), (0, True))
code, out = j("messages", "reply", str(_rn), "Then leave it.", "--quoting=a thing nobody said here")
check("and a quote nobody said is refused, the same guarantee --part carries",
      (code, "quote words that were really said" in out), (1, True))
code, out = j("messages", "reply", str(_rn), "Not this either.", "--quoting=rename the flag to --json")
check("the MESSAGE's own words are not the thread's: --part checks those, --quoting checks what was said back",
      (code, "quote words that were really said" in out), (1, True))
_reps = [r for r in stored()[_rn - 1]["replies"] if r.get("quoting")]
check("the quote is stored on the reply, beside part and never merged into it",
      [(r["quoting"], r.get("part", "")) for r in _reps], [("already taken by export", "")])

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

# ------------------------------------------------------------------ a moved message is read where it went
j("prepare", "faraway")
j("switch", "default")
j("messages", "look at the loader while you are in there")
_mv = len(stored())
code, out = j("messages", "move", str(_mv), "faraway")
check("a waiting message can be carried to another environment", (code, "moved to faraway" in out), (0, True))
code, out = j("messages", "process", str(_mv), "--part=the loader", "--became=noted")
check("and a late part is refused here, naming where it went and which message it is there",
      (code, "was moved to `faraway`" in out, "message 1" in out), (1, True, True))

# A TRANSCRIPT IS FILED BY QUOTING IT. What makes a long paste safe is that an excerpt must be the
# user's own words: a summary the agent wrote cannot be filed as something they said, and the chat
# around the decisions is simply never quoted.
j("messages", "add", "Jesse: right, so the loader.\nSam: it double-fetches on every open.\nJesse: fix that this week.\nSam: also the coffee machine is broken.")
_tn = len(stored())
code, out = j("messages", "process", str(_tn), "--part=it double-fetches on every open", "--became=noted")
check("a coarse excerpt spanning one speaker's words is filed", (code, "became noted" in out), (0, True))
code, out = j("messages", "process", str(_tn), "--part=the team agreed to fix the loader", "--became=noted")
check("but a summary the agent wrote is refused, however true", (code, "not in message" in out), (1, True))

# ------------------------------------------------------------- a ref lives where it was MADE, not where it was said
# `todo 1` exists on both environments here, so a bare ref cannot say which one was meant: the part
# records the environment its ref lives on, and the message stays where the user left it.
import inbox as _inbox  # noqa: E402

j("switch", "faraway")
j("todos", "add", "swap the loader, over on faraway")
j("switch", "default")
j("todos", "add", "something else entirely, here on default")
j("messages", "add", "swap the loader while you are at it")
_cx = len(stored())
code, out = j("messages", "process", str(_cx), "--part=swap the loader", "--became=todo 1", "--in=faraway")
check("a part can say its ref lives on another environment", (code, "became to-do 1" in out), (0, True))
check("and the part records which one", stored()[-1]["parts"][-1].get("env"), "faraway")
_root = d / ".journal"
check("the to-do's page finds the message, though it sits elsewhere",
      [(r["n"], r["env"]) for r in _inbox.sources(_root, "todo:1", "faraway")], [(_cx, "default")])
check("and the same bare ref here keeps its OWN message, never the other environment's",
      [(r["n"], r["env"]) for r in _inbox.sources(_root, "todo:1", "default")], [(1, "default")])

# ------------------------------------------------------- a reply with no part is still told to the user
# A plain reply answers the whole message rather than one quoted line of it. It used to return before
# the notification was written, so the user was never shown it and the home could not list it.
import notifications as _notif  # noqa: E402

j("switch", "default")
j("messages", "add", "did the loader ever get swapped?")
_pr = len(stored())
_had = len(_notif._all(d / ".journal", "default"))
code, out = j("messages", "reply", str(_pr), "Swapped it this morning.")
check("a plain reply is taken", (code, "replied to message" in out), (0, True))
_notes = _notif._all(d / ".journal", "default")
check("and the user is notified about it, the way a part-answering reply is",
      (len(_notes) - _had, _notes[-1]["about"], "Replied to your message" in _notes[-1]["text"]),
      (1, f"inbox:{_pr}", True))
check("the notification is unread, which is what puts it in front of them",
      _notes[-1].get("read_at"), None)

# ------------------------------------------------- a message can say WHAT IT IS when it is sent
# Sending a transcript DECLARES what it is, and that word is the instruction: nothing downstream
# has to infer it from size or extension. An ordinary message declares nothing and carries no kind.
import inbox as _inbox  # noqa: E402

j("switch", "default")
code, out = j("messages", "add", "here is the meeting transcript", "--kind=transcript")
check("a message can be sent as a transcript", code, 0)
_rows = stored()
check("the kind is stored on the row, and an ordinary message carries none",
      (_rows[-1].get("kind"), _rows[0].get("kind", "")), ("transcript", ""))
check("and it comes back on the row the viewer and the agent read",
      (_inbox.row_response(len(_rows), _rows[-1])["kind"], _inbox.row_response(1, _rows[0])["kind"]),
      ("transcript", ""))
code, out = j("messages", "add", "what is this", "--kind=banana")
check("an unknown kind is refused, naming what there is",
      (code, "no message kind called" in out, "transcript" in out), (1, True, True))
check("and the refused one wrote nothing", len(stored()), len(_rows))

# ------------------------------------------------- a transcript is its own file, and not a doc
# "It's not a document; it's its own thing... It's an MD file, but it says transcript." The doc
# catalogue scans `root.parent / docs_dir`; a transcript lives under the environment, so it is
# invisible to it structurally rather than by a filter anyone has to keep in step.
import docs as _docs  # noqa: E402

j("switch", "default")
j("messages", "add", "Jesse: the loader double-fetches on every open. Sam: fix it this week.", "--kind=transcript")
_tn = len(stored())
_tpath = _inbox.transcript_path(d / ".journal", "default", _tn)
check("a declared transcript is written as its own .md", _tpath.is_file(), True)
_head, _, _body = _tpath.read_text().partition("---\n")[2].partition("\n---\n")
check("its frontmatter says what it is, and which message carried it",
      ("kind: transcript" in _head, f"message: {_tn}" in _head), (True, True))
check("and the transcript itself is the body", "the loader double-fetches" in _body, True)
check("the document catalogue does not list it",
      [x for x in _docs.all_docs(d / ".journal") if "loader double-fetches" in str(x)], [])
check("and it is not inside the catalogue's tree at all",
      str(_tpath).startswith(str(_docs.folder(d / ".journal"))), False)
j("messages", "add", "an ordinary message writes no transcript")
check("an ordinary message writes none",
      _inbox.transcript_path(d / ".journal", "default", len(stored())).exists(), False)

# ------------------------------------------------- a message already here can be told what it is
# Recognition is worth nothing if a recognised transcript cannot BECOME a declared one: it would have
# no file, no flag, and neither the chip nor the link. Declaring late is the same act, applied late --
# and a PROCESSED message may still be declared, because recognition happens while filing.
j("switch", "default")
j("messages", "add", "Jesse: the loader double-fetches. Sam: fix it this week.")
_und = len(stored())
check("it arrives as an ordinary message", stored()[-1].get("kind", ""), "")
code, out = j("messages", "declare", str(_und), "transcript")
check("it can be told what it is", (code, "is a transcript now" in out), (0, True))
check("and that writes the file and records it, exactly as sending one declared does",
      (stored()[-1].get("kind"), bool(stored()[-1].get("transcript")),
       _inbox.transcript_path(d / ".journal", "default", _und).is_file()),
      ("transcript", True, True))
code, out = j("messages", "declare", str(_und), "transcript")
check("saying it twice is refused", (code, "already a transcript" in out), (1, True))
code, out = j("messages", "declare", str(_und), "banana")
check("and a kind that does not exist is refused, naming what there is",
      (code, "no message kind called" in out), (1, True))
j("messages", "add", "Sam: a second conversation.")
_proc = len(stored())
j("messages", "process", str(_proc), "--part=a second conversation", "--became=noted")
j("messages", "done", str(_proc))
code, out = j("messages", "declare", str(_proc), "transcript")
check("a message already processed can still be declared — recognition happens while filing",
      (code, "is a transcript now" in out), (0, True))

# ------------------------------------------- --stdin: prose the shell cannot put a hole in
# a shell runs a backtick span as a command and hands the argument over with the span GONE, silently,
# which cannot be detected afterwards — so the answer is a path the shell never touches, the one
# --brief has always used
code, out = j("messages", "add", "a message to answer on stdin")
_sn = int(re.search(r"message (\d+)", out).group(1))
code, out = P.cli("messages", "reply", str(_sn), "--stdin", stdin="a reply with `backticks` kept whole")
check("a reply takes its text on stdin", (code, "replied to message" in out), (0, True))
check("and the backticks are still in it", "`backticks`" in j("messages", "show", str(_sn))[1], True)
check("an empty stdin is refused rather than filing nothing",
      P.cli("messages", "reply", str(_sn), "--stdin", stdin="")[0], 1)
check("the argument still works when --stdin is not asked for",
      j("messages", "reply", str(_sn), "a plain one")[0], 0)


print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
