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
status, _, body = get("/api/env/alpha/inbox")
check("alpha's inbox: 200, the message from the cli",
      (status, [m["text"] for m in json.loads(body)]), (200, ["hello from the cli"]))
status, _, body = get("/api/env/beta/inbox")
check("beta's inbox is its own", json.loads(body), [])
status, got = post("/api/env/beta/inbox", {"text": "a message from the browser"})
check("POST a message: 201, written from the web",
      (status, got["data"]["text"], got["data"]["source"]), (201, "a message from the browser", "web"))
check("and it landed on beta, not wherever this process is tracked",
      ([m["text"] for m in inbox.rows_response(root, "alpha")], len(inbox.rows_response(root, "beta"))),
      (["hello from the cli"], 1))
status, got = post("/api/env/beta/inbox", {"text": "  "})
check("an empty message is refused: 400 with the reason", (status, "needs its text" in got["error"]), (400, True))
status, got = post("/api/env/nope/inbox", {"text": "x"})
check("POST to an unknown environment is 404", status, 404)
status, got = post("/api/env/beta/inbox", b"text=x", headers={"Content-Type": "application/x-www-form-urlencoded"})
check("a form post is refused: JSON only", status, 415)
status, got = post("/api/env/beta/inbox", {"text": "x"}, headers={"Origin": "http://elsewhere.example"})
check("a write from another origin is refused", status, 403)
status, got = post("/api/env/beta/inbox", b"[1, 2]")
check("a body that is not a JSON object is 400", status, 400)
check("no refused write landed", len(inbox.rows_response(root, "beta")), 1)
status, got = post("/api/env/beta/inbox/1", {"text": "a message from the browser, reworded"}, method="PATCH")
check("a waiting message can be reworded", (status, inbox._all(root, "beta")[0]["text"]), (200, "a message from the browser, reworded"))
status, got = post("/api/env/beta/inbox/1/move", {"environment": "alpha"})
check("move carries a waiting message to another environment",
      (status, [m["text"] for m in inbox.rows_response(root, "alpha")][:1], inbox.rows_response(root, "beta")[0]["status"]),
      (200, ["a message from the browser, reworded"], "moved"))
status, got = post("/api/env/beta/inbox/1", {"text": "x"}, method="PATCH")
check("a moved message refuses a change", status, 400)
status, got = post("/api/env/alpha/inbox/2/process", {"part": "a message from the browser", "became": ["noted"]})
check("a part is recorded through the controller", (status, len(inbox._all(root, "alpha")[1]["parts"])), (200, 1))
status, got = post("/api/env/alpha/inbox/2/done", {})
check("and the message is marked processed", (status, bool(inbox._all(root, "alpha")[1]["processed"])), (200, True))
status, got = post("/api/env/alpha/inbox/1", {"text": "x"}, method="DELETE")
check("a message is never deleted", status, 405)

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

# ─────────────────────────────────────────────────────────────── an environment's settings, through its controller
tracks.create(root, "gamma", at=AT)
status, _, body = get("/api/env/gamma/environment")
check("an environment's settings: auto is off by default", (status, json.loads(body)["auto"]), (200, False))
status, got = post("/api/env/gamma/environment/settings", {"auto": True})
check("auto mode is switched on from the browser", (status, todo.auto(root, "gamma")), (200, True))
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

srv.shutdown()
srv.server_close()
thread.join(timeout=5)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
