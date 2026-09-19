import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh()
check("no log: no events, and the last id is 0", (record.events(), record.last_event()), ([], 0))
for n in range(1, 3001):
    record.emit("todo", n, "created", AGENT, note="x" * 40)
ids = [e.id for e in record.events()]
check("every event, oldest first, read back across many blocks", (len(ids), ids[:2], ids[-1], ids == sorted(ids)), (3000, [1, 2], 3000, True))
check("since an id: only what came after", [e.id for e in record.events(2995)], [2996, 2997, 2998, 2999, 3000])
check("the last n: the newest n, oldest first", [e.id for e in record.events(last=3)], [2998, 2999, 3000])
check("since and last together: whichever stops first", [e.id for e in record.events(2990, last=4)], [2997, 2998, 2999, 3000])
check("the last id comes from the tail", record.last_event(), 3000)
with (record.home / "events.jsonl").open("a") as fh:
    fh.write("not json\n")
check("a damaged line is skipped", (record.last_event(), [e.id for e in record.events(2999)]), (3000, [3000]))
check("a new event after it still numbers on", record.emit("todo", 1, "updated", AGENT).id, 3001)

done()
