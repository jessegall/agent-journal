import statistics
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
MEDIAN_BUDGET_MILLISECONDS = 5.0
WORST_BUDGET_MILLISECONDS = 50.0
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


def test_one_hook_of_ten_reads_and_one_write_stays_inside_its_budget_alone(tmp_path):
    durations = timed_hooks(prepared(tmp_path))
    assert statistics.median(durations) < MEDIAN_BUDGET_MILLISECONDS and max(durations) < WORST_BUDGET_MILLISECONDS, (statistics.median(durations), max(durations))


def test_one_hook_stays_inside_its_budget_while_five_agents_tick_every_twenty_milliseconds(tmp_path):
    folder, stop = prepared(tmp_path), threading.Event()
    tickers = [threading.Thread(target=ticks, args=(folder, agent_id, stop), daemon=True) for agent_id in range(2, 2 + TICKING_AGENTS)]
    for ticker in tickers:
        ticker.start()
    try:
        durations = timed_hooks(folder)
    finally:
        stop.set()
        for ticker in tickers:
            ticker.join(timeout=5)
    assert statistics.median(durations) < MEDIAN_BUDGET_MILLISECONDS and max(durations) < WORST_BUDGET_MILLISECONDS, (statistics.median(durations), max(durations))
