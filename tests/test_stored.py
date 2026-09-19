import json
import sys
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.sessions import Sessions  # noqa: E402
from engine.stored import read_json, write_json  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh()
f = record.root / "runtime" / "state.json"

# READ tolerates a missing or broken file
check("a missing file reads as the default", read_json(f, {}), {})
f.parent.mkdir(parents=True, exist_ok=True)
f.write_text('{"a": 1}}')
check("a broken file reads as the default", read_json(f, {}), {})

# WRITERS AT ONCE never leave a broken file behind
def hammer(i):
    for k in range(200):
        write_json(f, {"writer": i, "k": k, "pad": "x" * (i * 50)})
threads = [threading.Thread(target=hammer, args=(i,)) for i in range(6)]
[t.start() for t in threads]
[t.join() for t in threads]
check("after six writers at once the file is whole", isinstance(json.loads(f.read_text()), dict), True)
check("and no spare file is left beside it", [p.name for p in f.parent.iterdir() if p.name.startswith(".state.json")], [])

# SESSIONS are written the same way, so a reader never trips on one
sessions = Sessions(record.root)
sessions.write("s1", environment="main")
threads = [threading.Thread(target=lambda i=i: [sessions.write("s1", seen=float(k), writer=i) for k in range(100)]) for i in range(4)]
[t.start() for t in threads]
[t.join() for t in threads]
check("a session written from many threads still reads back whole", sessions.all()["s1"]["environment"], "main")

# SETTINGS changed at once keep every change
threads = [threading.Thread(target=record.set_setting, args=(f"key{i}", i)) for i in range(8)]
[t.start() for t in threads]
[t.join() for t in threads]
check("eight settings written at once are all kept", sorted(k for k in json.loads((record.home / "settings.json").read_text()) if k.startswith("key")), [f"key{i}" for i in range(8)])

done()
