#!/usr/bin/env python3
"""The conversation on an environment: what was said, never what was done.

    .journal/test_chat.py

Every edge: a tagged reply is a turn and an untagged one is not; a message that merely
mentions a tag is not filed as one; what the agent DID never appears, however much of it
there is; the user's messages and both sides' replies interleave by time; the thread is
capped and says how much it left off; and reading it twice does not read the transcript
twice.
"""
import json, os, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit, transcript  # noqa: E402
from datetime import datetime, timezone  # noqa: E402


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


STEM = "cccccccc-0000-4000-8000-00000000000c"
d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
(d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False}))
transcript.project_dir(d).mkdir(parents=True, exist_ok=True)
path = transcript.project_dir(d) / f"{STEM}.jsonl"
path.write_text("")
P = testkit.Project(d)
P.hook("SessionStart", session_id=STEM, transcript_path=str(path), source="startup")
P.cli("switch", "w", session=STEM)


def mark(env):
    """A transcript says which environment it was on: the start block injects it, a switch prints it."""
    global n
    n += 1
    with path.open("a") as fh:
        fh.write(json.dumps({"type": "user", "uuid": f"u{n}", "origin": {"kind": "injected"}, "message": {
            "role": "user", "content": f"this session is bound to environment `{env}`"}}) + "\n")

n = 0


def say(text):
    global n
    n += 1
    with path.open("a") as fh:
        fh.write(json.dumps({"type": "assistant", "uuid": f"a{n}", "timestamp": now(), "message": {
            "role": "assistant", "content": [{"type": "text", "text": text}]}}) + "\n")


import controllers.chat as chat  # noqa: E402

root = d / ".journal"


def turns(env="w"):
    chat._READ.clear()
    return chat.said(root, env) + chat.wrote(root, env)


# ---------------------------------------------------------------- a tag is what makes a turn
mark("w")
say("[!discovery] the cache key was the file size")
say("no tag on this one, so it is not a turn")
say("[!reply] answering directly")
said = [t for t in turns() if t["kind"] == "said"]
check("a tagged reply is a turn, an untagged one is not",
      [(t["tag"], t["text"]) for t in said],
      [("discovery", "the cache key was the file size"), ("reply", "answering directly")])

say("A message can explain that [!discovery] opens a line without being one")
said = [t for t in turns() if t["kind"] == "said"]
check("a message that only MENTIONS a tag is not filed as one", len(said), 2)

# ---------------------------------------------------------------- what it DID is never in the thread
P.cli("todos", "add", "something it did", session=STEM)
P.cli("work", "start", "doing the thing", session=STEM)
P.cli("work", "update", "it moved", session=STEM)
check("nothing the agent DID reaches the thread, whatever it was",
      [t for t in turns() if t["kind"] not in ("said", "message", "reply")], [])
check("and the said turns are untouched by it", len([t for t in turns() if t["kind"] == "said"]), 2)

# ---------------------------------------------------------------- both sides, in the order they happened
import inbox  # noqa: E402

inbox.add(root, "the user's first message", now(), track="w")
inbox.reply(root, 1, "the agent answering it", now(), source="cli", track="w")
inbox.reply(root, 1, "and the user again", now(), source="web", track="w")
rows = [t for t in turns() if t["kind"] in ("message", "reply")]
check("a message and both sides' replies are turns, each attributed to whoever wrote it",
      [(t["who"], t["kind"], t["text"]) for t in rows],
      [("you", "message", "the user's first message"),
       ("agent", "reply", "the agent answering it"),
       ("you", "reply", "and the user again")])

inbox.add(root, "an archived one", now(), track="w")
inbox.archive(root, 2, "not part of the conversation", now(), track="w")
check("an archived message is not a turn",
      [t for t in turns() if "archived one" in t["text"]], [])
check("every turn carries a time, so the thread can be ordered", all(t["at"] for t in turns()), True)

# ------------------------------------------ the journal's note, and only when the agent said nothing
# EITHER A NOTE OR AN ANSWER, NEVER BOTH. The note is read off the record rather than written into
# it, so a reply that lands after the message was filed still replaces it.
import todo as _todo  # noqa: E402

inbox.add(root, "please look at the padding", now(), track="w")
_n = len(inbox._all(root, "w"))
_todo.add(root, "w", "fix the padding", "", now())
inbox.process(root, _n, "the padding", ["todo:1"], now(), track="w")
inbox.done(root, _n, now(), track="w")
check("a message nobody answered carries the journal's note, naming what it became",
      [(t["who"], t["kind"], t["text"]) for t in turns() if t["kind"] == "receipt"],
      [("agent", "receipt", "Noted — created to-do 1.")])
inbox.reply(root, _n, "Done — it was the bar, not the bubble.", now(), source="cli", track="w")
check("a reply quotes the message it answers, so the thread shows it IS a reply",
      [t["ref"] for t in turns() if t["kind"] == "reply"][-1], "please look at the padding")
check("and the agent's own words replace it, rather than standing beside it",
      ([t["kind"] for t in turns() if t["kind"] == "receipt"],
       [t["text"] for t in turns() if t["kind"] == "reply"][-1]),
      ([], "Done — it was the bar, not the bubble."))
inbox.reply(root, _n, "And thanks.", now(), source="web", track="w")
check("and the user's own reply quotes it too — a reply is not the message",
      [t["ref"] for t in turns() if t["kind"] == "reply"][-1], "please look at the padding")

# ---------------------------------------------------------------- the cap, and the read behind it
chat.TURNS = 3
import serve  # noqa: E402

code, _ctype, body = serve._answered(root, "GET", "/api/env/w/chat", {})
got = json.loads(body)
check("the thread hands back the newest turns and says how many it left off",
      (code, len(got["turns"]), got["more"] > 0), (200, 3, True))
check("newest last, so the thread reads downwards",
      got["turns"] == sorted(got["turns"], key=lambda t: t["at"]), True)

chat._READ.clear()
chat.said(root, "w")
before = dict(chat._READ)
chat.said(root, "w")
check("a second read of an unchanged transcript re-reads nothing", chat._READ == before and bool(before), True)
say("[!info] and now it has grown")
chat.said(root, "w")
check("but a transcript that has grown is read again",
      [t["text"] for t in chat.said(root, "w") if t["kind"] == "said"][-1], "and now it has grown")

# ------------------------------------------- history outlives the session that said it
# the one the old code got wrong: it read only LIVE sessions, so ending one, switching it away
# or letting it go stale took every agent turn with it while the user's half stayed
mark("elsewhere")
say("[!info] said while the session was on another environment")
mark("w")
say("[!discovery] and back again")
chat._READ.clear()
check("a turn is filed under the environment that was current when it was said",
      ([t["text"] for t in chat.said(root, "elsewhere")],
       [t["text"] for t in chat.said(root, "w")][-1]),
      (["said while the session was on another environment"], "and back again"))

import state as _state, tracks as _tracks  # noqa: E402
_state.put(root, "ended", now(), stem=STEM)
chat._READ.clear()
check("the session is over as far as the record is concerned", _tracks.live(root), {})
check("and the thread still has every turn it said, on each environment",
      (len([t for t in turns() if t["kind"] == "said"]) > 0,
       [t["text"] for t in chat.said(root, "elsewhere")]),
      (True, ["said while the session was on another environment"]))

# -------------------------------------- work the agent set aside is a turn, with the ask on it
# PARKING IS THE AGENT SAYING IT CANNOT GO ON WITHOUT YOU, and it used to say it where nobody
# looked: the home filters parked work out of its open-work list. It is a turn because it is one.
import work as _work  # noqa: E402
_state.use_track("w")   # work is written under the environment this process is on
_work.start(root, "merge the branch", now())
_work.park(root, "The PR is ready. Do you want me to merge it?", now(), on="merge the branch")
held = [t for t in chat.waited(root, "w")]
check("parked work is a turn from the agent, carrying the work it holds",
      ([(t["who"], t["kind"], t["text"], t["ref"]) for t in held]),
      [("agent", "parked", "The PR is ready. Do you want me to merge it?", "merge the branch")])
check("and it is in the thread with everything else",
      any(t["kind"] == "parked" for t in turns() + chat.waited(root, "w")), True)
_work.note(root, "on it", now(), on="merge the branch")   # progress clears a park, the same as a wait
check("work that has moved again is no longer waiting on anyone", chat.waited(root, "w"), [])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
