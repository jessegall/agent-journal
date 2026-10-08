import re
from pathlib import Path

from controllers.base import CONTROLLERS
from controllers.stored import INDEX, PACKED
from engine.numbers import EVENTS, FOLDER, Leases, rows
from engine.record import Record
from engine.stored import read_json, write_json
from resources.base import PROJECT, SYSTEM

ROW = re.compile(r"(\d+)(\.md)?")


def run(root: Path) -> str:
    root = Path(root)
    leases = Leases(root)
    records = Record.every(root)
    seeded = 0
    for scope, folder in [(PROJECT, root / PROJECT), *((record.env, record.home) for record in records)]:
        for kind in (f for f in folder.glob("*") if f.is_dir() and f.name != FOLDER):
            highest = highest_number(kind)
            if highest:
                leases.seed(rows(scope, kind.name), highest + 1)
                seeded += 1
    last_events = [record.event_log.last_id() for record in records]
    leases.seed(EVENTS, max(last_events, default=0) + 1)
    dated = sum(dated_packs(record) for record in records)
    return f"{seeded} row numberings and the event numbering continue from the highest number in use; {dated} packed rows carry the time they were made"


def highest_number(kind: Path) -> int:
    loose = [int(m.group(1)) for f in kind.iterdir() if (m := ROW.fullmatch(f.name))]
    packed = [int(n) for n in read_json(kind / PACKED / INDEX, dict, {})]
    return max(loose + packed, default=0)


def dated_packs(record: Record) -> int:
    dated = 0
    for controller in CONTROLLERS.values():
        store = controller(record, actor=SYSTEM).rows
        index_file = store.folder() / PACKED / INDEX
        index = read_json(index_file, dict, {})
        undated = [n for n, entry in index.items() if "created" not in entry]
        for n in undated:
            index[n] = {**index[n], "created": store.peek(int(n)).created}
        if undated:
            write_json(index_file, index)
            dated += len(undated)
        store.summaries()
    return dated
