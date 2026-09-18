#!/usr/bin/env python3
"""The web viewer: `views.py`'s read layer and `serve.py`'s JSON API over it.

    .journal/test_serve.py

IN-PROCESS, ON PORT 0. No subprocess: `serve.py`'s route handlers are pure functions of
(root, project, match), so the server is started in a background thread against a bare
fixture directory, on whatever port the OS hands out, and stopped at the end. That is
what keeps this suite fast and keeps [[tests-bounded]] — nothing here can hang waiting on
a port that was already taken.
"""
import contextlib
import json
import os
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit  # noqa: E402,F401  (removes this suite's temporary folders when it exits)
import docs, inbox, pins, questions, reminders, serve, state, todo, tracks, views, work  # noqa: E402

AT = "2026-09-11T12:00:00+00:00"
ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


# ─────────────────────────────────────────────────────────────────── the fixture
project = Path(tempfile.mkdtemp())
root = project / ".journal"
root.mkdir(parents=True)

tracks.create(root, "alpha", "beta", at=AT)

state.use_track("alpha")
pins.add(root, "a pin on alpha", AT, 400)
pins.add(root, "a pin on alpha with reasoning", AT, 400, long="the argument behind it")
work.start(root, "something in flight on alpha", AT)
reminders.add(root, "say hi on alpha", AT, 200)
todo.add(root, "alpha", "do the thing", "a brief body", AT)

state.use_track("beta")
pins.add(root, "a pin on beta", AT, 400)

# a doc, with a part and a real attachment — scoped to alpha
docs.add(root, "a design", "the abstract", "the body", "alpha")
docs.part(root, "1", "a report", "part body text", "alpha")
attach_src = project / "attachment.txt"
attach_src.write_text("attachment contents\n")
docs.attach(root, "1", str(attach_src), "the attachment", "alpha")

# a second doc, GLOBAL — the split this suite exists to guard: the top nav's
# catalogue and alpha's own page must never show each other's doc.
docs.add(root, "a project-wide note", "the global abstract", "the global body", docs.GLOBAL)

# citations of doc 1, on THREE different environments/kinds — cited_by must find all
# of them (the bug it used to have: to-dos on any environment but the current one
# were invisible here).
pins.add(root, "beta's pin cites the design", AT, 400, where={"doc": "1"})
pins.add(root, "a rule that cites the design", AT, 400, key=pins.RULES, where={"doc": "1"})
todo.add(root, "beta", "follow up on the design", "body", AT, where={"doc": "1"})

# an inbox message and questions — about a to-do and a doc on alpha, about a rule on beta
inbox.add(root, "hello from the cli", AT, track="alpha")
questions.add(root, "which colour?", AT, ["todo 1"], track="alpha")
questions.add(root, "is the design final?", AT, ["doc 1"], track="alpha")
questions.add(root, "does the rule still hold?", AT, ["rule 1"], track="beta")

# WHAT THE STOP HOOK'S PROCESS-GLOBAL TRACK SHOULD NEVER LEAK INTO A RESPONSE: leave the
# process tracked as something that is neither alpha nor beta, the way a real server
# process would be — see pin 3, the whole reason views.py takes `env` explicitly.
state.use_track("default")


# ─────────────────────────────────────────────────────────────────── the server
srv = serve._Server(("127.0.0.1", 0), root, project)
port = srv.server_port
thread = threading.Thread(target=srv.serve_forever, daemon=True)
thread.start()
BASE = f"http://127.0.0.1:{port}"


def get(path: str, method: str = "GET") -> tuple[int, dict, bytes]:
    req = urllib.request.Request(BASE + path, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read()


# ─────────────────────────────────────────────────────────────────────── checks
status, _, body = get("/")
check("/ answers 200", status, 200)
check("/ is html", b"<!doctype html>" in body.lower() or b"<!DOCTYPE" in body, True)

status, _, body = get("/app.js")
check("/app.js answers 200", status, 200)
check("/app.js has no leaked ANSI escapes", b"\x1b[" in body, False)

status, _, body = get("/api/overview")
data = json.loads(body)
check("/api/overview answers 200", status, 200)
check("overview lists both environments", {e["name"] for e in data["environments"]} >= {"alpha", "beta"}, True)
check("overview names the project the viewer's sidebar shows", data["project"], project.name)
check("and the version being served, so an open page can reload when it changes", "version" in data, True)
check("environments come newest activity first", [e["last_active"] for e in data["environments"]],
      sorted((e["last_active"] for e in data["environments"]), reverse=True))
check("a project that is current says nothing about an update", data["update"], None)
# THE PAGE MUST NEVER WAIT ON THE NETWORK. This was reported from the field: /api/overview called the
# refresh, so one poll in every fifteen minutes paid a round trip inside its own response, and on a
# machine that cannot reach the repository quickly the home just sat there loading.
import update as _update  # noqa: E402
_fetched = []
_real_fetch = _update._fetch
_update._fetch = lambda url, timeout=3.0: _fetched.append(url)
try:
    get("/api/overview")
    check("the overview reads the cached answer and makes no request of its own", _fetched, [])
finally:
    _update._fetch = _real_fetch
# the upstream answer is cached on disk and the suites never reach the network: a cache naming a
# newer version is exactly what a real project that has fallen behind looks like
(root / "runtime").mkdir(parents=True, exist_ok=True)
(root / "runtime" / "upstream.cache").write_text(json.dumps(
    {"version": "999.0.0", "headline": "Everything is different now", "at": time.time()}))
data = json.loads(get("/api/overview")[2])
check("a project that has fallen behind carries the version, what it has, and the headline",
      data["update"], {"version": "999.0.0", "have": data["version"], "headline": "Everything is different now"})
(root / "runtime" / "upstream.cache").unlink()

status, _, body = get("/api/env/alpha/todos")
data = json.loads(body)
check("alpha's to-dos: 200 and the seeded to-do is there", (status, any(t["title"] == "do the thing" for t in data)), (200, True))
check("a to-do row carries its priority, for the priority column", [t["priority"] for t in data], [100])

status, _, body = get("/api/env/nope/todos")
check("an unknown environment is 404, not 500", status, 404)
check("the 404 is still JSON, with an error field", "error" in json.loads(body), True)

# THE REGRESSION THIS SUITE EXISTS FOR: alpha's pin is never handed back for beta, and the
# server process being tracked as neither (see state.use_track("default") above) proves
# the API reads the NAMED environment, never the process's own idea of "current".
status, _, body = get("/api/env/alpha/pins")
alpha_pins = [p["fact"] for p in json.loads(body)]
check("alpha's pins: 200, has alpha's pin, not beta's",
      (status, "a pin on alpha" in alpha_pins, "a pin on beta" in alpha_pins), (200, True, False))

status, _, body = get("/api/env/beta/pins")
beta_pins = [p["fact"] for p in json.loads(body)]
check("beta's pins: 200, has beta's pin, not alpha's",
      (status, "a pin on beta" in beta_pins, "a pin on alpha" in beta_pins), (200, True, False))

status, _, body = get("/api/rules")
check("/api/rules answers 200 (project-wide, no environment)", status, 200)

status, _, body = get("/api/rules/1")
rule_detail = json.loads(body)
check("rule detail: 200, the claim and its doc citation",
      (status, "rule that cites" in rule_detail["fact"], "→ doc 1" in rule_detail["meta"]), (200, True, True))

status, _, body = get("/api/rules/999")
check("an unknown rule number is 404, not 500", status, 404)

# THE REGRESSION THIS GUARDS: pins.body() used to read a pin's long-form reasoning
# from wherever the PROCESS was tracked as, not the environment actually asked for —
# the process here is tracked as "default" (see state.use_track above), and alpha's
# own pin 2's body must still come back correctly.
status, _, body = get("/api/env/alpha/pins/2")
pin_detail = json.loads(body)
check("pin detail: 200, the claim and its reasoning, from alpha — not wherever this process is tracked",
      (status, pin_detail["fact"], pin_detail["body"].strip()),
      (200, "a pin on alpha with reasoning", "the argument behind it"))

status, _, body = get("/api/env/alpha/pins/999")
check("an unknown pin number is 404, not 500", status, 404)

status, _, body = get("/api/env/alpha/work")
check("alpha's open work is there", any(w["subject"] == "something in flight on alpha" for w in json.loads(body)), True)

status, _, body = get("/api/env/alpha/reminders")
check("alpha's reminder is there", any(r["text"] == "say hi on alpha" for r in json.loads(body)), True)

status, _, body = get("/api/docs")
docs_list = json.loads(body)
check("the top-nav catalogue: 200, only the GLOBAL doc, never alpha's",
      (status, [d["title"] for d in docs_list]), (200, ["a project-wide note"]))

status, _, body = get("/api/env/alpha/docs")
alpha_docs = json.loads(body)
check("alpha's own docs page: 200, only alpha's doc, never the global one",
      (status, [d["title"] for d in alpha_docs]), (200, ["a design"]))

status, _, body = get("/api/env/beta/docs")
check("beta has no docs of its own", json.loads(body), [])

status, _, body = get("/api/env/nope/docs")
check("an unknown environment's docs is 404, not 500", status, 404)

status, _, body = get("/api/docs/1")
doc_detail = json.loads(body)
check("doc detail: the part is there", any(p["title"] == "a report" for p in doc_detail["parts"]), True)
check("doc detail: the attachment is listed", any(a["name"] == "attachment.txt" for a in doc_detail["attachments"]), True)

# cited_by is STRUCTURED (kind/env/n/text), not pre-formatted strings — so a web page
# can link a hit instead of just printing it. And it must find a citing to-do on
# BETA even though nothing here is tracked as beta right now (the bug this guards).
cited = doc_detail["cited_by"]
check("cited_by finds the pin, on its own environment", any(
    c["kind"] == "pin" and c["env"] == "beta" and "beta's pin cites" in c["text"] for c in cited), True)
check("cited_by finds the rule, with no environment (rules bind every one)", any(
    c["kind"] == "rule" and c["env"] is None and "rule that cites" in c["text"] for c in cited), True)
check("cited_by finds the to-do on beta, not just whichever environment is 'current'", any(
    c["kind"] == "to-do" and c["env"] == "beta" and "follow up on the design" in c["text"] for c in cited), True)

status, _, body = get("/docs/1/files/attachment.txt")
check("the attachment downloads: 200, real bytes", (status, body), (200, b"attachment contents\n"))

status, _, body = get("/docs/1/files/nope.txt")
check("an unknown attachment name is 404", status, 404)

# PATH TRAVERSAL: the route matches an attachment by NAME against the doc's own manifest
# (see serve._doc_file's docstring) — `..` and an encoded slash are just names nothing on
# the manifest answers to, so they 404 exactly like any other unknown name, never opening
# a file outside the doc's attachment folder.
status, _, body = get("/docs/1/files/..%2F..%2F..%2Fetc%2Fpasswd")
check("a traversal attempt on an attachment name is refused (404, not a file)", status, 404)

status, _, body = get("/api/overview", method="POST")
check("POST is refused: 405, not attempted", status, 405)


def post(path: str, payload, headers: dict | None = None, method: str = "POST") -> tuple[int, dict]:
    data = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json", **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


# ─────────────────────────────────────────────────────────────── the inbox
status, _, body = get("/api/env/alpha/messages")
check("alpha's inbox: 200, the message from the cli",
      (status, [m["text"] for m in json.loads(body)]), (200, ["hello from the cli"]))
status, _, body = get("/api/env/beta/messages")
check("beta's inbox is its own", json.loads(body), [])
status, got = post("/api/env/beta/messages", {"text": "a message from the browser"})
check("POST a message: 201, written from the web",
      (status, got["data"]["text"], got["data"]["source"]), (201, "a message from the browser", "web"))
check("and it landed on beta, not wherever this process is tracked",
      ([m["text"] for m in inbox.rows_response(root, "alpha")], len(inbox.rows_response(root, "beta"))),
      (["hello from the cli"], 1))
status, got = post("/api/env/beta/messages", {"text": "  "})
check("an empty message is refused: 400 with the reason", (status, "needs its text" in got["error"]), (400, True))
# NOTHING CHANGED, SO NOTHING IS SENT. The viewer polls every five seconds and most polls bring back
# what it already holds -- a listing carries every row in full, measured at half a megabyte on a real
# project. A fingerprint costs a millisecond; sending it again costs all of the rest. This is
# invisible in the page, so only a check keeps it: `fetch` revalidates and hands JS the body it had.
def _conditional(path: str, tag: str) -> tuple[int, bytes]:
    """GET with If-None-Match. urlopen raises on 304, so the answer comes back through the error."""
    req = urllib.request.Request(BASE + path, headers={"If-None-Match": tag})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


status, got = post("/api/env/nope/messages", {"text": "x"})
check("POST to an unknown environment is 404", status, 404)
status, got = post("/api/env/beta/messages", b"text=x", headers={"Content-Type": "application/x-www-form-urlencoded"})
check("a form post is refused: JSON only", status, 415)
status, got = post("/api/env/beta/messages", {"text": "x"}, headers={"Origin": "http://elsewhere.example"})
check("a write from another origin is refused", status, 403)
status, got = post("/api/env/beta/messages", b"[1, 2]")
check("a body that is not a JSON object is 400", status, 400)
check("no refused write landed", len(inbox.rows_response(root, "beta")), 1)
status, got = post("/api/env/beta/messages/1", {"text": "a message from the browser, reworded"}, method="PATCH")
check("a waiting message can be reworded", (status, inbox._all(root, "beta")[0]["text"]), (200, "a message from the browser, reworded"))
status, got = post("/api/env/beta/messages/1/move", {"environment": "alpha"})
check("move carries a waiting message to another environment",
      (status, [m["text"] for m in inbox.rows_response(root, "alpha")][:1], inbox.rows_response(root, "beta")[0]["status"]),
      (200, ["a message from the browser, reworded"], "moved"))
status, got = post("/api/env/beta/messages/1", {"text": "x"}, method="PATCH")
check("a moved message refuses a change", status, 400)
status, got = post("/api/env/alpha/messages/2/process", {"part": "a message from the browser", "became": ["noted"]})
check("a part is recorded through the controller", (status, len(inbox._all(root, "alpha")[1]["parts"])), (200, 1))
status, got = post("/api/env/alpha/messages/2/done", {})
check("and the message is marked processed", (status, bool(inbox._all(root, "alpha")[1]["processed"])), (200, True))
status, got = post("/api/env/alpha/messages/1", {"text": "x"}, method="DELETE")
check("a DELETE archives, never deletes, and wants a reason", (status, len(inbox._all(root, "alpha")) >= 2), (400, True))
# A MESSAGE MAY DECLARE WHAT IT IS. The viewer is where a transcript is sent from, so the kind has to
# survive the HTTP write, not only the module — and an ordinary message declares nothing.
status, got = post("/api/env/beta/messages", {"text": "here is the meeting transcript", "kind": "transcript"})
check("POST a transcript: 201, and the kind comes back on the created row",
      (status, got["data"]["kind"], got["data"]["source"]), (201, "transcript", "web"))
status, got = post("/api/env/beta/messages", {"text": "an ordinary message from the browser"})
check("an ordinary message carries no kind", (status, got["data"]["kind"]), (201, ""))
status, got = post("/api/env/beta/messages", {"text": "what is this", "kind": "banana"})
check("an unknown kind is refused: 400, naming what there is",
      (status, "no message kind called" in got["error"], "transcript" in got["error"]), (400, True, True))
# THE PAGE CAN END THE THING SERVING IT, and only from the page: it goes through the write path, so
# the same-origin guard that protects every other write protects this one. Stopping is not exercised
# here -- this suite's server has to survive the rest of the file -- but the refusal is.
_st, _got = post("/api/viewer/stop", {}, headers={"Origin": "http://elsewhere.example"})
check("a stop from another origin is refused", (_st, "another origin" in json.dumps(_got)), (403, True))
_st, _got = post("/api/viewer/stop", b"not json", headers={"Content-Type": "text/plain"})
check("and a stop that is not JSON is refused too", _st, 415)
# beta's inbox, not alpha's to-dos: a later check pins the NEXT to-do number on alpha, and adding
# one here to move the fingerprint would take it -- the mid-fixture trap this file is full of.
_st, _hd, _ = get("/api/env/beta/messages")
_tag = next((v for k, v in _hd.items() if k.lower() == "etag"), "")
check("a listing is sent with a fingerprint", (_st, bool(_tag)), (200, True))
check("and asking again with it is answered 304, with nothing sent",
      _conditional("/api/env/beta/messages", _tag), (304, b""))
post("/api/env/beta/messages", {"text": "a message that moves the fingerprint"})
check("a change moves the fingerprint, so an update is never missed",
      _conditional("/api/env/beta/messages", _tag)[0], 200)


# ─────────────────────────────────────────────────────────────── questions
status, _, body = get("/api/env/alpha/questions")
check("alpha's questions: 200, both of its own",
      (status, {q["text"] for q in json.loads(body)}), (200, {"which colour?", "is the design final?"}))
status, _, body = get("/api/env/alpha/questions/1")
check("question detail: 200, with what it is about",
      (status, [l["label"] for l in json.loads(body)["links"]]), (200, ["to-do 1"]))
status, _, body = get("/api/env/alpha/questions/99")
check("an unknown question is 404", status, 404)
status, got = post("/api/env/alpha/questions/1/answer", {"answer": "blue"})
check("POST an answer: 200, answered", (status, got["data"]["status"], got["data"]["answer"]), (200, "answered", "blue"))
questions.mark_told(root, "alpha", [1], AT)
status, got = post("/api/env/alpha/questions/1/answer", {"answer": "green"})
check("changing an answer keeps the earlier one and tells the agent again",
      (status, got["data"]["answer"], got["data"]["changed"], questions._all(root, "alpha")[0]["told_at"]),
      (200, "green", True, None))
status, got = post("/api/env/alpha/questions/1", {"text": "which colour, exactly?"}, method="PATCH")
check("editing a question rewords it", (status, got["data"]["text"]), (200, "which colour, exactly?"))
check("reworded after it was answered, it is open again and the answer is kept as an earlier one",
      (got["data"]["status"], got["data"]["answer"], [a["answer"] for a in questions._all(root, "alpha")[0].get("earlier_answers") or []][-1:]),
      ("open", "", ["green"]))
questions.answer(root, 1, "green", AT, track="alpha")  # answered again, as the checks below expect
status, got = post("/api/env/alpha/questions/99/answer", {"answer": "x"})
check("answering an unknown question is 404", status, 404)
status, got = post("/api/env/alpha/questions/2/answer", {"answer": ""})
check("an empty answer is refused: 400", status, 400)

# ─────────────────────────────────────────────────────────────── questions on every resource
status, _, body = get("/api/env/alpha/todos/1")
check("a to-do's detail lists its questions", [q["text"] for q in json.loads(body)["questions"]], ["which colour, exactly?"])
status, _, body = get("/api/docs/1")
check("a doc's detail lists the questions about it, with their environment",
      [(q["env"], q["text"]) for q in json.loads(body)["questions"]], [("alpha", "is the design final?")])
status, _, body = get("/api/rules/1")
check("a rule's detail lists the questions about it, from any environment",
      [(q["env"], q["text"]) for q in json.loads(body)["questions"]], [("beta", "does the rule still hold?")])
status, _, body = get("/api/env/alpha/pins/1")
check("a pin's detail carries a questions list, empty here", json.loads(body)["questions"], [])
status, _, body = get("/api/env/alpha")
env_row = json.loads(body)
check("an environment counts its waiting messages and open questions", (env_row["inbox"], env_row["questions"]), (1, 1))

status, _, body = get("/nothing/here")
check("an unmapped path is 404, not a crash", status, 404)

# ─────────────────────────────────────────────────────────────── reminders, through their controller
status, _, body = get("/api/env/alpha/reminders/1")
check("a reminder's show page: 200, its text", (status, json.loads(body)["text"]), (200, "say hi on alpha"))
status, got = post("/api/env/alpha/reminders", {"text": "check the build", "until": "it is green"})
check("store: 201, and it lands on alpha", (status, [r["text"] for r in reminders._all(root, "alpha")][-1]),
      (201, "check the build"))
status, got = post("/api/env/alpha/reminders/2", {"text": "check the build twice"}, method="PATCH")
check("update changes the text and keeps the condition it was not sent",
      (status, reminders._all(root, "alpha")[1]["text"], reminders._all(root, "alpha")[1]["until"]),
      (200, "check the build twice", "it is green"))
status, got = post("/api/env/alpha/reminders/2", {}, method="DELETE")
check("destroy needs a reason: 400", status, 400)
status, got = post("/api/env/alpha/reminders/2", {"why": "the build is green"}, method="DELETE")
check("destroy retires it on the record, never erases it",
      (status, reminders._all(root, "alpha")[1]["done"], len(reminders._all(root, "alpha"))), (200, "the build is green", 2))
status, got = post("/api/env/alpha/reminders/9", {"why": "x"}, method="DELETE")
check("a reminder that is not there is 404", status, 404)
status, got = post("/api/env/alpha/reminders/1/fly", {})
check("an action the controller does not have is 404", status, 404)
check("beta was never touched", reminders._all(root, "beta"), [])
state.use_track("default")

# ─────────────────────────────────────────────────────────────── to-dos, through their controller
status, got = post("/api/env/alpha/todos", {"title": "write the release note", "body": "what changed"})
added = got.get("data") or {}
check("store: 201, and the new to-do is numbered on alpha", (status, added.get("n")), (201, 2))
status, got = post("/api/env/alpha/todos/2", {"title": "write the release notes", "priority": "high"}, method="PATCH")
check("update renames and reprioritises in one request",
      (status, todo.item(root, "alpha", 2)[0]["title"], todo.priority_label(todo.priority_of(todo.item(root, "alpha", 2)[0]))),
      (200, "write the release notes", "high (150)"))
status, got = post("/api/env/alpha/todos/2", {}, method="PATCH")
check("an update with nothing to change is refused", status, 400)
status, got = post("/api/env/alpha/todos/2", {}, method="DELETE")
check("destroy without a reason is refused", status, 400)
status, got = post("/api/env/alpha/todos/2/done", {"how": "written"})
check("done closes it", (status, bool(todo.item(root, "alpha", 2)[0].get("done"))), (200, True))
status, got = post("/api/env/alpha/todos/2", {"title": "rename a closed one"}, method="PATCH")
check("a closed to-do refuses an edit, and says to reopen it",
      (status, "reopen" in got["error"], todo.item(root, "alpha", 2)[0]["title"]), (400, True, "write the release notes"))
status, got = post("/api/env/alpha/todos/2/priority", {"value": "low"})
check("and refuses its own actions too", status, 400)
status, got = post("/api/env/alpha/todos/2/reopen", {"why": "one more line"})
check("reopening is the way back", (status, todo.item(root, "alpha", 2)[0].get("done") or ""), (200, ""))
status, got = post("/api/env/alpha/todos/2", {"why": "someone else wrote it"}, method="DELETE")
check("destroy drops it with the reason", (status, todo.item(root, "alpha", 2)[0].get("how")), (200, "dropped: someone else wrote it"))
status, _, body = get("/api/env/alpha/todos?sort=priority&direction=asc")
check("a list sorts by what the request asks, in the direction it asks", (status, [t["n"] for t in json.loads(body)][:1]), (200, [1]))
status, _, body = get("/api/env/alpha/todos?sort=body")
check("a field that cannot be sorted on is a 400 naming what can", (status, "priority" in json.loads(body)["error"]), (400, True))
status, got = post("/api/env/beta/todos/2", {"title": "x"}, method="PATCH")
check("a number that is not on that environment is 404", status, 404)

# ─────────────────────────────────────────────────────────────── a folder attachment's files
board = project / "boards"
(board / "img").mkdir(parents=True)
(board / "index.html").write_text("<h1>the board</h1>")
(board / "img" / "dot.svg").write_text("<svg xmlns='http://www.w3.org/2000/svg'/>")
docs.attach(root, "1", str(board), "the design boards", "alpha")
status, _, body = get("/api/docs/1")
folder = next(a for a in json.loads(body)["attachments"] if a["dir"])
check("a folder attachment lists the files it holds", sorted(folder["files"]), ["img/dot.svg", "index.html"])
status, headers, body = get(f"/docs/1/files/{folder['name']}/index.html")
check("a file inside it is served with its type", (status, headers.get("Content-Type"), b"the board" in body), (200, "text/html", True))
status, _, _ = get(f"/docs/1/files/{folder['name']}/..%2F..%2Fattachment.txt")
check("and nothing outside the folder is", status, 404)

# ─────────────────────────────────────────────────────────────── a resource links back to the message it came from
status, got = post("/api/env/alpha/messages", {"text": "please finish it properly"})
n_msg = got["data"]["n"]
post(f"/api/env/alpha/messages/{n_msg}/process", {"part": "finish it properly", "became": ["todo 1"]})
status, _, body = get("/api/env/alpha/todos/1")
check("a to-do's detail names the message it came from", [m["n"] for m in json.loads(body)["from_messages"]], [n_msg])
# a plan proposed from a transcript must say which message produced it — the common case is a message
# and a plan on the same environment, which is what a paste creates
post("/api/env/alpha/plans", {"title": "from a pasted transcript", "goal": "the loader stops double-fetching"})
_pn = len(__import__("plans")._all(root, "alpha"))
status, got = post("/api/env/alpha/messages", {"text": "Sam: it double-fetches on every open. Jesse: plan that."})
_pmsg = got["data"]["n"]
post(f"/api/env/alpha/messages/{_pmsg}/process", {"part": "it double-fetches on every open", "became": [f"plan {_pn}"]})
status, _, body = get(f"/api/env/alpha/plans/{_pn}")
check("a plan's detail names the message it came from",
      [m["n"] for m in json.loads(body)["from_messages"]], [_pmsg])

# THE EXTENSION SHIPS INSIDE THE PACKAGE, so the journal hands it over itself rather than sending
# anyone to a store listing that does not exist. A checkout without the folder answers 404 and the
# Settings page offers nothing — both are correct, and the check covers the pair.
import io as _io, zipfile as _zipfile  # noqa: E402
_ext_status, _ext_headers, _ext_body = get("/extension.zip")
_ext_names = sorted(_zipfile.ZipFile(_io.BytesIO(_ext_body)).namelist()) if _ext_status == 200 else []
check("the viewer hands out the extension as a zip, or says it has none",
      (_ext_status in (200, 404),
       _ext_status != 200 or ("journal-pointer/manifest.json" in _ext_names
                              and _ext_headers.get("Content-Type", "").startswith("application/zip")),
       json.loads(get("/api/about")[2])["extension"] == (_ext_status == 200)),
      (True, True, True))

# ─────────────────────────────────────────────────────────────── what is happening on an environment
status, _, body = get("/api/env/alpha/activity")
activity = json.loads(body)
check("activity lists the latest journal events, newest first, and no agent when no session works it",
      (status, any(e["text"] == "Started work" for e in activity["events"]), activity["agent"]),
      (200, True, None))

# ─────────────────────────────────────────────────────────────── a question with a description and options
status, got = post("/api/env/alpha/questions", {"text": "Which colour?", "description": "The button needs one.",
                                                "options": ["blue", "green", " blue "]})
check("a question keeps its description and its options, each once",
      (status, got["data"]["description"], [o["label"] for o in got["data"]["options"]]), (201, "The button needs one.", ["blue", "green"]))
n_q = got["data"]["n"]
status, got = post(f"/api/env/alpha/questions/{n_q}/answer", {"answer": "green"})
check("choosing an option answers with it", (status, got["data"]["answer"]), (200, "green"))

# ─────────────────────────────────────────────────────────────── tools, through their controller
status, got = post("/api/tools", {"name": "report", "title": "Write the report", "summary": "prints the weekly report"})
check("store: a tool from the browser", (status, [t["name"] for t in json.loads(get("/api/tools")[2])]), (201, ["report"]))
status, got = post("/api/tools", {"name": "untitled", "title": "No summary"})
check("a tool without a summary is refused", status, 400)
status, got = post("/api/tools/1", {"summary": "  "}, method="PATCH")
check("and its summary cannot be blanked", status, 400)
status, got = post("/api/tools/1", {"usage": "journal tools run report"}, method="PATCH")
check("its usage can be set", (status, json.loads(get("/api/tools/1")[2])["usage"]), (200, "journal tools run report"))
status, got = post("/api/tools/1", {"why": "not needed"}, method="DELETE")
check("destroy retires it", (status, json.loads(get("/api/tools")[2])), (200, []))

# ─────────────────────────────────────────────────────────────── search, through its controller
status, _, body = get("/api/env/alpha/search?term=do%20the%20thing")
found = json.loads(body)
check("search finds the journal's own resources on that environment",
      (status, [(r["kind"], r["n"]) for r in found["resources"]], found["total"]), (200, [("todo", 1)], 0))
status, _, body = get("/api/env/alpha/search?term=")
check("a search without a term is refused", status, 400)

# ─────────────────────────────────────────────────────────────── an environment's settings, through its controller
tracks.create(root, "gamma", at=AT)
status, _, body = get("/api/env/gamma/environment")
check("an environment's settings: auto is off by default", (status, json.loads(body)["auto"]), (200, False))
# ONE SWITCH, AND IT IS THE JOURNAL'S: the environment route no longer takes it (plan 5, phase 3)
status, got = post("/api/env/gamma/environment/settings", {"auto": True})
check("an environment's settings refuse auto, naming where it lives",
      (status, "journal" in got.get("error", "")), (400, True))
status, got = post("/api/journal/settings", {"auto": True})
check("auto mode is switched on from the browser, for the whole journal",
      (status, todo.auto(root), json.loads(get("/api/journal")[2])["auto"]), (200, True, True))
status, got = post("/api/journal/settings", {})
check("with nothing to change it says so", status, 400)
status, got = post("/api/env/gamma/environment/remove", {"confirm": "not-gamma"})
check("removing wants the environment's name typed", (status, "gamma" in tracks._all(root)), (400, True))
status, got = post("/api/env/gamma/environment/remove", {"confirm": "gamma"})
check("with the name typed, it is removed", (status, "gamma" in tracks._all(root)), (200, False))

# ─────────────────────────────────────────────────────────────── work, through its controller
status, got = post("/api/env/beta/work", {"subject": "something started in the browser"})
check("store opens work on beta", (status, [w["subject"] for w in work.open_work(root, track="beta")]),
      (201, ["something started in the browser"]))
status, _, body = get("/api/env/beta/work")
beta_work = json.loads(body)
check("index lists open work with its number", [(w["n"], w["subject"]) for w in beta_work], [(1, "something started in the browser")])
status, got = post("/api/env/beta/work/1", {"text": "got halfway"}, method="PATCH")
check("update files a note on it", (status, [n["text"] for n in work._all(root, "beta")[0]["notes"]]), (200, ["got halfway"]))
status, got = post("/api/env/beta/work/1", {}, method="DELETE")
check("destroy ends it", (status, bool(work._all(root, "beta")[0]["ended"])), (200, True))
check("an Updated work line in Activity shows the note that was filed",
      [e["title"] for e in json.loads(get("/api/env/beta/activity")[2])["events"] if e["text"] == "Updated work"], ["got halfway"])
status, got = post("/api/env/beta/work/1", {"text": "more"}, method="PATCH")
check("ended work refuses a change", status, 400)

# ─────────────────────────────────────────────────────────────── pins and rules, through their controllers
status, got = post("/api/env/alpha/pins", {"fact": "a pin written in the browser", "body": "because the page can"})
check("store: 201, numbered on alpha, its reasoning kept",
      (status, got["data"]["n"], pins.body(root, 3, track="alpha").strip()), (201, 3, "because the page can"))
status, got = post("/api/env/alpha/pins/3", {"fact": "a pin rewritten in the browser"}, method="PATCH")
check("changing the fact strikes the old pin and adds the new one under a new number",
      (status, got["data"]["n"], [(q["fact"], bool(q["struck"])) for q in pins._all(root, pins.KEY, "alpha")][2:]),
      (200, 4, [("a pin written in the browser", True), ("a pin rewritten in the browser", False)]))
status, got = post("/api/env/alpha/pins/3", {"body": "more"}, method="PATCH")
check("a struck pin refuses a change", status, 400)
status, got = post("/api/env/alpha/pins/4", {"why": "no longer true"}, method="DELETE")
check("destroy strikes it with the reason", (status, pins._all(root, pins.KEY, "alpha")[3]["struck"]), (200, "no longer true"))
status, _, body = get("/api/env/alpha/pins/4")
check("a struck pin's page says why", (status, json.loads(body)["struck_why"]), (200, "no longer true"))
status, got = post("/api/env/alpha/pins/1/move", {"environment": "beta"})
check("move carries a pin to another environment", (status, pins._all(root, pins.KEY, "beta")[-1]["fact"]), (200, "a pin on alpha"))
status, got = post("/api/rules", {"fact": "a rule written in the browser"})
check("a rule is project-wide: stored at /api/rules", (status, pins._all(root, pins.RULES)[-1]["fact"]),
      (201, "a rule written in the browser"))
status, got = post("/api/env/alpha/rules", {"fact": "x"})
check("a rule is not written under an environment", status, 405)
status, _, body = get("/api/env/alpha/rules")
check("nor read under one", status, 404)

# ─────────────────────────────────────────────────────────────── docs, through their controller
status, got = post("/api/docs", {"title": "a note written in the browser", "abstract": "what it settles"})
check("store at /api/docs writes a project doc",
      (status, [d["title"] for d in json.loads(get("/api/docs")[2])][:1]), (201, ["a note written in the browser"]))
status, got = post("/api/env/alpha/docs/1/part", {"title": "a part from the browser", "body": "its text"})
check("a part is added to a doc",
      (status, [x["title"] for x in json.loads(get("/api/docs/1")[2])["parts"]][-1]), (201, "a part from the browser"))
_new_part = json.loads(get("/api/docs/1")[2])["parts"][-1]["p"]
status, got = post(f"/api/docs/1.{_new_part}", {"body": "its text, rewritten in the browser"}, method="PATCH")
status, got = post("/api/docs/1/final", {})
_final_status = json.loads(get("/api/docs/1")[2])["status"]
status2, got = post("/api/docs/1/draft", {})
check("a doc is marked final and back to a draft from the viewer, each in one request",
      (status, _final_status, status2, json.loads(get("/api/docs/1")[2])["status"]), (200, "final", 200, "draft"))
check("a part's text is replaced from the viewer by its doc.part number",
      (status, [x["body"].strip() for x in json.loads(get("/api/docs/1")[2])["parts"] if x["p"] == _new_part]),
      (200, ["its text, rewritten in the browser"]))
status, got = post("/api/docs/1", {"abstract": "a sharper abstract"}, method="PATCH")
check("update changes the abstract", (status, json.loads(get("/api/docs/1")[2])["abstract"]), (200, "a sharper abstract"))
status, got = post("/api/docs/1/attach", {"path": "/etc/hosts"})
check("attaching a file from the browser is refused", status, 400)
status, got = post("/api/docs/search", {"term": "part body text", "all": True})
check("search finds the line", (status, len(got["data"]) >= 1), (200, True))
status, _, body = get("/api/docs/99")
check("an unknown doc is 404", status, 404)

import commands  # noqa: E402
parsed, _ = commands.REGISTRY.parse(["reminders", "done", "3", "it", "came", "true"])
import controllers  # noqa: E402
kind = controllers.CONTROLLERS["reminders"].payload_for("destroy")
got = parsed.payload(kind)
check("a parsed CLI command builds the typed payload its action takes, as an HTTP request does",
      (type(got).__name__, got.id, got.why, got.source, serve.Request("alpha", "3", {"why": "it came true"}).payload(kind).why),
      ("WhyPayload", 3, "it came true", "cli", "it came true"))
import controller  # noqa: E402
check("both are payload sources", (isinstance(parsed, controller.PayloadSource),
                                   isinstance(serve.Request("alpha", "1", {}), controller.PayloadSource)), (True, True))

status, got = post("/api/env/alpha/comments", {"about": "todo 1", "text": "split this"})
check("a comment is posted from the viewer", status, 201)
status, _, body = get("/api/env/alpha/comments?about=todo%3A1&all=1")
check("and listed by what it is about", [c["text"] for c in json.loads(body)], ["split this"])
status, got = post("/api/env/alpha/comments", {"about": "todo 99", "text": "x"})
check("a comment on nothing is refused", status, 400)
status, got = post("/api/env/alpha/comments/1/done", {"how": "split into two"})
check("and handled through the same route", (status, got.get("message", "").endswith("split into two")), (200, True))

import base64  # noqa: E402
status, got = post("/api/env/alpha/messages", {"text": "with a file", "files": [{"name": "../a.txt", "data": base64.b64encode(b"hello").decode()}]})
_held_n = (got.get("data") or {}).get("n")
check("a message is posted with a file, its name made safe", (status, [f["name"] for f in (got.get("data") or {}).get("files", [])]),
      (201, ["a.txt"]))
status, _, body = get(f"/api/env/alpha/messages")
status, headers, body = get(f"/message-files/alpha/{_held_n}/a.txt")
check("the held file is served by name", (status, body), (200, b"hello"))
status, _, _ = get(f"/message-files/alpha/{_held_n}/other.txt")
check("a name the message does not hold is 404", status, 404)
# A REPLY'S FILE IS THE MESSAGE'S FILE: same folder, and the reply records only the names it added.
status, got = post(f"/api/env/alpha/messages/{_held_n}/reply",
                   {"text": "and the screenshot", "files": [{"name": "shot.txt", "data": base64.b64encode(b"look").decode()}]})
check("a reply is posted with a file", status, 200)
status, _, body = get(f"/message-files/alpha/{_held_n}/shot.txt")
check("and that file is served from the message it was replied under", (status, body), (200, b"look"))
# A TRANSCRIPT IS REACHED FROM ITS MESSAGE, never from a list: nothing catalogues it, so the route
# is the only way in, and a message that carries none says so rather than serving an empty file.
status, got = post("/api/env/alpha/messages", {"text": "Jesse: the loader double-fetches. Sam: fix it.", "kind": "transcript"})
_tr_msg = len(inbox._all(root, "alpha"))
check("a transcript sent from the viewer says it has one on its row", (status, got["data"]["transcript"]), (201, True))
status, headers, body = get(f"/transcripts/alpha/{_tr_msg}")
check("and it is served as markdown, the transcript itself",
      (status, b"the loader double-fetches" in body), (200, True))
status, _, _ = get(f"/transcripts/alpha/{_held_n}")
check("a message carrying no transcript is 404", status, 404)
status, got = post("/api/env/alpha/messages", {"text": "big", "files": [{"name": "b.bin", "data": base64.b64encode(b"x" * 100_000).decode()}]})
check("a message may carry more than the ordinary body limit", status, 201)

status, got = post(f"/api/env/alpha/messages/{_held_n}", {"why": "not needed"}, method="DELETE")
check("a message is archived from the viewer", status, 200)
status, _, body = get("/api/env/alpha/messages")
check("it leaves the default list", _held_n in [m["n"] for m in json.loads(body)], False)
status, _, body = get("/api/env/alpha/messages?all=1")
check("and all=1 brings it back, marked archived", [m["status"] for m in json.loads(body) if m["n"] == _held_n], ["archived"])
status, got = post("/api/docs/1/archive", {"why": "done with it"})
check("a doc is archived from the viewer", status, 200)
status, _, body = get("/api/env/alpha/docs")
check("it leaves the doc list", 1 in [d["n"] for d in json.loads(body)], False)
status, _, body = get("/api/env/alpha/docs?archived=1")
check("archived=1 lists it, marked", [d["archived"] for d in json.loads(body) if d["n"] == 1], ["done with it"])

status, headers, body = get("/app.js")
_etag = headers.get("ETag") or headers.get("Etag") or ""
check("app.js carries a fingerprint and still revalidates", (status, bool(_etag), headers.get("Cache-Control")), (200, True, "no-cache"))
_req = urllib.request.Request(BASE + "/app.js", headers={"If-None-Match": _etag})
try:
    with urllib.request.urlopen(_req, timeout=10) as r:
        _cond = (r.status, len(r.read()))
except urllib.error.HTTPError as e:
    _cond = (e.code, len(e.read()))
check("an unchanged app.js is answered 304 with no body", _cond, (304, 0))
_req = urllib.request.Request(BASE + "/app.js", headers={"If-None-Match": '"stale"'})
with urllib.request.urlopen(_req, timeout=10) as r:
    check("a changed one is sent in full", (r.status, len(r.read()) > 1000), (200, True))

status, got = post("/api/env/alpha/notifications", {"text": "the long run finished", "about": "todo 1"})
check("a notification is sent through the API", status, 201)
status, _, body = get("/api/overview")
check("the overview counts the unread ones", [e["notifications"] for e in json.loads(body)["environments"] if e["name"] == "alpha"], [1])
status, got = post("/api/env/alpha/notifications/1/read", {})
check("the viewer marks one read", status, 200)
status, _, body = get("/api/env/alpha/notifications")
check("a read one leaves the default list", json.loads(body), [])
post("/api/env/alpha/notifications", {"text": "a"}); post("/api/env/alpha/notifications", {"text": "b"})
status, got = post("/api/env/alpha/notifications/readall", {})
check("mark all read", (status, got.get("message", "").startswith("2 notification")), (200, True))

status, got = post("/api/env/alpha/environment/settings", {"reports_archive_days": 7})
check("the Settings page sets how long reports stay listed", status, 200)
status, _, body = get("/api/env/alpha/environment")
check("and reads it back", json.loads(body).get("reports_archive_days"), 7)
status, got = post("/api/env/alpha/environment/settings", {"reports_archive_days": -1})
check("a negative number is refused", status, 400)
status, got = post("/api/env/alpha/environment/settings", {"todos_archive_days": 14})
status2, _, body = get("/api/env/alpha/environment")
check("the Settings page sets how long done to-dos stay listed, and reads it back",
      (status, json.loads(body).get("todos_archive_days")), (200, 14))
status, _, body = get("/api/env/alpha/environment")
check("Activity shows 50 lines and keeps 250 by default",
      (json.loads(body)["activity_show"], json.loads(body)["activity_keep"]), (50, 250))
status, got = post("/api/env/alpha/environment/settings", {"activity_show": 3, "activity_keep": 400})
_, _, body = get("/api/env/alpha/activity")
check("Settings changes how many lines Activity shows", (status, len(json.loads(body)["events"]) <= 3), (200, True))
status, got = post("/api/env/alpha/environment/settings", {"activity_show": 0})
check("showing no lines is refused", status, 400)
post("/api/env/alpha/environment/settings", {"activity_show": 50, "activity_keep": 250})

status, _, body = get("/api/env/alpha/activity")
_work_events = [e for e in json.loads(body)["events"] if e["kind"] == "work"]
check("a work event says which work it is about, so its row can open it",
      (status, bool(_work_events), all(isinstance(e["n"], int) and e["n"] >= 1 for e in _work_events)), (200, True, True))
_events = json.loads(body)["events"]
check("every activity event says who did it and stays within 100 characters",
      (all(e["by"] in ("Agent", "You") for e in _events), all(len(e["text"]) <= 100 for e in _events),
       {e["by"] for e in _work_events}), (True, True, {"Agent"}))
import todo as _todo, work as _work  # noqa: E402
_todo.add(root, "alpha", "link me to my work", "", "2026-09-14T00:00:00+00:00")
_tn = max(t["n"] for t in _todo._all(root, "alpha"))
_todo._update(root, "alpha", _tn, doc="1")
_was_track = list(state._TRACK)
state.use_track("alpha")
_work.start(root, "link me to my work", "2026-09-14T00:00:01+00:00")
state._TRACK[:] = _was_track
status, _, body = get("/api/env/alpha/work?all=1")
check("a work item names the to-do of its title and that to-do's document",
      [(w["todo"], w["doc"]) for w in json.loads(body) if w["subject"] == "link me to my work"], [(_tn, "1")])
import commandlog  # noqa: E402
import commands as _commands  # noqa: E402
for _argv in (["messages", "list"], ["todos", "show", "3"], ["todos", "done", "3", "x"], ["statusline"]):
    commandlog.record(root, "alpha", _commands.REGISTRY.parse(_argv)[0], "2099-01-01T00:00:00+00:00")
check("a command the agent runs is logged in plain words; writes Activity already shows and the status line are not",
      [e["text"] for e in commandlog.entries(root, "alpha") if e.get("by") != "You"], ["Reading messages", "Reading to-do"])
status, _, body = get("/api/env/alpha/activity")
check("and Activity lists it as the agent's, naming the resource and its number apart from the wording",
      {(e["kind"], e["n"], e["by"]) for e in json.loads(body)["events"] if e["text"] in ("Reading to-do", "Reading messages")},
      {("todo", 3, "Agent"), ("message", None, "Agent")})
state.put_tracked(root, "activity", "alpha",
                  commandlog.entries(root, "alpha") + [{"at": "2098-12-31T00:00:00+00:00", "text": "Reading your messages"}])
check("a line logged with the old wording reads the new one, and still opens the messages",
      [(e["text"], e.get("kind")) for e in commandlog.entries(root, "alpha") if e["at"] == "2098-12-31T00:00:00+00:00"],
      [("Reading messages", "message")])
check("a line that only reads something does not repeat its title",
      [e["title"] for e in json.loads(body)["events"] if e["text"] == "Reading to-do"], [""])
_events_now = json.loads(body)["events"]
check("a line marks whether it waits on the user: an answered question is marked answered, nothing else unexpected",
      ({e["needs"] for e in _events_now} <= {"", "open", "answered"},
       all(e["needs"] == "answered" for e in _events_now if e["text"] == "Answered question"),
       all(e["needs"] == "" for e in _events_now if e["kind"] not in ("question", "suggestion"))), (True, True, True))
check("a line that introduces something shows its title",
      [e["title"] for e in json.loads(body)["events"] if e["text"] == "Added to-do" and e["n"] == _tn], ["link me to my work"])
state.put_tracked(root, "activity", "alpha",
                  commandlog.entries(root, "alpha") + [{"at": "2099-01-01T00:00:01+00:00", "text": "Filing message 7"},
                                                       {"at": "2099-01-01T00:00:02+00:00", "text": "Reading reports"}])
check("a line logged with its number in the wording is read back as wording, kind and number",
      [(e["text"], e.get("kind"), e.get("n")) for e in commandlog.entries(root, "alpha") if e.get("n") == 7 or e["text"] == "Reading reports"],
      [("Filing message", "message", 7), ("Reading reports", "report", None)])
state.put_tracked(root, "activity", "alpha",
                  commandlog.entries(root, "alpha") + [{"at": "2099-01-01T00:00:03+00:00", "text": "Reading question 9", "kind": "question", "n": 9}])
check("a line that already names its resource but still has the number in its wording shows the wording alone",
      [(e["text"], e["n"]) for e in commandlog.entries(root, "alpha") if e.get("kind") == "question" and e.get("n") == 9], [("Reading question", 9)])
state.put_tracked(root, "activity", "alpha",
                  commandlog.entries(root, "alpha") + [{"at": "2099-01-01T00:00:04+00:00", "text": "Reading report", "kind": "report", "n": 5},
                                                       {"at": "2099-01-01T00:00:05+00:00", "text": "Reading report", "kind": "report", "n": 5}])
_, _, body = get("/api/env/alpha/activity")
import comments as _comments  # noqa: E402
_comments.add(root, "todo:1", "check the colour first", "2099-01-02T00:00:00+00:00", source="web", track="alpha")
_, _, body = get("/api/env/alpha/activity")
status, got = post("/api/env/alpha/todos", {"title": "an urgent thing to fix", "priority": "high"})
_, _, body = get("/api/env/alpha/todos")
check("a to-do created with a priority keeps it",
      (status in (200, 201), [t["priority"] for t in json.loads(body) if t["title"] == "an urgent thing to fix"]), (True, [150]))
import questions as _questions  # noqa: E402
_questions.add(root, "which shade of blue?", "2099-01-03T00:00:00+00:00", track="alpha")
_answered_q = len(_questions._all(root, "alpha"))
_questions.answer(root, _answered_q, "navy", "2099-01-03T00:01:00+00:00", track="alpha")
_questions.add(root, "which font size?", "2099-01-03T00:02:00+00:00", track="alpha")
_open_q = len(_questions._all(root, "alpha"))
_, _, body = get("/api/env/alpha/activity")
_asked = {e["n"]: (e["needs"], e["detail"]) for e in json.loads(body)["events"] if e["text"] == "Asked question"}
check("an answered question's Asked line says answered and is no longer an open card; an open one still is",
      (_asked.get(_answered_q), _asked.get(_open_q)), (("answered", "answered"), ("open", "")))
check("a comment written in the viewer is an Activity line by you, titled with its text, opening what it is about",
      [(e["text"], e["by"], e["title"], e["about"]) for e in json.loads(body)["events"] if e["kind"] == "comment"][:1],
      [("Wrote comment", "You", "check the colour first", "todo:1")])
commandlog.record(root, "alpha", _commands.REGISTRY.parse(["comments", "show", "1"])[0], "2099-01-02T00:00:01+00:00")
_read_comment = [(e["text"], e["n"], e["detail"], e["about"]) for e in json.loads(get("/api/env/alpha/activity")[2])["events"]
                 if e["text"] == "Reading comment"]
check("reading one comment names what it is on, and opens it", _read_comment[:1], [("Reading comment", 1, "to-do 1", "todo:1")])
_row_1 = lambda: [(t["questions_open"], t["questions_answered"]) for t in json.loads(get("/api/env/alpha/todos?all=1")[2]) if t["n"] == 1][0]  # noqa: E731
_open0, _answered0 = _row_1()
# dated early, so these lines do not crowd the newest Activity lines later checks read
_questions.add(root, "is to-do 1 still wanted?", "2000-01-02T00:00:02+00:00", about_refs=["todo:1"], track="alpha")
_q_on_1 = len(_questions._all(root, "alpha"))
check("a to-do row counts the questions linked to it: one more open", _row_1(), (_open0 + 1, _answered0))
_questions.answer(root, _q_on_1, "yes", "2000-01-02T00:00:03+00:00", track="alpha")
check("and once it is answered, it counts as answered, not open", _row_1(), (_open0, _answered0 + 1))
check("the same line twice in a row shows once",
      len([e for e in json.loads(body)["events"] if e["kind"] == "report" and e["n"] == 5]), 1)
_undescribed = sorted({f"{c.noun}:{c.verb}" for group in _commands.REGISTRY._commands.values() for c in group
                       if c.noun not in commandlog.SKIP and f"{c.noun}:{c.verb}" not in commandlog.SHOWN | commandlog.HOOKS
                       and f"{c.noun}:{c.verb}" not in commandlog.DESCRIBE and f"{c.noun}:" not in commandlog.DESCRIBE})
check("every registered command has a plain Activity line, or a reason it is not logged", _undescribed, [])
import controllers as _controllers  # noqa: E402
_web_undescribed = sorted(f"{c.resource}:{a}" for c in _controllers.CONTROLLERS.values() for a in c.actions
                          if a not in commandlog.READS and f"{c.resource}:{a}" not in set(commandlog.WEB) | commandlog.WEB_SHOWN | commandlog.WEB_QUIET)
check("every write the viewer can make has a plain Activity line, or a reason it is not logged", _web_undescribed, [])
_urgent = [t["n"] for t in json.loads(get("/api/env/alpha/todos")[2]) if t["title"] == "an urgent thing to fix"][0]
post(f"/api/env/alpha/todos/{_urgent}", {"priority": "low"}, method="PATCH")
post(f"/api/env/alpha/todos/{_urgent}", {"title": "an urgent thing to fix now"}, method="PATCH")
_mine = [(e["text"], e["n"], e["detail"], e["by"]) for e in json.loads(get("/api/env/alpha/activity")[2])["events"]
         if e["kind"] == "todo" and e["n"] == _urgent and e["by"] == "You"]
check("a change made in the viewer is an Activity line by you, naming what changed",
      (("Changed to-do priority", _urgent, "low", "You") in _mine, ("Edited to-do", _urgent, "", "You") in _mine), (True, True))
for _i, _value in enumerate(("150", "100", "120")):
    commandlog.record_web(root, "alpha", "todos", "update", "900", {"priority": _value}, f"2099-01-04T00:00:0{_i}+00:00")
for _body, _want in (({"activity_show": 80}, "Activity shows the last 80 line(s)"),
                     ({"reports_archive_days": 0}, "Reports stay listed until archived by hand"),
                     ({"todos_archive_days": 5}, "Done to-dos stay listed for 5 day(s)")):
    commandlog.record_web(root, "alpha", "environment", "settings", None, _body, "2099-01-05T00:00:00+00:00")
    check(f"a settings change in the viewer names what changed: {_want}", commandlog.entries(root, "alpha")[-1]["text"], _want)
# auto is the journal's switch, so its line comes from the journal's own settings, not an environment's
for _body, _want in (({"auto": True}, "Turned auto mode on for the journal"),
                     ({"auto": False}, "Turned auto mode off for the journal")):
    commandlog.record_web(root, "alpha", "journal", "settings", None, _body, "2099-01-05T00:00:00+00:00")
    check(f"the journal's settings name what changed: {_want}", commandlog.entries(root, "alpha")[-1]["text"], _want)
commandlog.record_web(root, "alpha", "journal", "auto", None, {"state": "disable"}, "2099-01-05T00:00:01+00:00")
check("switching auto mode from the viewer says which way", commandlog.entries(root, "alpha")[-1]["text"], "Turned auto mode off")
_tool_stem = "toolqueue-session"
# fewer than a batch: still queued, nothing written
for _tool in ("Bash", "Edit"):
    commandlog.queue_tool(root, "alpha", _tool_stem, _tool, "2000-01-05T00:00:00+00:00")
check("tool uses are queued, not written one by one",
      [e for e in commandlog.entries(root, "alpha") if e["at"] == "2000-01-05T00:00:00+00:00"], [])
commandlog.flush_tools(root, "alpha", _tool_stem, "2000-01-05T00:00:01+00:00")
check("a flush writes the queue as one plain line by the agent, and empties it",
      ([(e["text"], e["by"], e["n"]) for e in commandlog.entries(root, "alpha") if e["at"] == "2000-01-05T00:00:01+00:00"],
       state.get(root, commandlog.QUEUE, None, stem=_tool_stem)),
      ([("Ran 1 command, edited 1 file", "Agent", None)], {}))
for _i in range(commandlog.QUEUE_SIZE):
    commandlog.queue_tool(root, "alpha", _tool_stem, "Read", "2000-01-05T00:00:02+00:00")
check("the use that fills a batch writes the line by itself",
      [e["text"] for e in commandlog.entries(root, "alpha") if e["at"] == "2000-01-05T00:00:02+00:00"],
      [f"Read {commandlog.QUEUE_SIZE} files"])
from datetime import datetime as _dt, timezone as _tz  # noqa: E402
commandlog.queue_tool(root, "alpha", _tool_stem, "Bash", "2000-01-05T00:00:03+00:00")
commandlog.flush_stale(root, "alpha", now=_dt(2000, 1, 5, 0, 0, 10, tzinfo=_tz.utc))
check("a queued tool use waits while its session may still be working",
      state.get(root, commandlog.QUEUE, None, stem=_tool_stem), {"ran": 1})
commandlog.flush_stale(root, "beta")
check("opening another environment's Activity leaves it queued", state.get(root, commandlog.QUEUE, None, stem=_tool_stem), {"ran": 1})
get("/api/env/alpha/activity")
check("after a minute with no tool use, opening Activity writes the line, at the time of the last tool use",
      ([e["text"] for e in commandlog.entries(root, "alpha") if e["at"] == "2000-01-05T00:00:03+00:00"],
       state.get(root, commandlog.QUEUE, None, stem=_tool_stem)), (["Ran 1 command"], {}))
# ------------------------------------------- the command the agent is running, and the last one
# THE LAST COMMAND STAYS UP between calls, and its clock stops when it stops: the line would
# otherwise be empty most of the time, since a command is over long before the next poll.
from controllers import activity as _activity  # noqa: E402
import work as _swork  # noqa: E402
_run_stem = "running-session"
import tracks as _rtracks  # noqa: E402
_run_env = _rtracks.current(root, _run_stem) or "alpha"
state.use_track(_run_env)
_run_began = _dt.fromtimestamp(time.time() - 600, _tz.utc).isoformat(timespec="seconds")
_swork.start(root, "read the bar back", _run_began)
state.put(root, "running_command", {"what": "python3 test_serve.py", "at": time.time() - 9}, stem=_run_stem)
check("a command in flight is reported with how long it has been running",
      (lambda got: (got["what"], got["seconds"] >= 9, got.get("done")))(_activity.running_now(root, _run_stem)),
      ("python3 test_serve.py", True, None))
state.put(root, "running_command", {"what": "npm run build", "at": time.time() - 40, "took": 12.4,
                                    "ended": time.time()}, stem=_run_stem)
check("a command that has finished keeps its line, marked done so the clock stops",
      _activity.running_now(root, _run_stem), {"what": "npm run build", "seconds": 12, "done": True})
state.put(root, "running_command", {"what": "npm run build", "at": time.time() - 40, "took": 12.4,
                                    "ended": time.time() - _activity.QUIET_AFTER - 1}, stem=_run_stem)
check("and after a few quiet seconds with nothing else run, it is gone",
      _activity.running_now(root, _run_stem), None)
state.put(root, "running_command", {"what": "an older command", "at": time.time() - 99999}, stem=_run_stem)
check("a command from before this work was declared belongs to the work before it, so it is gone",
      _activity.running_now(root, _run_stem), None)
_swork.end(root, "read the bar back", _run_began)
state.put(root, "running_command", None, stem=_run_stem)
check("and nothing recorded is nothing shown", _activity.running_now(root, _run_stem), None)
# THE SHELLS THE AGENT LEFT RUNNING. The hook records the command and when it went to the background;
# the harness writes its output into one file per shell, and pairing them by time is what makes
# "still going" answerable. With no such directory the answer is an empty list, never a guess.
import controllers.activity as _act  # noqa: E402
state.put(root, "background_shells", [{"what": "python3 test_serve.py", "at": time.time()}], stem=_run_stem)
_shells = _act.shells_now(root, _run_stem)
check("a background shell is listed with what it ran, and reported over when nothing says otherwise",
      [(x["what"], x["done"], x["seconds"] < 5) for x in _shells],
      [("python3 test_serve.py", True, True)])
state.put(root, "background_shells", [], stem=_run_stem)
check("and nothing recorded is an empty list, not a guess", _act.shells_now(root, _run_stem), [])
# WHETHER THE SESSION HAS A CHANNEL. The channel server stamps its session every poll; a stamp gone
# quiet means plain `claude` started it and nothing written in the viewer reaches it while idle.
state.put(root, "channel_seen", int(time.time()), stem=_run_stem)
check("a session the channel stamped just now has a channel", _act.channel_now(root, _run_stem), True)
state.put(root, "channel_seen", int(time.time()) - 120, stem=_run_stem)
state.put(root, "started_at", int(time.time()), stem=_run_stem)
check("a session too young to have been polled is not judged yet", _act.channel_now(root, _run_stem), None)
state.put(root, "started_at", int(time.time()) - 120, stem=_run_stem)
check("an older session with no stamp has no channel", _act.channel_now(root, _run_stem), False)

# HOW OFTEN THE SESSION HAS BEEN COMPACTED is counted at every session start from the transcript's
# own boundaries, so the bar can say why the agent may not remember an hour ago.
state.put(root, "compactions", 3, stem=_run_stem)
check("the count of compactions is read back per session", state.get(root, "compactions", 0, stem=_run_stem), 3)

commandlog.queue_tool(root, "alpha", _tool_stem, "Bash", "2099-01-06T00:00:00+00:00")
commandlog.flush_tools(root, "alpha", _tool_stem, "2099-01-06T00:00:00+00:00")
for _argv in (["messages", "waiting"], ["comments", "list"]):
    commandlog.record(root, "alpha", _commands.REGISTRY.parse(_argv)[0], "2099-01-06T00:00:00+00:00")
check("lines logged in the same second list newest first, and a tool summary sits under the command that ended it",
      [e["text"] for e in json.loads(get("/api/env/alpha/activity")[2])["events"] if e["at"] == "2099-01-06T00:00:00+00:00"],
      ["Reading comments", "Checking for new messages", "Ran 1 command"])
check("a priority that matches a named level shows the name; any other number shows as it is",
      [e["detail"] for e in commandlog.entries(root, "alpha") if e.get("n") == 900], ["high", "default", "120"])
commandlog.record(root, "alpha", _commands.REGISTRY.parse(["todos", "priority", "140", "high"])[0], "2099-01-01T00:00:06+00:00")
check("setting a priority names the to-do and the value",
      [(e["text"], e["n"], e["detail"]) for e in commandlog.entries(root, "alpha") if e.get("detail") == "high" and e.get("by") != "You"],
      [("Setting to-do priority", 140, "high")])
commandlog.record(root, "alpha", _commands.REGISTRY.parse(["work", "await", "the reviewer finishing"])[0], "2099-01-01T00:00:07+00:00")
check("waiting names what the agent waits on",
      [(e["text"], e["detail"]) for e in commandlog.entries(root, "alpha") if e["at"] == "2099-01-01T00:00:07+00:00"],
      [("Waiting on", "the reviewer finishing")])
_code = Path(tempfile.mkdtemp()) / ".journal"
(_code / "commands").mkdir(parents=True)
(_code / "serve.py").write_text("x = 1\n")
(_code / "commands" / "system.py").write_text("x = 1\n")
(_code / "notes.md").write_text("x\n")
_before_code = serve._snapshot(_code)
os.utime(_code / "notes.md", ns=(1, 1))
check("the viewer does not restart for a file that is not code", serve._snapshot(_code), _before_code)
os.utime(_code / "commands" / "system.py", ns=(2, 2))
check("it notices a change to the journal's Python, in a subfolder too",
      serve._snapshot(_code) != _before_code and str(_code / "commands" / "system.py") in _before_code, True)
_srv_code = serve._Server(("127.0.0.1", 0), _code, _code.parent)
threading.Thread(target=_srv_code.serve_forever, daemon=True).start()
_changed = threading.Event()
_old_watch, _old_settle = serve.WATCH_SECONDS, serve.SETTLE_SECONDS
serve.WATCH_SECONDS, serve.SETTLE_SECONDS = 0.05, 0.1
_watcher = threading.Thread(target=serve._watch_code, args=(_code, _srv_code, _changed), daemon=True)
_watcher.start()
import time as _time  # noqa: E402
_time.sleep(0.2)
os.utime(_code / "serve.py", ns=(3, 3))
_watcher.join(timeout=5)
serve.WATCH_SECONDS, serve.SETTLE_SECONDS = _old_watch, _old_settle
check("once the change settles, the watcher stops the server so it can restart", (_changed.is_set(), _watcher.is_alive()), (True, False))
_srv_code.server_close()
check("a viewer from before the self-restart, or one that does not say its version, must be restarted by hand",
      [serve.needs_restart(x) for x in ({"version": "1.131.62"}, {}, None, {"version": serve.SELF_RESTART_VERSION}, {"version": "1.140.0"})],
      [True, True, True, False, False])
check("this project's viewer on the current version is not flagged, so no notice is given",
      (serve.stale_viewer(root), serve.restart_notice(root)), (None, ""))
_beta_work = state.tracked(root, "work", "beta", [])
_sha = "abcdef1234567890abcdef1234567890abcdef12"
_beta_work[-1].setdefault("commits", []).append({"sha": _sha, "subject": "ship the thing", "at": "2026-09-14T10:00:00+00:00"})
state.put_tracked(root, "work", "beta", _beta_work)
_beta_n = len(_beta_work)
status, _, body = get(f"/api/env/beta/commits?sha={_sha[:7]}")
_commit = json.loads(body)
check("a commit is found by its short hash, with the work it was made during",
      (status, _commit["sha"], _commit["subject"], [w["n"] for w in _commit["work"]]), (200, _sha, "ship the thing", [_beta_n]))
check("and the work item lists the commit",
      [c["sha"] for c in json.loads(get(f"/api/env/beta/work/{_beta_n}")[2])["commits"]], [_sha])
check("a hash nobody committed is not found, and a word that is not a hash is refused",
      (get("/api/env/beta/commits?sha=0000000")[0], get("/api/env/beta/commits?sha=nothex")[0]), (404, 400))
import controllers.commits as _commits  # noqa: E402
check("a git remote becomes the repository's web address, over https or ssh, and anything else gives none",
      [_commits.repo_url(r) for r in ("https://github.com/o/r.git", "git@github.com:o/r.git", "ssh://git@gitlab.com/g/p.git", "not a remote")],
      ["https://github.com/o/r", "https://github.com/o/r", "https://gitlab.com/g/p", ""])
check("a commit git knows nothing about still has its page, without files, a link or a pull request",
      [(d["files"], d["url"], d["pull_request"], d["subject"]) for d in [json.loads(get(f"/api/env/beta/commits?sha={_sha[:7]}")[2])]],
      [([], "", None, "ship the thing")])

# ───────── a commit the journal never recorded is still read, from the repository itself ─────────
# THE JOURNAL IS NOT THE ONLY RECORD: Activity links every sha it logged, and a commit made
# between two pieces of work is on none of them. It exists, so the page shows it with nothing tied to it.
import subprocess as _sp  # noqa: E402
_proj = root.parent
for _cmd in (["git", "init", "-q"], ["git", "config", "user.email", "t@t"], ["git", "config", "user.name", "t"],
             ["git", "commit", "-q", "--allow-empty", "-m", "a commit nobody recorded"]):
    _sp.run(_cmd, cwd=str(_proj), capture_output=True, timeout=60)
_loose = _sp.run(["git", "rev-parse", "HEAD"], cwd=str(_proj), capture_output=True, text=True, timeout=60).stdout.strip()
status, _, body = get(f"/api/env/beta/commits?sha={_loose[:10]}")
_got = json.loads(body) if status == 200 else {}
check("a commit no work recorded is read from the repository, with nothing tied to it",
      (status, _got.get("subject"), _got.get("sha"), _got.get("work"), _got.get("todos")),
      (200, "a commit nobody recorded", _loose, [], []))
status, _, body = get("/api/env/beta/commits?sha=0000000")
check("a sha no repository knows is refused, and says that is what is missing",
      (status, "is in this repository" in json.loads(body).get("error", "")), (404, True))
status, _, body = get("/api/env/beta/commits?sha=nothex")
check("a sha that is not hex is refused, naming what was given",
      (status, "`nothex` is not a commit hash" in json.loads(body).get("error", "")), (400, True))
import transcript as _tx  # noqa: E402
_tl = [_tx.Line(1, "user", "human", "fix the build", "2026-09-14T10:00:00Z"),
       _tx.Line(2, "assistant", "text", "", "2026-09-14T10:00:05Z", tools=["Bash"]),
       _tx.Line(3, "user", "tool_result", "ok", "2026-09-14T10:00:06Z"),
       _tx.Line(4, "assistant", "text", "Running the tests", "2026-09-14T10:00:10Z"),
       _tx.Line(5, "assistant", "text", "", "2026-09-14T10:00:12Z", tools=["Bash"]),
       _tx.Line(6, "user", "tool_result", "12 passed", "2026-09-14T10:00:20Z"),
       _tx.Line(7, "user", "human", "thanks", "2026-09-14T10:30:00Z")]
_p1 = _tx.page(_tl, limit=3)
check("the transcript page opens at the newest lines, and says where the older ones start",
      ([r["n"] for r in _p1["lines"]], _p1["prev"], _p1["total"]), ([5, 6, 7], 5, 7))
check("the next load is the lines just before the oldest shown", [r["n"] for r in _tx.page(_tl, before=_p1["prev"], limit=3)["lines"]], [2, 3, 4])
_p3 = _tx.page(_tl, before=2, limit=3)
check("and at the start of the transcript there is nothing older to load", ([r["n"] for r in _p3["lines"]], _p3["prev"]), ([1], None))
_gappy = [_tx.Line(1, "user", "human", "go", "2026-09-14T10:00:00Z"),
          _tx.Line(2, "assistant", "text", "", "2026-09-14T10:00:01Z"),
          _tx.Line(3, "user", "tool_result", "", "2026-09-14T10:00:02Z"),
          _tx.Line(4, "assistant", "text", "", "2026-09-14T10:00:03Z", tools=["Bash"]),
          _tx.Line(5, "assistant", "text", "done", "2026-09-14T10:00:04Z")]
_pg = _tx.page(_gappy)
check("a line with neither text nor a tool is left out, the others keep their numbers, and the total counts what is shown",
      ([r["n"] for r in _pg["lines"]], _pg["total"]), ([1, 4, 5], 3))
import controllers.agent as _agc  # noqa: E402
check("an environment no session has worked on has no agent to show",
      _agc.AgentController._session(root, "zz-nobody-here", ""), None)
from payloads import agent as _agp  # noqa: E402
_built = _agp.AgentPayload.build("alpha", None, {"agent": "abc123de", "kind": "subagent", "transcript": "1", "before": "1000"}, "web")
check("the agent, its kind and where to read from reach the request, not the request's own id",
      (_built.agent, _built.kind, _built.transcript, _built.before), ("abc123de", "subagent", True, 1000))
_sess = "11111111-2222-3333-4444-555555555555"
_w_beta = state.tracked(root, "work", "beta", [])
_w_beta.append({"subject": "work opened by that session", "at": "2026-09-14T10:00:00+00:00", "ended": None, "session": _sess + ".jsonl"})
state.put_tracked(root, "work", "beta", _w_beta)
check("a session's page lists the work it opened, which records the transcript file rather than the bare id",
      [w["subject"] for w in _agc.AgentController._about(root, "beta", "session", _sess, None)["work"]], ["work opened by that session"])
(project / ".claude" / "skills" / "demo-skill").mkdir(parents=True, exist_ok=True)
(project / ".claude" / "skills" / "demo-skill" / "SKILL.md").write_text('---\nname: demo-skill\ndescription: "Use it for demos."\n---\n\n# Demo\n\nthe body\n')
_sk_tx = project / "skills-transcript.jsonl"
_sk_tx.write_text("\n".join(json.dumps({"type": "assistant", "timestamp": "2026-09-14T10:00:0%d+00:00" % i,
    "message": {"content": [{"type": "tool_use", "name": "Skill", "input": {"skill": name}}]}}) for i, name in enumerate(["demo-skill", "loop", "demo-skill"])) + "\n")
_sk_rows = {r["name"]: r for r in _agc.AgentController._about(root, "beta", "session", _sess, _sk_tx)["skills"]}
check("the agent page lists the project's skills and how often the session loaded each, from its transcript",
      (_sk_rows["demo-skill"]["source"], _sk_rows["demo-skill"]["loaded"], _sk_rows["demo-skill"]["readable"]), ("project", 2, True))
check("a skill it loaded that has no file here is listed as built in, and cannot be opened",
      (_sk_rows["loop"]["source"], _sk_rows["loop"]["loaded"], _sk_rows["loop"]["readable"]), ("built in", 1, False))
_sk_status, _, _sk_body = get("/api/skills/demo-skill")
check("a skill's text is read by name, read-only", (_sk_status, "the body" in json.loads(_sk_body).get("text", "")), (200, True))
# THE FILES BESIDE IT COME TOO: a skill that says "read references/x.md" is not read until x.md is on the screen
_sk_dir = project / ".claude" / "skills" / "demo-skill"
(_sk_dir / "references").mkdir(exist_ok=True)
(_sk_dir / "references" / "more.md").write_text("# More\n\nthe reference body\n")
(_sk_dir / "references" / "tool.py").write_text("print(1)\n")
_sk_refs = json.loads(get("/api/skills/demo-skill")[2])["references"]
check("a skill's references are listed by path, markdown with its text and code by name only",
      [(r["path"], r["text"] is not None) for r in _sk_refs], [("references/more.md", True), ("references/tool.py", False)])
check("a name that is not a skill on disk is not found, and a path is not a name",
      (get("/api/skills/nope")[0], get("/api/skills/..%2F..%2Fetc")[0]), (404, 404))
_st, _ = post("/api/env/alpha/environment/settings", {"always_load": "demo-skill", "always_on": True})
check("a skill can be set to load at every start, through the settings route",
      (_st, json.loads(get("/api/skills/demo-skill")[2])["always"]), (200, True))
_st, _ = post("/api/env/alpha/environment/settings", {"always_load": "demo-skill", "always_on": False})
check("and taken off again", (_st, json.loads(get("/api/skills/demo-skill")[2])["always"]), (200, False))
check("a skill that is not on disk cannot be set to load", post("/api/env/alpha/environment/settings", {"always_load": "nope"})[0] >= 400, True)
import agents as _agents  # noqa: E402
commandlog.record_dispatch(root, "alpha", "dispatch-stem", "  review   the diff ", "2099-01-01T00:00:08+00:00")
check("handing work to a subagent is its own Activity line, with the dispatcher's description",
      [(e["text"], e["detail"], e["by"]) for e in commandlog.entries(root, "alpha") if e["at"] == "2099-01-01T00:00:08+00:00"],
      [("Dispatched a subagent", "review the diff", "Agent")])
_agents.heartbeat(root, "alpha", "abc123def", "parentstem123")
_first_seen = _agents.seen(root)["alpha"]["abc123def"]
state.put(root, _agents.PARENT, {**state.get(root, _agents.PARENT, {}), "alpha": {"abc123def": "someone-else"}})
_agents.heartbeat(root, "alpha", "abc123def", "parentstem123")
check("a subagent's heartbeat is written at most once in a short while",
      (_agents.seen(root)["alpha"]["abc123def"], _agents.parent_of(root, "alpha", "abc123def")), (_first_seen, "someone-else"))
state.put(root, _agents.PARENT, {**state.get(root, _agents.PARENT, {}), "alpha": {"abc123def": "parentstem123"}})
_crew = [a for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"]
check("the agents list shows a live subagent, with the session that sent it",
      [(a["id"], a["parent"], a["working"]) for a in _crew], [("abc123de", "parentst", True)])
_agents.finish(root, "alpha", "abc123def")
check("a listed subagent carries its model, empty when its transcript has none",
      [("model" in a) for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"], [True])
check("a subagent that stopped is listed as finished, not working",
      [(a["working"], a["state"]) for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"], [(False, "finished")])
# A FINISHED SUBAGENT STAYS FOR A WHILE: it used to leave the list the instant it stopped, which is
# the moment the user turns to look at what it just did.
_done_row = [a for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"][0]
check("and it carries how long ago it finished, in words and in seconds",
      (_done_row["ended_age"].startswith("finished"), isinstance(_done_row["ended_secs"], int)), (True, True))
# an agent counts as finished only while its done stamp is at or after its last heartbeat, so an old
# finish means moving both: the heartbeat to 21 minutes ago, the finish to 20
state.put(root, _agents.SEEN, {"alpha": {"abc123def": int(time.time()) - 21 * 60}})
state.put(root, _agents.DONE, {"alpha": {"abc123def": int(time.time()) - 20 * 60}})
check("one that finished longer ago than crew_finished_minutes is gone",
      [a for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"], [])
state.put(root, _agents.DONE, {"alpha": {"abc123def": int(time.time())}})
check("and it is back while it is inside the window",
      [a["state"] for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"], ["finished"])
# AN UNFINISHED SUBAGENT IS NOT DROPPED FOR BEING QUIET: measured on the real record, an agent that
# never finished and had not called a tool for 47 minutes was invisible — the vanishing the user saw.
state.put(root, _agents.DONE, {"alpha": {}})
state.put(root, _agents.SEEN, {"alpha": {"abc123def": int(time.time()) - 47 * 60}})
_quiet = [a for a in json.loads(get("/api/env/alpha/agents")[2]) if a["kind"] == "subagent"]
check("one that never finished is still listed after the old 30-minute window, marked quiet",
      [(a["state"], a["working"], a["quiet"]) for a in _quiet], [("quiet", False, True)])
# the viewer cuts the home strip at an hour, so it needs the quiet age as a number, not as words
check("and it says how long it has been quiet, in seconds, so a page can cut on it",
      [a["quiet_secs"] > 45 * 60 for a in _quiet], [True])
state.put(root, _agents.SEEN, {"alpha": {"abc123def": int(time.time())}})
import install as _install  # noqa: E402
check("SubagentStop is wired, so a finished subagent is known the moment it stops", "SubagentStop" in _install.EVENTS, True)
import controllers.activity as _activity  # noqa: E402
check("a long activity text is cut at a word with an ellipsis",
      (len(_activity.short("word " * 40)) <= 100, _activity.short("word " * 40).endswith("word…")), (True, True))
for _event, _want in (("PreToolUse", True), ("PostToolUse", True), ("UserPromptSubmit", True), ("Stop", False)):
    state.put(root, "last_event", _event, stem="presence-session")
    check(f"an agent whose last hook event is {_event} reads as {'working' if _want else 'idle'}",
          _activity.agent_working(root, "presence-session"), _want)
check("an agent with no hook event on record does not read as working", _activity.agent_working(root, "no-such-session"), False)
state.put(root, "last_event", "PreCompact", stem="presence-session")
check("an agent whose last hook event is PreCompact reads as compacting, and still as working",
      (_activity.agent_compacting(root, "presence-session"), _activity.agent_working(root, "presence-session")), (True, True))
state.put(root, "last_event", "SessionStart", stem="presence-session")
check("the SessionStart after a compaction ends it", _activity.agent_compacting(root, "presence-session"), False)
import ast as _ast  # noqa: E402
_handlers = next(n.value for n in _ast.parse((SRC / "hook.py").read_text()).body
                 if isinstance(n, _ast.Assign) and getattr(n.targets[0], "id", "") == "HANDLERS")
check("PreCompact is wired and handled, so the viewer can show an agent compacting",
      ("PreCompact" in _install.EVENTS, "PreCompact" in [k.value for k in _handlers.keys]), (True, True))
check("Activity says whether auto mode is on, for the footer's switch",
      isinstance(json.loads(get("/api/env/alpha/activity")[2]).get("auto"), bool), True)
status, headers, body = get("/help/pins.md")
check("a resource page's help is served as Markdown from static/help", (status, body.startswith(b"# ")), (200, True))
check("a help page that does not exist, or a path outside static/help, is not served",
      (get("/help/nothing.md")[0], get("/help/..%2Fapp.js")[0]), (404, 404))
import re  # noqa: E402
_topics = set(re.findall(r'"([a-z]+)"', re.search(r"const HELP_TOPICS = \{(.*?)\};", (serve.STATIC / "app.js").read_text(), re.S).group(1)))
check("every page with a help button has its help file", sorted(t for t in _topics if not (serve.STATIC / "help" / f"{t}.md").is_file()), [])
import base64  # noqa: E402
status, got = post("/api/env/alpha/messages", {"text": "a message carrying a picture",
                                            "files": [{"name": "shot.png", "data": "data:image/png;base64," + base64.b64encode(b"\x89PNG fake").decode()}]})
_files = json.loads(get("/api/env/alpha/files")[2])
_shot = [f for f in _files if f["name"] == "shot.png"]
check("the Files page lists a message's file with where it came from, its link and that it is an image",
      [(f["source"], f["url"].startswith("/message-files/alpha/"), f["image"], f["size"] > 0) for f in _shot], [("message", True, True, True)])
check("and the attachments of the environment's documents",
      any(f["source"] == "doc" and f["n"] == 1 and f["url"].startswith("/docs/1/files/") for f in _files), True)
check("a listed message file opens", get(_shot[0]["url"])[0], 200)
_shot_n = [m["n"] for m in json.loads(get("/api/env/alpha/messages?all=1")[2]) if m["text"] == "a message carrying a picture"][0]
import inbox as _inbox_mod  # noqa: E402
_inbox_mod.file_into(root, _shot_n, "shot.png", "keep", "2026-09-14T10:00:00+00:00", "alpha")
check("a message file the agent kept still shows in Files",
      [f["source"] for f in json.loads(get("/api/env/alpha/files")[2]) if f["name"] == "shot.png"], ["message"])
_shot_msg = [m["n"] for m in json.loads(get("/api/env/alpha/messages?all=1")[2]) if m["text"] == "a message carrying a picture"][0]
status, got = post(f"/api/env/alpha/messages/{_shot_msg}/attach",
                   {"files": [{"name": "later.txt", "data": "data:text/plain;base64," + base64.b64encode(b"added afterwards").decode()}]})
check("a file bigger than an ordinary request can be added to a message after it is sent",
      post(f"/api/env/alpha/messages/{_shot_msg}/attach", {"files": [{"name": "big.bin", "data": base64.b64encode(b"x" * 100_000).decode()}]})[0], 200)
check("files are added to a message after it is sent",
      (status, [f["name"] for f in json.loads(get(f"/api/env/alpha/messages/{_shot_msg}")[2])["files"]]), (200, ["shot.png", "later.txt", "big.bin"]))
check("added from the viewer, it is a comment on the message, so the agent is told",
      [(c["about"], c["text"]) for c in json.loads(get(f"/api/env/alpha/comments?about=inbox%3A{_shot_msg}&all=1")[2])],
      [(f"inbox:{_shot_msg}", f"added big.bin to message {_shot_msg}"), (f"inbox:{_shot_msg}", f"added later.txt to message {_shot_msg}")])
_lists = {
    "to-dos": [(bool(t["done"]), t["closed_at"]) for t in json.loads(get("/api/env/alpha/todos?all=1")[2])],
    "work": [(bool(w["ended"]), w["closed_at"]) for w in json.loads(get("/api/env/beta/work?all=1")[2])],
    "messages": [(m["status"] in ("processed", "archived"), m["closed_at"]) for m in json.loads(get("/api/env/alpha/messages?all=1")[2])],
    "questions": [(q["status"] != "open", q["closed_at"]) for q in json.loads(get("/api/env/alpha/questions?all=1")[2])],
    "pins": [(bool(c["struck"]), c["closed_at"]) for c in json.loads(get("/api/env/alpha/pins?all=1")[2])],
}
check("an open item's row has no closed time",
      sorted(name for name, rows in _lists.items() if any(not closed and at for closed, at in rows)), [])
check("each list has closed items whose row says when they closed",
      sorted(name for name, rows in _lists.items() if not any(closed and at for closed, at in rows)), [])
_tail = root / "context-tail.jsonl"
_tail.write_text(json.dumps({"type": "assistant", "message": {"usage": {"input_tokens": 1000, "cache_read_input_tokens": 149000}}}) + "\n")
check("the agent's context use is its last reading against the window, and nothing without a window or a reading",
      (_activity.context_use(_tail, 1_000_000), _activity.context_use(_tail, 0), _activity.context_use(root / "none.jsonl", 1_000_000)),
      ({"used": 150000, "window": 1_000_000, "share": 15}, None, None))

state.put(root, serve.VIEWER_PORT, srv.server_port)
check("the viewer is found on the port it recorded", serve.running(root).startswith("http://127.0.0.1:"), True)
_other = Path(tempfile.mkdtemp()) / "other" / ".journal"
_other.mkdir(parents=True)
state.put(_other, serve.VIEWER_PORT, srv.server_port)
check("another project whose recorded port this viewer holds is not told a viewer runs for it",
      serve.running(_other), "")
import socket as _socket  # noqa: E402
_held = _socket.socket()
_held.bind(("127.0.0.1", 0))
_held.listen(1)
_busy = _held.getsockname()[1]
_moved = serve.bind(root, project, first=_busy)
check("with its first port in use, a viewer takes a later free one",
      _busy < _moved.server_port < _busy + serve.PORT_TRIES, True)
_moved.server_close()
try:
    serve.bind(root, project, port=_busy)
    _refused = False
except SystemExit:
    _refused = True
check("a port asked for by number that is in use is refused, not moved", _refused, True)
_held.close()
_ident = json.loads(get("/api/identity")[2])
check("a viewer says whose journal it serves, and which version",
      (_ident["root"], bool(_ident["project"]), bool(_ident["version"])), (str(root.resolve()), True, True))
(_other / "VERSION").write_text("0.0.1\n")
_other_srv = serve._Server(("127.0.0.1", 0), _other, _other.parent)
threading.Thread(target=_other_srv.serve_forever, daemon=True).start()
_found = {v["port"]: (v["current"], v["project"], v["version"])
          for v in serve.viewers(root, ports=[srv.server_port, _other_srv.server_port])}
check("a viewer finds the other viewers running, and knows which one is its own",
      _found, {srv.server_port: (True, _ident["project"], _ident["version"]), _other_srv.server_port: (False, "other", "0.0.1")})
check("and serves that list to its page, itself included",
      [v["current"] for v in json.loads(get("/api/viewers")[2]) if v["port"] == srv.server_port], [True])
_other_srv.shutdown()
_other_srv.server_close()
import views  # noqa: E402
line = views.status_line(root, None)
check("the status line names the environment, the open work and the viewer",
      (line.startswith("journal · "), "viewer http://127.0.0.1:" in line), (True, True))

from datetime import datetime, timedelta, timezone  # noqa: E402
_now = datetime(2026, 9, 14, 12, 0, tzinfo=timezone.utc)
check("an age says just now for a minute, then abbreviates: m, h, d",
      [pins.age((_now - timedelta(seconds=s)).isoformat(), _now) for s in (30, 59, 60, 119, 300, 59 * 60, 3600, 86400 * 2)],
      ["just now", "just now", "1m ago", "1m ago", "5m ago", "59m ago", "1h ago", "2d ago"])

_about = json.loads(get("/api/about")[2])
check("the About endpoint says the running version and carries the changelog",
      (bool(_about.get("version")), isinstance(_about.get("changelog"), str)), (True, True))
# the to-dos list reads the folder once per request: the rows come out the same, with and without the list passed in
import todo as _todo_rows  # noqa: E402
_every = _todo_rows._all(root, "alpha")
_by_n = {x["n"]: x for x in _every}
check("a to-do row is the same whether its list is passed in or read again",
      [_todo_rows.row_response(root, "alpha", t) == _todo_rows.row_response(root, "alpha", t, by_n=_by_n) for t in _every], [True] * len(_every))
_after_row = {"n": 9999, "title": "waits on the first", "after": str(_every[0]["n"]) if _every else "1"}
check("and so is what a row waiting on another is still waiting on",
      _todo_rows.waiting_on(root, "alpha", _after_row), _todo_rows.waiting_on(root, "alpha", _after_row, by_n=_by_n))
_real_all, _scans = _todo_rows._all, []
_todo_rows._all = lambda r, tr: (_scans.append(1), _real_all(r, tr))[1]
try:
    _todos_status = get("/api/env/alpha/todos?all=1")[0]
finally:
    _todo_rows._all = _real_all
check("the to-dos list reads the folder a few times per request, not once per row",
      (_todos_status, len(_scans) <= 3, len(_every) > 3), (200, True, True))
# an environment is known by name without building every environment's counts, and the answer is the same
check("an environment is known exactly when views.environments lists it",
      [(e, serve._known_env(root, e), e in {x["name"] for x in views.environments(root)}) for e in ("alpha", "beta", "zz-nobody")],
      [("alpha", True, True), ("beta", True, True), ("zz-nobody", False, False)])
# a controller that raises answers 500 with the error instead of dropping the connection
import controllers.questions as _qc_boom  # noqa: E402
def _boom(self, root, p):
    raise RuntimeError("the store is unreadable")
_orig_show, _orig_update = _qc_boom.QuestionsController.show, _qc_boom.QuestionsController.update
_qc_boom.QuestionsController.show = _boom
_qc_boom.QuestionsController.update = _boom
_b_status, _, _b_body = get("/api/env/alpha/questions/1")
check("a controller that raises on a read answers 500 with the error", (_b_status, "the store is unreadable" in _b_body.decode()), (500, True))
_bw_status, _bw_got = post("/api/env/alpha/questions/1", {"text": "reworded"}, method="PATCH")
check("and on a write, so the viewer knows the write did not go through",
      (_bw_status, "the store is unreadable" in str(_bw_got.get("error", ""))), (500, True))
_qc_boom.QuestionsController.show, _qc_boom.QuestionsController.update = _orig_show, _orig_update
import questions as _q_seen  # noqa: E402
_q_seen.add(root, "which shade for the header?", "2099-01-07T00:00:00+00:00", track="alpha")
_qn = len(_q_seen._all(root, "alpha"))
_asked = lambda: [e["needs"] for e in _activity.ActivityController._events(root, "alpha") if e["text"] == "Asked question" and e["n"] == _qn]
check("an open question nobody has opened asks for attention in Activity", _asked(), ["open"])
_st, _got = post(f"/api/env/alpha/questions/{_qn}/seen", {})
check("opening it in the viewer marks it seen, and its Activity line stops asking",
      (_st, _asked(), json.loads(get(f"/api/env/alpha/questions/{_qn}")[2])["seen"]), (200, [""], True))
srv.shutdown()
srv.server_close()
thread.join(timeout=5)
check("and once it stops, the status line says how to start one", "journal serve" in views.status_line(root, None), True)

import notifications as _notif  # noqa: E402
import inbox as _inbox_answer  # noqa: E402
_notif_before = len(_notif._all(root, "alpha"))
_inbox_answer.add(root, "is the cache on already? and tidy the logs", "2099-01-06T00:00:00+00:00", track="alpha")
_qm = len(_inbox_answer._all(root, "alpha"))
_inbox_answer.reply(root, _qm, "Yes.", "2099-01-06T00:00:01+00:00", track="alpha", part="is the cache on already?")
_answered = lambda: [e for e in _activity.ActivityController._events(root, "alpha") if e["text"] == "Answered your question" and e["n"] == _qm]
check("an answer asks nothing of the user, so even unread it is an ordinary line in Activity", [e["needs"] for e in _answered()], [""])
check("and it raises no notification, because the thread already shows the reply in place",
      len(_notif._all(root, "alpha")) - _notif_before, 0)

# ---------------------------------------------------------------- a commit is a line of its own in Activity
commandlog.record_commit(root, "alpha", "commit-session", "0123456789abcdef0123", "fix the thing that broke", "2099-01-07T00:00:00+00:00")
_commits = [e for e in _activity.ActivityController._events(root, "alpha") if e["kind"] == "commit"]
check("an agent's commit reaches Activity with its short sha, subject and full sha for its link",
      [(e["text"], e["detail"], e["title"], e["sha"]) for e in _commits][:1],
      [("Committed", "0123456", "fix the thing that broke", "0123456789abcdef0123")])

# ---------------------------------------------------------------- the checked-out branch, read from HEAD
import subprocess as _bsp  # noqa: E402
import worktree as _wt  # noqa: E402
_bare = Path(tempfile.mkdtemp())
_repo = Path(tempfile.mkdtemp())
_bsp.run(["git", "init", "-q", "-b", "feature/x", str(_repo)], capture_output=True, timeout=60)
(_repo / "sub").mkdir()
check("outside git there is no branch", _wt.branch(_bare), None)
check("a repository names its branch, from any folder inside it",
      (_wt.branch(_repo), _wt.branch(_repo / "sub")), ({"name": "feature/x", "detached": False, "url": ""},) * 2)
(_repo / ".git" / "HEAD").write_text("0123456789abcdef0123456789abcdef01234567\n")
check("a detached HEAD shows its short sha", _wt.branch(_repo),
      {"name": "0123456", "detached": True, "url": ""})
import types as _types  # noqa: E402
check("the Activity payload carries the branch field",
      "branch" in _activity.ActivityController().index(root, _types.SimpleNamespace(env="alpha")).data, True)

# ---------------------------------------------------------------- working an environment from the viewer
import tracks as _tracks  # noqa: E402
# a NEW environment starts worked-from-the-viewer; the ones already in the record are left as they were
_tracks.set_viewer_first(root, "alpha", False)
_before = {n: _tracks.viewer_first(root, n) for n in ("alpha", "beta")}
_tracks.create(root, "brand-new", at="2026-09-16T09:00:00+00:00")
check("a new environment is worked from the viewer without being told to",
      _tracks.viewer_first(root, "brand-new"), True)
check("and the environments already there keep whatever they had",
      {n: _tracks.viewer_first(root, n) for n in ("alpha", "beta")}, _before)
_tracks.create(root, "brand-new", at="2026-09-16T09:00:00+00:00")
_tracks.set_viewer_first(root, "brand-new", False)
_tracks.create(root, "brand-new", at="2026-09-16T09:00:00+00:00")
check("creating one that exists again does not turn it back on",
      _tracks.viewer_first(root, "brand-new"), False)

_tracks.set_viewer_first(root, "alpha", True)
_tracks.set_viewer_first(root, "beta", False)
check("the viewer-first switch is kept per environment", (_tracks.viewer_first(root, "alpha"), _tracks.viewer_first(root, "beta")), (True, False))
_tracks.set_viewer_first(root, "alpha", False)
check("and switches off again", _tracks.viewer_first(root, "alpha"), False)
check("the agent's last reply is empty when there is no transcript", _activity.last_said(None), "")
_said_file = Path(tempfile.mkdtemp()) / "said.jsonl"
_said_file.write_text("\n".join(json.dumps(x) for x in [
    {"type": "assistant", "message": {"content": [{"type": "text", "text": "working on the inspector now"}, {"type": "tool_use", "name": "Bash", "input": {}}]}},
    {"type": "user", "origin": {"kind": "human"}, "message": {"content": "carry on"}},
]) + "\n")
check("Activity shows the agent's latest text even while a tool call follows it", _activity.last_said(_said_file), "working on the inspector now")
_tagged_file = Path(tempfile.mkdtemp()) / "tagged.jsonl"
_tagged_file.write_text(json.dumps(
    {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!info] the inspector no longer replays its slide-in"}]}}) + "\n")
check("Activity drops the tag a reply opens with, like [!info]", _activity.last_said(_tagged_file), "the inspector no longer replays its slide-in")
import transcript as _transcript  # noqa: E402
check("the stop hook's reading still ignores text a tool call follows", _transcript.last_reply(_said_file), None)

# ---------------------------------------------------------------- how long each resource is kept
import retention as _retention  # noqa: E402
_kept = _retention.table(root, "beta")
check("each resource has days listed and days archived, keeping today's behaviour by default",
      ((_kept["reports"]["archive"], _kept["reports"]["delete"]), (_kept["plans"]["archive"], _kept["plans"]["delete"]), (_kept["questions"]["archive"], _kept["questions"]["delete"])),
      ((7, 30), (3, 0), (7, 0)))
check("a resource's days are set per environment", (_retention.set_days(root, "beta", "questions", 14, 60)[0], _retention.days(root, "beta", "questions"), _retention.days(root, "alpha", "questions")),
      (True, {"archive": 14, "delete": 60}, {"archive": 7, "delete": 0}))
check("to-dos keep their days where they always were", (_retention.set_days(root, "beta", "todos", 21)[0], __import__("todo").archive_days(root, "beta")), (True, 21))
check("an unknown resource or a negative day is refused", (_retention.set_days(root, "beta", "pins", 3)[0], _retention.set_days(root, "beta", "work", -1)[0]), (False, False))

# ---------------------------------------------------------------- deleting archived items keeps a closed tombstone
import questions as _q  # noqa: E402
_q.add(root, "an old question to delete", "2020-01-01T00:00:00+00:00", track="beta")
_qn = len(_q._all(root, "beta"))
_q.answer(root, _qn, "yes", "2020-01-01T00:00:00+00:00", track="beta")
_q.add(root, "an open question to keep", "2020-01-01T00:00:00+00:00", track="beta")
_retention.set_days(root, "beta", "questions", 1, 1)
check("a closed item past its days listed and archived is deleted", _retention.prune(root, "beta") >= 1, True)
_old, _open = _q._all(root, "beta")[_qn - 1], _q._all(root, "beta")[_qn]
check("the deleted question loses its text but stays answered and closed",
      ("text" in _old, bool(_old.get("removed")), _old.get("answer"), _q.is_open(_old)), (False, True, "yes", False))
check("an open question is never deleted", (_open.get("text"), bool(_open.get("removed"))), ("an open question to keep", False))

# THE BYTES GO WITH THE REFERENCE. Pruning a message dropped its `files` list and left the files on
# disk with nothing pointing at them — found while designing a feature whose attachments are large.
import inbox as _inbox  # noqa: E402
_inbox.add(root, "pruned, with a file", "2020-01-01T00:00:00+00:00", track="beta",
           files=[{"name": "gone.txt", "data": base64.b64encode(b"bytes that should go").decode()}])
_pruned_n = len(_inbox._all(root, "beta"))
_inbox.add(root, "kept, with a file", "2020-01-01T00:00:00+00:00", track="beta",
           files=[{"name": "stays.txt", "data": base64.b64encode(b"bytes that should stay").decode()}])
_kept_n = len(_inbox._all(root, "beta"))
_msgs = _inbox._all(root, "beta")
_msgs[_pruned_n - 1]["processed"] = "2020-01-01T00:00:00+00:00"
_inbox._put(root, _msgs, "beta")
check("both messages have their files on disk to begin with",
      (_inbox.files_dir(root, "beta", _pruned_n).is_dir(), _inbox.files_dir(root, "beta", _kept_n).is_dir()), (True, True))
_retention.set_days(root, "beta", "inbox", 1, 1)
_retention.prune(root, "beta")
check("a pruned message takes its files with it, and leaves every other message's alone",
      (_inbox.files_dir(root, "beta", _pruned_n).exists(), _inbox.files_dir(root, "beta", _kept_n).is_dir()), (False, True))
check("and the record keeps its place, marked removed",
      (bool(_inbox._all(root, "beta")[_pruned_n - 1].get("removed")), "files" in _inbox._all(root, "beta")[_pruned_n - 1]),
      (True, False))
# A PASTED TRANSCRIPT CARRIES NO ATTACHMENT, so its file used to sit behind a guard that only fired
# when `files` was set -- which would have orphaned exactly the transcripts nobody attached.
_inbox.add(root, "Jesse: pasted, with nothing attached to it.", "2020-01-01T00:00:00+00:00",
           track="beta", kind="transcript")
_tr_n = len(_inbox._all(root, "beta"))
_tr_path = _inbox.transcript_path(root, "beta", _tr_n)
_msgs = _inbox._all(root, "beta")
_msgs[_tr_n - 1]["processed"] = "2020-01-01T00:00:00+00:00"
_inbox._put(root, _msgs, "beta")
check("a pasted transcript is on disk, though it has no attachment",
      (_tr_path.is_file(), bool(_msgs[_tr_n - 1].get("files"))), (True, False))
_retention.prune(root, "beta")
check("and pruning the message takes the transcript with it", _tr_path.exists(), False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
