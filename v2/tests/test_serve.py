import json
import sys
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
server.shutdown()
print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
