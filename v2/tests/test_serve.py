import json
import sys
import time
import tempfile
import threading
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.resources.base import ACTIONS, VIEWS  # noqa: E402
from v2.resources.types import TYPES  # noqa: E402
from v2.serve import serve  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


root = Path(tempfile.mkdtemp()) / ".journal"
server = serve(root, 0)
port = server.server_address[1]
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{port}"


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

for type_ in TYPES:                                                   # every type over HTTP, same routes
    code, made = call("POST", f"/api/main/{type_}", {"title": f"a {type_}", "abstract": "short"})
    check(f"{type_}: create", (code, made["n"], made["type"], made["seen"]), (201, 1, type_, ["user"]))
    code, rows = call("GET", f"/api/main/{type_}")
    check(f"{type_}: list", (code, [r["title"] for r in rows]), (200, [f"a {type_}"]))
    code, one = call("GET", f"/api/main/{type_}/1")
    check(f"{type_}: show", (code, one["ref"]), (200, f"{type_}:1"))
    done = TYPES[type_].names.get("complete", "complete")
    code, got = call("POST", f"/api/main/{type_}/1/{done}", {"how": "over"})
    check(f"{type_}: the type's own name for complete works ({done})", (code, got["completed"] > 0), (200, True))
    code, got = call("POST", f"/api/main/{type_}/1/complete")
    renamed = "complete" in TYPES[type_].names
    check(f"{type_}: the default name {'names the right word' if renamed else 'is the same act, already done'}",
          (code, ("calls that" in got["error"]) if renamed else ("already" in got["error"])), (400, True))
    code, got = call("POST", f"/api/main/{type_}", {"title": "bad: colon"})
    check(f"{type_}: the title rule holds over HTTP", (code, "colon" in got["error"]), (400, True))
    code, got = call("POST", f"/api/main/{type_}/1/link", {"ref": "todo:9"})
    check(f"{type_}: link", (code, got["refs"]), (200, ["todo:9"]))

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
import tempfile  # noqa: E402
shot = Path(tempfile.mkdtemp()) / "shot.png"
shot.write_bytes(b"\x89PNG")
call("POST", "/api/main/todo/1/attach", {"path": str(shot), "what": "a picture"})
req = urllib.request.Request(base + "/api/main/todo/1/files/shot.png")
with urllib.request.urlopen(req) as r:
    check("a resource's file is served with its type", (r.status, r.headers["Content-Type"], r.read()), (200, "image/png", b"\x89PNG"))
check("a missing file is a 404", call("GET", "/api/main/todo/1/files/none.png")[0], 404)

# THE EVENT LOG AND THE STREAM
code, got = call("GET", "/api/main/events?since=0")
check("the log is served past a cursor", (code, got[0]["id"], got[0]["type"], all(e["id"] > 3 for e in call("GET", "/api/main/events?since=3")[1])), (200, 1, "message", True))
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
server.shutdown()
print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
