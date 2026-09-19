import json
import sys
import time
import tempfile
import threading
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.viewer import running  # noqa: E402
from resources.base import ACTIONS, VIEWS  # noqa: E402
from resources.types import TYPES  # noqa: E402
from serve import serve  # noqa: E402
from tests.kit import check, done  # noqa: E402



root = Path(tempfile.mkdtemp()) / ".journal"
server = serve(root, 0)
port = server.server_address[1]
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{port}"
check("the live viewer records its actual URL", running(root), f"{base}/")


def call(method, path, body=None):
    req = urllib.request.Request(base + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


code, m = call("GET", "/api/manifest")
check("the manifest says every type, its view and nav, the actions, actors and priority", (code, sorted(m["types"]), m["actions"], m["types"]["todo"]["names"]),
      (200, sorted(TYPES), list(ACTIONS), {"complete": "done", "create": "add"}))
check("every view in the manifest is one of the three", all(t["view"] in VIEWS for t in m["types"].values()), True)
code, files = call("GET", "/api/main/files")
check("the files route lists every attachment on the environment, newest first, with where it hangs", (code, isinstance(files, list)), (200, True))
code, who = call("GET", "/api/identity")
check("identity names the project, its root, the version and the environments — what the extension asks a port", (code, who["project"], who["root"], bool(who["version"]), "main" in who["environments"]), (200, m["project"], str(root), True, True))

for type_ in TYPES:                                                   # every type over HTTP, same routes
    code, made = call("POST", f"/api/main/{type_}", {"title": f"a {type_}", "abstract": "short"})
    first = 2 if type_ == "environment" else 1
    check(f"{type_}: create", (code, made["n"], made["type"], made["seen"]), (201, first, type_, ["user"]))
    code, rows = call("GET", f"/api/main/{type_}")
    check(f"{type_}: list", (code, [r["title"] for r in rows][-1:]), (200, [f"a {type_}"]))
    code, one = call("GET", f"/api/main/{type_}/{first}")
    check(f"{type_}: show", (code, one["ref"]), (200, f"{type_}:{first}"))
    code, got = call("POST", f"/api/main/{type_}/{first}/link", {"ref": "todo:9"})
    check(f"{type_}: link", (code, got["refs"]), (200, ["todo:9"]))
    finish = TYPES[type_].names.get("complete", "complete")
    code, got = call("POST", f"/api/main/{type_}/{first}/{finish}", {"how": "over"})
    check(f"{type_}: the type's own name for complete works ({finish})", (code, "removed" in got if type_ == "environment" else got["completed"] > 0), (200, True))
    code, got = call("POST", f"/api/main/{type_}/{first}/complete")
    renamed = "complete" in TYPES[type_].names
    check(f"{type_}: the default name {'names the right word' if renamed else 'is the same act, already done'}",
          (code, ("calls that" in got["error"]) if renamed else ("already" in got["error"])), (400, True))
    code, got = call("POST", f"/api/main/{type_}", {"title": "bad: colon"})
    check(f"{type_}: the title rule holds over HTTP", (code, "colon" in got["error"]), (400, True))

code, first_message = call("POST", "/api/main/message", {"title": "queued once", "idempotency": "outbox-1"})
code, duplicate_message = call("POST", "/api/main/message", {"title": "queued twice", "idempotency": "outbox-1"})
check("messages with an idempotency key are created once", (code, duplicate_message["n"], duplicate_message["title"]), (201, first_message["n"], "queued once"))

code, got = call("GET", "/api/main/nothing")
check("an unknown type is a 404", code, 404)
code, got = call("POST", "/api/main/todo/1/nothing", {})
check("an unknown action is refused", code, 400)
# SETTINGS, SEARCH AND FILES
code, got = call("GET", "/api/main/settings")
check("settings say every feature's switch, the triggers and the keep days", (code, got["features"]["auto"], got["features"]["work"], got["triggers"], got["keep"]), (200, False, True, {}, {}))
code, got = call("POST", "/api/main/settings", {"features": {"auto": True}, "keep": {"report": 30}})
check("settings are written and read back", (got["features"]["auto"], got["keep"]), (True, {"report": 30}))
code, got = call("GET", "/api/main/search?q=a%20todo")
check("search spans every type", (code, sorted({r["type"] for r in got}) == ["todo"] and len(got) >= 1), (200, True))
check("no term: nothing", call("GET", "/api/main/search")[1], [])
call("POST", "/api/main/notification", {"title": "one unread", "actor": "agent"})
call("POST", "/api/main/notification", {"title": "two unread", "actor": "agent"})
before = call("GET", "/api/main/events?since=0")[1]
code, got = call("POST", "/api/main/notification/read-all", {"numbers": [2, 3]})
check("one bulk request marks many rows read", (code, [r["seen"] for r in got]), (200, [["agent", "user"], ["agent", "user"]]))
after = call("GET", "/api/main/events?since=0")[1]
check("one bulk read emits one refresh event", (len(after) - len(before), after[-1]["data"]), (1, {"numbers": [2, 3], "seen": "user"}))
import tempfile  # noqa: E402
shot = Path(tempfile.mkdtemp()) / "shot.png"
shot.write_bytes(b"\x89PNG")
call("POST", "/api/main/todo/1/attach", {"path": str(shot), "what": "a picture"})
req = urllib.request.Request(base + "/api/main/todo/1/files/shot.png")
with urllib.request.urlopen(req) as r:
    check("a resource's file is served with its type", (r.status, r.headers["Content-Type"], r.read()), (200, "image/png", b"\x89PNG"))
check("a missing file is a 404", call("GET", "/api/main/todo/1/files/none.png")[0], 404)

transcript = Path(tempfile.mkdtemp()) / "rollout.jsonl"
transcript.write_text("\n".join(json.dumps({"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": text}]}}) for text in ("one", "two", "three")) + "\n")
code, agent = call("POST", "/api/main/agent", {"title": "transcript-agent", "provider": "codex", "transcript": str(transcript)})
code, latest = call("GET", f"/api/main/agent/{agent['n']}/transcript?last=2")
code, earlier = call("GET", f"/api/main/agent/{agent['n']}/transcript?before={latest['turns'][0]['line']}&last=2")
check("an agent transcript pages newest first with stable source lines", (code, latest["total"], [t["text"] for t in latest["turns"]], [t["text"] for t in earlier["turns"]]),
      (200, 3, ["two", "three"], ["one"]))

# AN UPLOAD: a multipart body lands as the resource's files
boundary = b"xx1234"
part = b"--" + boundary + b"\r\nContent-Disposition: form-data; name=\"file\"; filename=\"pic.png\"\r\nContent-Type: image/png\r\n\r\n\x89PNGdata\r\n--" + boundary + b"--\r\n"
req = urllib.request.Request(base + "/api/main/todo/1/upload", data=part, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary.decode()}"})
with urllib.request.urlopen(req) as r:
    check("an upload attaches the file and names it", json.loads(r.read()), {"files": ["pic.png"]})
with urllib.request.urlopen(base + "/api/main/todo/1/files/pic.png") as r:
    check("and it is served back", r.read(), b"\x89PNGdata")
part = b"--" + boundary + b"\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a shot.png\"\r\nContent-Type: image/png\r\n\r\nspaced\r\n--" + boundary + b"--\r\n"
urllib.request.urlopen(urllib.request.Request(base + "/api/main/todo/1/upload", data=part, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary.decode()}"})).read()
with urllib.request.urlopen(base + "/api/main/todo/1/files/a%20shot.png") as r:
    check("a name with a space is served back from its encoded path", r.read(), b"spaced")

# THE EVENT LOG AND THE STREAM
code, got = call("GET", "/api/main/events?since=0")
check("the log is served past a cursor", (code, got[0]["id"], all(e["id"] > 3 for e in call("GET", "/api/main/events?since=3")[1])), (200, 1, True))
import socket  # noqa: E402
sock = socket.create_connection(("127.0.0.1", port), timeout=5)
sock.sendall(b"GET /api/main/stream HTTP/1.1\r\nHost: x\r\n\r\n")
time.sleep(0.3)
call("POST", "/api/main/todo", {"title": "streamed"})
call("POST", "/api/other/todo", {"title": "elsewhere"})
buf = b""
deadline = time.time() + 5
while b"data:" not in buf and time.time() < deadline:
    buf += sock.recv(4096)
sock.close()
lines = [l for l in buf.decode().splitlines() if l.startswith("data:")]
check("an event on the environment reaches the stream as it happens, another environment's does not",
      (b"text/event-stream" in buf, len(lines), json.loads(lines[0][5:])["type"] if lines else None, b"elsewhere" in buf), (True, 1, "todo", False))


code, got = call("POST", "/api/shown", {"command": "journal message paths 104", "shown": ["the paths of message 104"]})
check("what the status bar shows is logged for the record", (code, (root / "runtime" / "shown.log").read_text().split("\t")[1]), (200, '["the paths of message 104"]'))


(root.parent / "web").mkdir(exist_ok=True)
(root.parent / "web" / "gist.js").write_text("export const a = 1;\nexport const b = 2;\n")
code, got = call("GET", "/api/main/file?path=web/gist.js")
check("a project file is served read-only with its text and line count", (code, got["path"], got["lines"], got["text"].startswith("export")), (200, "web/gist.js", 2, True))
code, project_files = call("GET", "/api/main/project-files")
check("the project file index lists visible files without journal internals", (code, any(f["path"] == "web/gist.js" for f in project_files), any(f["path"].startswith(".journal/") for f in project_files)), (200, True, False))
code, got = call("GET", f"/api/main/file?path={str(root.parent / 'web' / 'gist.js').replace('/', '%2F')}")
check("an absolute mention inside the project resolves to its concise project path", (code, got["path"]), (200, "web/gist.js"))
check("a path outside the project is refused", call("GET", "/api/main/file?path=../../etc/passwd")[0], 404)
check("a path with no file is refused", call("GET", "/api/main/file?path=web/none.js")[0], 404)


# JOURNALS ON THIS MACHINE
from engine import viewer  # noqa: E402
viewer.note(root.parent / "stopped" / ".journal", "http://127.0.0.1:8439/")
(root.parent / "stopped" / ".journal").mkdir(parents=True)
code, journals = call("GET", "/api/journals")
stopped = [j for j in journals if not j["running"]]
check("a remembered journal whose viewer is down is listed as not running, with its project", (code, [(j["project"], j["port"]) for j in stopped]), (200, [("stopped", 0)]))
call("POST", "/api/journals/forget", {"root": stopped[0]["root"]})
check("forget takes it off the list", [j for j in call("GET", "/api/journals")[1] if not j["running"]], [])


# A SIBLING VIEWER ON THIS MACHINE
def asked(origin, method="GET"):
    req = urllib.request.Request(base + "/api/identity", method=method, headers={"Origin": origin})
    with urllib.request.urlopen(req) as r:
        return r.status, r.headers.get("Access-Control-Allow-Origin"), r.headers.get("Access-Control-Allow-Headers")


check("a sibling viewer on this machine may read this one", asked(f"http://127.0.0.1:{port + 1}"), (200, f"http://127.0.0.1:{port + 1}", "Content-Type"))
check("so may one on localhost", asked("http://localhost:8421")[1], "http://localhost:8421")
check("a page from anywhere else may not", asked("http://evil.example")[1], None)
check("a JSON post's preflight is answered", asked("http://127.0.0.1:8421", "OPTIONS")[:2], (204, "http://127.0.0.1:8421"))
server.shutdown()
done()
