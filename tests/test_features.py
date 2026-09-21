import json
import threading
import urllib.request
from pathlib import Path

import features
from controllers.types import Todos, Works
from engine import bus
from engine.record import Record
from engine.manifest import manifest
from features.base import Behaviour, Feature, REGISTRY
from resources.base import AGENT, USER
from serve import serve
from tests.conftest import fresh


def test_the_loader_loads_every_feature_folder_once_and_registers_it_on_the_bus():
    features.unload()
    assert bus._listeners == {}, "nothing loaded: the bus is empty"
    loaded = features.load()
    assert loaded == features.names(), "every feature folder is loaded"
    assert features.load() == loaded, "loading again loads nothing twice"
    assert [n for n in loaded if not (Path(__file__).parent / "features" / n).is_dir()] == [], \
        "every loaded feature has a test folder"
    assert all(callable(g) for entries in bus._listeners.values() for g, _ in entries) is True, \
        "every listener is gated by its feature's enabled"
    assert [n for n, f in features.FEATURES.items() if not f.default] == ["auto"], \
        "auto mode is a feature off by default; the rest are on"
    assert (sorted(REGISTRY), all(issubclass(c, Feature) for c in REGISTRY.values())) == (loaded, True), \
        "the registry holds one class per feature, each a Feature"
    assert sorted(features.describe()["work"]) == ["abstract", "behaviours", "default", "fixed", "help", "listens", "name", "title", "trigger"], \
        "a feature describes itself for a menu: name, words, what it listens to, its trigger"
    assert features.describe()["work"]["listens"] == ["agent.created", "agent.updated", "work", "work.completed", "work.created", "work.updated"], \
        "the work feature listens to what its methods say"
    r = fresh()
    work = features.FEATURES["work"]
    assert work.enabled(r) is True, "enabled by default"
    work.disable(r)
    assert (work.enabled(r), r.setting("features")) == (False, {"work": False}), "disable is a setting on the environment"
    work.enable(r)
    assert work.enabled(r) is True, "enable again"
    assert sorted(manifest()["features"]) == loaded, "the manifest carries every feature"

    record = fresh()
    record.set_setting("features", {"work": False})
    todo = Todos(record, actor=USER).create("a row")
    work_row = Works(record, actor=AGENT).create("work", todo=todo.n)
    assert Works(record).load(work_row.n).refs == [], "a feature switched off in one environment does nothing there"
    other = fresh()
    w = Works(other, actor=AGENT).create("work", todo=Todos(other, actor=USER).create("row").n)
    assert Works(other).load(w.n).refs == ["todo:1"], "another environment keeps the feature on"


def test_an_event_posted_through_http_reaches_the_same_feature(tmp_path):
    root = tmp_path
    server = serve(root, 0)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()

    def post(path, body):
        req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=5) as r:
            return json.loads(r.read())

    try:
        post("/api/t/todo", {"title": "a row"})
        post("/api/t/work", {"title": "the work", "todo": 1, "actor": AGENT})
        assert Works(Record(root, "t")).load(1).refs == ["todo:1"], "posted through HTTP: the feature linked the work to the to-do"
    finally:
        server.shutdown()


def test_a_feature_declares_its_settings_one_per_behaviour(tmp_path):
    class Two(Feature):
        name = "two"
        trigger = {"every": 1, "unit": "uses"}
        behaviours = {"loud": Behaviour("Say it", trigger={"every": 50, "unit": "uses"}),
                      "quiet": Behaviour("Do not say it", default=False)}

    two, r = Two(), Record(tmp_path, "t")
    assert (two.keyed(), two.keyed("loud")) == ("two", "two.loud"), "a behaviour is keyed under its feature, the feature under its own name"
    assert (two.on(r, "loud"), two.on(r, "quiet")) == (True, False), "a behaviour with no setting takes the default it declared"
    r.features = {**r.features, "two.loud": False, "two.quiet": True}
    assert (two.on(r, "loud"), two.on(r, "quiet")) == (False, True), "a stored setting wins over the declared default"
    r.features = {**r.features, "two": False}
    assert (two.on(r), two.on(r, "quiet")) == (False, False), "a behaviour is off when its feature is off, whatever it says"
    assert (two.cadence(r, "loud")["every"], two.cadence(r)["every"]) == (50, 1), "a behaviour carries its own cadence, the feature its own"
    assert two.describe()["behaviours"]["quiet"] == {"title": "Do not say it", "abstract": "", "default": False, "trigger": {}}, \
        "a feature hands its behaviours to the viewer"
