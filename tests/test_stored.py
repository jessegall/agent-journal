import json
import threading

from engine.sessions import Sessions
from engine.stored import read_json, write_json
from tests.conftest import fresh


def test_reads_tolerate_a_missing_or_broken_file():
    record = fresh()
    f = record.root / "runtime" / "state.json"
    assert read_json(f, {}) == {}, "a missing file reads as the default"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text('{"a": 1}}')
    assert read_json(f, {}) == {}, "a broken file reads as the default"


def test_writers_at_once_never_leave_a_broken_file_behind():
    record = fresh()
    f = record.root / "runtime" / "state.json"
    f.parent.mkdir(parents=True, exist_ok=True)

    def hammer(i):
        for k in range(200):
            write_json(f, {"writer": i, "k": k, "pad": "x" * (i * 50)})

    threads = [threading.Thread(target=hammer, args=(i,)) for i in range(6)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert isinstance(json.loads(f.read_text()), dict) is True, "after six writers at once the file is whole"
    assert [p.name for p in f.parent.iterdir() if p.name.startswith(".state.json")] == [], "and no spare file is left beside it"


def test_sessions_are_written_the_same_way_so_a_reader_never_trips():
    record = fresh()
    sessions = Sessions(record.root)
    sessions.write("s1", environment="main")
    threads = [threading.Thread(target=lambda i=i: [sessions.write("s1", seen=float(k), writer=i) for k in range(100)]) for i in range(4)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert sessions.all()["s1"]["environment"] == "main", "a session written from many threads still reads back whole"


def test_settings_changed_at_once_keep_every_change():
    record = fresh()
    threads = [threading.Thread(target=record.set_setting, args=(f"key{i}", i)) for i in range(8)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert sorted(k for k in json.loads((record.home / "settings.json").read_text()) if k.startswith("key")) == [f"key{i}" for i in range(8)], \
        "eight settings written at once are all kept"
