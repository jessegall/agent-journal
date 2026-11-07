"""Times one hook's work as the server does it, one transaction of ten indexed reads and one row written, alone and
while five agents write a tick every twenty milliseconds, and prints the median, the 95th percentile and the worst.
Run with PYTHONPATH=src python3 scripts/measure_hook_write.py; it is a measurement, never part of the test run."""
import statistics
import tempfile
import threading
import time
from pathlib import Path

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome

HOOKS = 200
READS_PER_HOOK = 10
TICKING_AGENTS = 5
TICK_INTERVAL_SECONDS = 0.02
CALLS = ("CREATE TABLE hook_calls (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL, data TEXT NOT NULL) STRICT",
         "CREATE INDEX hook_calls_agent ON hook_calls (agent_id, id)")


def opened(folder: Path) -> Database:
    return Database.opened(JournalHome(folder))


def hook_milliseconds(database: Database, agent_id: int) -> float:
    started = time.perf_counter()
    with database.transaction():
        for _ in range(READS_PER_HOOK):
            database.rows(Statement("SELECT id, data FROM hook_calls WHERE agent_id = ? ORDER BY id DESC LIMIT 5", [agent_id]))
        database.update(Statement("INSERT INTO hook_calls (agent_id, data) VALUES (?, ?)", [agent_id, '{"rules": []}']))
    return (time.perf_counter() - started) * 1000


def timed_hooks(folder: Path) -> list[float]:
    database = opened(folder)
    try:
        return [hook_milliseconds(database, 1) for _ in range(HOOKS)]
    finally:
        database.close()


def ticks(folder: Path, agent_id: int, stop: threading.Event) -> None:
    database = opened(folder)
    try:
        while not stop.is_set():
            hook_milliseconds(database, agent_id)
            stop.wait(TICK_INTERVAL_SECONDS)
    finally:
        database.close()


def prepared(folder: Path) -> Path:
    database = opened(folder)
    for statement in CALLS:
        database.update(Statement(statement))
    database.close()
    return folder


def report(label: str, durations: list[float]) -> str:
    ordered = sorted(durations)
    return f"{label}: median {statistics.median(ordered):.3f} ms, p95 {ordered[int(len(ordered) * 0.95)]:.3f} ms, worst {ordered[-1]:.3f} ms"


def measured(ticking: bool) -> list[float]:
    folder, stop = prepared(Path(tempfile.mkdtemp())), threading.Event()
    tickers = [threading.Thread(target=ticks, args=(folder, agent_id, stop), daemon=True) for agent_id in range(2, 2 + TICKING_AGENTS)] if ticking else []
    for ticker in tickers:
        ticker.start()
    try:
        return timed_hooks(folder)
    finally:
        stop.set()
        for ticker in tickers:
            ticker.join(timeout=5)


if __name__ == "__main__":
    print(report("alone", measured(False)))
    print(report(f"{TICKING_AGENTS} ticking agents", measured(True)))
