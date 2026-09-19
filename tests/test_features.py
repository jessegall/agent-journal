import json
import sys
import tempfile
import threading
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import Todos, Works  # noqa: E402
from engine import bus  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from serve import serve  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

# THE LOADER: every folder with handlers.py is a feature, loaded once, registered on the bus
features.unload()
check("nothing loaded: the bus is empty", bus._listeners, {})
loaded = features.load()
check("every feature folder is loaded", loaded, features.names())
check("loading again loads nothing twice", features.load(), loaded)
check("every loaded feature has a test folder", [n for n in loaded if not (Path(__file__).parent / "features" / n).is_dir()], [])
check("every listener is gated by its feature's enabled", all(callable(g) for entries in bus._listeners.values() for g, _ in entries), True)
check("auto mode is a feature off by default; the rest are on", ([n for n, f in features.FEATURES.items() if not f.default]), ["auto"])
from features.base import Feature, REGISTRY  # noqa: E402
check("the registry holds one class per feature, each a Feature", (sorted(REGISTRY), all(issubclass(c, Feature) for c in REGISTRY.values())), (loaded, True))
check("a feature describes itself for a menu: name, words, what it listens to, its trigger", sorted(features.describe()["work"]), ["abstract", "default", "fixed", "help", "listens", "name", "title", "trigger"])
check("the work feature listens to what its methods say", features.describe()["work"]["listens"], ["agent.updated", "work.completed", "work.created", "work.updated"])
r = fresh()
work = features.FEATURES["work"]
check("enabled by default", work.enabled(r), True)
work.disable(r)
check("disable is a setting on the environment", (work.enabled(r), r.setting("features")), (False, {"work": False}))
work.enable(r)
check("enable again", work.enabled(r), True)
from engine.manifest import manifest  # noqa: E402
check("the manifest carries every feature", sorted(manifest()["features"]), loaded)

# THE SWITCH: a feature is off per environment through settings; another environment keeps it
record = fresh()
record.set_setting("features", {"work": False})
todo = Todos(record, actor=USER).create("a row")
work = Works(record, actor=AGENT).create("work", todo=todo.n)
check("a feature switched off in one environment does nothing there", Works(record).load(work.n).refs, [])
other = fresh()
w = Works(other, actor=AGENT).create("work", todo=Todos(other, actor=USER).create("row").n)
check("another environment keeps the feature on", Works(other).load(w.n).refs, ["todo:1"])

# THROUGH HTTP: an event posted to the server reaches the same feature
root = Path(tempfile.mkdtemp())
server = serve(root, 0)
port = server.server_address[1]
threading.Thread(target=server.serve_forever, daemon=True).start()


def post(path, body):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=5) as r:
        return json.loads(r.read())


post("/api/t/todo", {"title": "a row"})
post("/api/t/work", {"title": "the work", "todo": 1, "actor": AGENT})
check("posted through HTTP: the feature linked the work to the to-do", Works(Record(root, "t")).load(1).refs, ["todo:1"])
server.shutdown()

done()
