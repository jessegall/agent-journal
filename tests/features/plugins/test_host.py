import json
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Nudges, Plugins, Todos  # noqa: E402
from features.plugins.host import Host  # noqa: E402
from features.plugins.source import folder, home, log  # noqa: E402
from resources.base import AGENT, PLUGIN, SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def installed(record, manifest: dict, handler: str = "") -> object:
    where = folder(record.root, manifest["name"])
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    if handler:
        (where / "handler.sh").write_text(handler)
    return Plugins(record, actor=SYSTEM).create(manifest["name"], manifest=manifest, enabled=True, token="t0ken", settings={})


record = fresh()
Agents(record, actor=SYSTEM).by_session("claude-1")
seen = folder(record.root, "works") / "seen.jsonl"
installed(record, {"name": "works", "on": {"todo.created": {"run": "sh handler.sh"}}},
          handler=f"cat >> {seen}\necho '{{\"whisper\": \"a row was filed\"}}'\n")
host = Host(record.root)
todos = Todos(record, actor=AGENT)

# THE FIRST STEP takes the cursor to the end: nothing that happened before is replayed
todos.create("before the plugin was listening")
check("nothing old is delivered on the first step", (host.step(), seen.exists()), (0, False))

# FROM THEN ON, every matching event reaches the plugin, and its answer is applied
made = todos.create("fix the header")
check("the matching event is delivered once", (host.step(), host.step()), (1, 0))
payload = json.loads(seen.read_text().splitlines()[0])
check("the plugin is handed the event and the row", (payload["event"], payload["n"], payload["resource"]["title"]), ("todo.created", made.n, "fix the header"))
check("its answer was applied", [n.brief for n in Nudges(record).all()], ["a row was filed"])

# AN EVENT IT DOES NOT LISTEN TO is passed over, and the cursor still moves
todos.update(made.n, brief="still wrapping")
check("an event with no handler is passed over, and nothing more reaches the plugin", (host.step(), len(seen.read_text().splitlines())), (0, 1))

# WHAT THE PLUGIN ITSELF WROTE never goes back to it
Todos(record, actor=PLUGIN).create("filed by the plugin", plugin="works")
host.step()
check("the plugin's own row is not sent back to it", len(seen.read_text().splitlines()), 1)

# A HANDLER THAT FAILS is logged, and the cursor still moves on
noisy = fresh("noisy")
installed(noisy, {"name": "noisy", "on": {"todo.created": {"run": "sh handler.sh"}}}, handler="echo boom >&2; exit 1\n")
loud = Host(noisy.root)
Todos(noisy, actor=AGENT).create("one")
loud.step()
Todos(noisy, actor=AGENT).create("two")
check("a failing handler is written to the plugin's log and does not stop the next event", (loud.step(), "boom" in log(noisy.root, "noisy").read_text()), (1, True))

# EVENTS OLDER THAN THE REPLAY WINDOW are passed over after the viewer was down
old = fresh("old")
installed(old, {"name": "late", "on": {"todo.created": {"run": "sh handler.sh"}}}, handler=f"echo delivered >> {folder(old.root, 'late') / 'late.txt'}\n")
Todos(old, actor=AGENT).create("one")
waited = Host(old.root, replay=60)
waited.step()
Todos(old, actor=AGENT).create("two")
waited.step(now=time.time() + 3600)
check("an event older than the window is skipped, not delivered late", (folder(old.root, "late") / "late.txt").exists(), False)

# A POST HANDLER is delivered over HTTP, and the cursor waits while the service is down
calls = []


class Service(BaseHTTPRequestHandler):
    def do_POST(self):
        calls.append(json.loads(self.rfile.read(int(self.headers["Content-Length"]))))
        body = json.dumps({"todo": {"title": "asked for by the service"}}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        return


posted = fresh("posted")
server = ThreadingHTTPServer(("127.0.0.1", 0), Service)
threading.Thread(target=server.serve_forever, daemon=True).start()
port = server.server_address[1]
rows = Todos(posted, actor=AGENT)
down = Host(posted.root)
installed(posted, {"name": "over-http", "on": {"todo.created": {"post": f"http://127.0.0.1:{port + 1}/journal/events"}}})
down.step()
rows.create("while the service is down")
check("a post to a service that is down delivers nothing and keeps the cursor", (down.step(), posted.cursor("plugin-over-http") < posted.last_event()), (0, True))
Plugins(posted, actor=SYSTEM).update(1, manifest={"name": "over-http", "on": {"todo.created": {"post": f"http://127.0.0.1:{port}/journal/events"}}})
check("once it answers, the event arrives and its answer is applied", (down.step(), [c["resource"]["title"] for c in calls], [t.title for t in rows.all() if t.seen == [PLUGIN]]),
      (1, ["while the service is down"], ["asked for by the service"]))
server.shutdown()

done()
