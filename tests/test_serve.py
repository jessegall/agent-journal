import json
import socket
import time
import threading
import urllib.error
import urllib.request
from pathlib import Path

from engine.viewer import running
from resources.base import ACTIONS, VIEWS
from resources.types import TYPES
from serve import serve


def test_the_server_answers_every_route_the_viewer_uses(tmp_path):
    root = tmp_path / ".journal"
    server = serve(root, 0)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    try:
        assert running(root) == f"{base}/", "the live viewer records its actual URL"

        def call(method, path, body=None):
            req = urllib.request.Request(base + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                         headers={"Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req) as r:
                    return r.status, json.loads(r.read())
            except urllib.error.HTTPError as e:
                return e.code, json.loads(e.read())

        code, m = call("GET", "/api/manifest")
        assert (code, sorted(m["types"]), m["actions"], m["types"]["todo"]["names"]) == \
            (200, sorted(TYPES), list(ACTIONS), {"complete": "done"}), \
            "the manifest says every type, its view and nav, the actions, actors and priority"
        assert all(t["view"] in VIEWS for t in m["types"].values()) is True, "every view in the manifest is one of the three"
        assert (m["types"]["todo"]["filters"], [f["title"] for f in m["types"]["rule"]["filters"]]) == \
            ([{"key": "open", "title": "Open", "shows": "open"}, {"key": "closed", "title": "Done", "shows": "closed"}], ["Open", "Struck"]), \
            "a type says what its list can be narrowed to, and what each tab is called"
        assert (sorted(name for name, t in m["types"].items() if t["clears"] == "completed"), m["types"]["message"]["clears"], m["types"]["report"]["clears"]) == \
            (["question", "suggestion"], "opened", "cleared"), "a type says what takes it off the user's list"
        assert (m["types"]["work"]["shown"]["created"], m["types"]["fact"]["shown"]["completed"]) == ("Work started", "Fact struck"), \
            "a type says how its events read in the viewer"
        code, files = call("GET", "/api/main/files")
        assert (code, isinstance(files, list)) == (200, True), \
            "the files route lists every attachment on the environment, newest first, with where it hangs"
        code, who = call("GET", "/api/identity")
        assert (code, who["project"], who["root"], bool(who["version"]), "main" in who["environments"]) == (200, m["project"], str(root), True, True), \
            "identity names the project, its root, the version and the environments — what the extension asks a port"

        for type_ in TYPES:
            already = call("GET", f"/api/main/{type_}")[1]
            code, made = call("POST", f"/api/main/{type_}", {"title": f"a {type_}", "abstract": "short"})
            first = 2 if type_ == "environment" else len(already) + 1
            assert (code, made["n"], made["type"], made["seen"]) == (201, first, type_, ["user"]), f"{type_}: create"
            code, rows = call("GET", f"/api/main/{type_}")
            assert (code, [r["title"] for r in rows][-1:]) == (200, [f"a {type_}"]), f"{type_}: list"
            code, one = call("GET", f"/api/main/{type_}/{first}")
            assert (code, one["ref"]) == (200, f"{type_}:{first}"), f"{type_}: show"
            code, got = call("POST", f"/api/main/{type_}/{first}/link", {"ref": "todo:9"})
            assert (code, got["refs"]) == (200, ["todo:9"]), f"{type_}: link"
            finish = TYPES[type_].names.get("complete", "complete")
            code, got = call("POST", f"/api/main/{type_}/{first}/{finish}", {"how": "over"})
            assert (code, "removed" in got if type_ == "environment" else got["completed"] > 0) == (200, True), \
                f"{type_}: the type's own name for complete works ({finish})"
            code, got = call("POST", f"/api/main/{type_}/{first}/complete")
            renamed = "complete" in TYPES[type_].names
            assert (code, ("calls that" in got["error"]) if renamed else ("already" in got["error"])) == (400, True), \
                f"{type_}: the default name {'names the right word' if renamed else 'is the same act, already done'}"
            code, got = call("POST", f"/api/main/{type_}", {"title": "bad: colon"})
            assert (code, "colon" in got["error"]) == (400, True), f"{type_}: the title rule holds over HTTP"

        code, first_message = call("POST", "/api/main/message", {"title": "queued once", "idempotency": "outbox-1"})
        code, duplicate_message = call("POST", "/api/main/message", {"title": "queued twice", "idempotency": "outbox-1"})
        assert (code, duplicate_message["n"], duplicate_message["title"]) == (201, first_message["n"], "queued once"), \
            "messages with an idempotency key are created once"

        code, got = call("GET", "/api/main/nothing")
        assert code == 404, "an unknown type is a 404"
        code, got = call("POST", "/api/main/todo/1/nothing", {})
        assert code == 400, "an unknown action is refused"
        code, up = call("GET", "/api/upstream")
        assert (code, set(up) == {"installed", "latest", "newer"}, isinstance(up["newer"], bool)) == (200, True, True), \
            "upstream answers with both versions and whether the newer one is ahead"

        code, listed = call("GET", "/api/services")
        assert (code, listed) == (200, []), "with no plugin installed, no service is listed"
        code, said = call("POST", "/api/services/works.web", {"want": "down"})
        assert (code, said["want"], said["id"]) == (200, "down", "works.web"), "a service can be asked to stop"
        code, said = call("POST", "/api/services/works.web", {"want": "restart"})
        assert (code, said["want"], said["nonce"] > 0) == (200, "up", True), "a restart is the same ask with a fresh nonce"
        assert call("POST", "/api/services/works.web", {"want": "sideways"})[0] == 404, "anything else is refused"
        code, read = call("GET", "/api/services/works.web/log")
        assert (code, read) == (200, {"id": "works.web", "log": ""}), "a log that does not exist yet reads empty"
        from features.plugins.source import log as plugin_log
        told = plugin_log(root, "works")
        told.parent.mkdir(parents=True, exist_ok=True)
        told.write_text("".join(f"line {i}\n" for i in range(1, 6)))
        code, read = call("GET", "/api/plugins/works/log?lines=2")
        assert (code, read) == (200, {"name": "works", "log": "line 4\nline 5"}), \
            "a plugin's log is read over HTTP, the last lines first asked for"

        def ran(*args):
            req = urllib.request.Request(base + "/api/run", method="POST", data="\0".join(args).encode(),
                                         headers={"Content-Type": "text/plain"})
            try:
                with urllib.request.urlopen(req) as r:
                    return r.status, r.read().decode()
            except urllib.error.HTTPError as e:
                return e.code, e.read().decode()

        assert ran("todo", "all")[0] == 200, "a resource command runs in the server, in the CLI's own words"
        assert ran("speed")[0] == 409, "a command the viewer will not run is handed back for the caller to run itself"
        assert ran("message", "show", "999999") == (400, "! no message 999999\n"), "a refusal comes back as a failure with the reason"

        code, changed = call("GET", "/api/main/changes")
        assert (code, changed) == (200, {"changes": []}), "the file changes are served in the order they happened, newest first"

        code, bar = call("GET", "/api/main/bar")
        assert (code, bar) == (200, {"queue": []}), "the bar is served by the journal as a queue, empty while nothing has run"

        code, got = call("GET", "/api/main/settings")
        assert (code, got["features"]["auto"], got["features"]["work"], got["triggers"], got["keep"]) == (200, False, True, {}, {}), \
            "settings say every feature's switch, the triggers and the keep days"
        code, got = call("POST", "/api/main/settings", {"features": {"auto": True}, "keep": {"report": 30}})
        assert (got["features"]["auto"], got["keep"]) == (True, {"report": 30}), "settings are written and read back"
        code, got = call("GET", "/api/main/search?q=a%20todo")
        assert (code, sorted({r["type"] for r in got}) == ["todo"] and len(got) >= 1) == (200, True), "search spans every type"
        assert call("GET", "/api/main/search")[1] == [], "no term: nothing"
        call("POST", "/api/main/notification", {"title": "one unread", "actor": "agent"})
        call("POST", "/api/main/notification", {"title": "two unread", "actor": "agent"})
        before = call("GET", "/api/main/events?since=0")[1]
        code, got = call("POST", "/api/main/notification/read-all", {"numbers": [2, 3]})
        assert (code, [r["seen"] for r in got]) == (200, [["agent", "user"], ["agent", "user"]]), "one bulk request marks many rows read"
        after = call("GET", "/api/main/events?since=0")[1]
        assert (len(after) - len(before), after[-1]["data"]) == (1, {"numbers": [2, 3], "seen": "user"}), "one bulk read emits one refresh event"
        shot = tmp_path / "shot.png"
        shot.write_bytes(b"\x89PNG")
        call("POST", "/api/main/todo/1/attach", {"path": str(shot), "what": "a picture"})
        req = urllib.request.Request(base + "/api/main/todo/1/files/shot.png")
        with urllib.request.urlopen(req) as r:
            assert (r.status, r.headers["Content-Type"], r.read()) == (200, "image/png", b"\x89PNG"), "a resource's file is served with its type"
        assert call("GET", "/api/main/todo/1/files/none.png")[0] == 404, "a missing file is a 404"

        transcript = tmp_path / "rollout.jsonl"
        transcript.write_text("\n".join(json.dumps({"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": text}]}}) for text in ("one", "two", "three")) + "\n")
        code, agent = call("POST", "/api/main/agent", {"title": "transcript-agent", "provider": "codex", "transcript": str(transcript)})
        code, latest = call("GET", f"/api/main/agent/{agent['n']}/transcript?last=2")
        code, earlier = call("GET", f"/api/main/agent/{agent['n']}/transcript?before={latest['turns'][0]['line']}&last=2")
        assert (code, latest["total"], [t["text"] for t in latest["turns"]], [t["text"] for t in earlier["turns"]]) == \
            (200, 3, ["two", "three"], ["one"]), "an agent transcript pages newest first with stable source lines"

        boundary = b"xx1234"
        part = b"--" + boundary + b"\r\nContent-Disposition: form-data; name=\"file\"; filename=\"pic.png\"\r\nContent-Type: image/png\r\n\r\n\x89PNGdata\r\n--" + boundary + b"--\r\n"
        req = urllib.request.Request(base + "/api/main/todo/1/upload", data=part, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary.decode()}"})
        with urllib.request.urlopen(req) as r:
            assert json.loads(r.read()) == {"files": ["pic.png"]}, "an upload attaches the file and names it"
        with urllib.request.urlopen(base + "/api/main/todo/1/files/pic.png") as r:
            assert r.read() == b"\x89PNGdata", "and it is served back"
        part = b"--" + boundary + b"\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a shot.png\"\r\nContent-Type: image/png\r\n\r\nspaced\r\n--" + boundary + b"--\r\n"
        urllib.request.urlopen(urllib.request.Request(base + "/api/main/todo/1/upload", data=part, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary.decode()}"})).read()
        with urllib.request.urlopen(base + "/api/main/todo/1/files/a%20shot.png") as r:
            assert r.read() == b"spaced", "a name with a space is served back from its encoded path"

        code, got = call("GET", "/api/main/events?since=0")
        assert (code, got[0]["id"], all(e["id"] > 3 for e in call("GET", "/api/main/events?since=3")[1])) == (200, 1, True), \
            "the log is served past a cursor"
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
        assert (b"text/event-stream" in buf, len(lines), json.loads(lines[0][5:])["type"] if lines else None, b"elsewhere" in buf) == \
            (True, 1, "todo", False), "an event on the environment reaches the stream as it happens, another environment's does not"

        (root.parent / "web").mkdir(exist_ok=True)
        (root.parent / "web" / "gist.js").write_text("export const a = 1;\nexport const b = 2;\n")
        code, got = call("GET", "/api/main/file?path=web/gist.js")
        assert (code, got["path"], got["lines"], got["text"].startswith("export")) == (200, "web/gist.js", 2, True), \
            "a project file is served read-only with its text and line count"
        code, project_files = call("GET", "/api/main/project-files")
        assert (code, any(f["path"] == "web/gist.js" for f in project_files), any(f["path"].startswith(".journal/") for f in project_files)) == \
            (200, True, False), "the project file index lists visible files without journal internals"
        code, got = call("GET", f"/api/main/file?path={str(root.parent / 'web' / 'gist.js').replace('/', '%2F')}")
        assert (code, got["path"]) == (200, "web/gist.js"), "an absolute mention inside the project resolves to its concise project path"
        assert call("GET", "/api/main/file?path=../../etc/passwd")[0] == 404, "a path outside the project is refused"
        assert call("GET", "/api/main/file?path=web/none.js")[0] == 404, "a path with no file is refused"

        from engine import viewer
        viewer.note(root.parent / "stopped" / ".journal", "http://127.0.0.1:8439/")
        (root.parent / "stopped" / ".journal").mkdir(parents=True)
        code, journals = call("GET", "/api/journals")
        stopped = [j for j in journals if not j["running"]]
        assert (code, [(j["project"], j["port"]) for j in stopped]) == (200, [("stopped", 0)]), \
            "a remembered journal whose viewer is down is listed as not running, with its project"
        call("POST", "/api/journals/forget", {"root": stopped[0]["root"]})
        assert [j for j in call("GET", "/api/journals")[1] if not j["running"]] == [], "forget takes it off the list"

        def asked(origin, method="GET"):
            req = urllib.request.Request(base + "/api/identity", method=method, headers={"Origin": origin})
            with urllib.request.urlopen(req) as r:
                return r.status, r.headers.get("Access-Control-Allow-Origin"), r.headers.get("Access-Control-Allow-Headers")

        assert asked(f"http://127.0.0.1:{port + 1}") == (200, f"http://127.0.0.1:{port + 1}", "Content-Type"), \
            "a sibling viewer on this machine may read this one"
        assert asked("http://localhost:8421")[1] == "http://localhost:8421", "so may one on localhost"
        assert asked("http://evil.example")[1] is None, "a page from anywhere else may not"
        assert asked("http://127.0.0.1:8421", "OPTIONS")[:2] == (204, "http://127.0.0.1:8421"), "a JSON post's preflight is answered"
        call("POST", "/api/main/plugin", {"title": "Workflows", "actor": "system", "enabled": True,
                                          "manifest": {"name": "works", "chat": [{"find": "WF-(\\d+)", "as": "[workflow \\1](#/wf/\\1)"}]}})
        code, said = call("POST", "/api/main/message", {"title": "a run", "brief": "see WF-42 for the run", "actor": "user"})
        assert (code, said["brief"]) == (201, "see [workflow 42](#/wf/42) for the run"), "a plugin's chat rule shapes the text the viewer is given"
        code, tagged = call("POST", "/api/main/message", {"title": "a reply", "brief": "[!reply] done, pushed", "actor": "agent"})
        assert (code, tagged["brief"]) == (201, "done, pushed"), "a tag is stripped on the way to the viewer"
        assert (root / f"environments/main/message/{tagged['n']:03d}.md").read_text().strip().endswith("[!reply] done, pushed") is True, \
            "and the record keeps it"
    finally:
        server.shutdown()
