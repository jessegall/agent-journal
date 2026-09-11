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
import docs, pins, reminders, serve, state, todo, tracks, views, work  # noqa: E402

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

status, _, body = get("/api/env/alpha/todos")
data = json.loads(body)
check("alpha's to-dos: 200 and the seeded to-do is there", (status, any(t["title"] == "do the thing" for t in data)), (200, True))

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

status, _, body = get("/nothing/here")
check("an unmapped path is 404, not a crash", status, 404)

srv.shutdown()
srv.server_close()
thread.join(timeout=5)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
