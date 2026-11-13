"""Measures, for the last minutes of a journal, how often the server log says the database is locked, how long
hooks waited for the journal (median and 95th percentile, main agent against workers and helpers) and how many
hooks the server let through unchecked because another hook held the journal. It only reads."""

import argparse
import sqlite3
import statistics
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

LOCKED_TEXT = "database is locked"
MAIN_ROLE = "main"
REQUEST_ROLES = ("viewer", "cli")
# A hook the server could not check keeps a request row with this exit code and only its event as its line.
UNCHECKED_EXIT_CODE = 2


@dataclass(frozen=True)
class HookWait:
    received_at: datetime
    role: str
    queued_ms: float


@dataclass(frozen=True)
class HookRun:
    ended_at: datetime
    line: str
    exit_code: int

    @property
    def is_unchecked(self) -> bool:
        return self.exit_code == UNCHECKED_EXIT_CODE and " " not in self.line.strip()


@dataclass(frozen=True)
class WaitSummary:
    count: int
    median_ms: float
    p95_ms: float

    @classmethod
    def measured(cls, waits: list[float]) -> "WaitSummary":
        if not waits:
            return cls(0, 0.0, 0.0)
        ordered = sorted(waits)
        return cls(len(ordered), statistics.median(ordered), ordered[max(0, -(-95 * len(ordered) // 100) - 1)])


def stamp(text: str) -> datetime:
    return datetime.fromisoformat(text).astimezone(timezone.utc)


def locked_line_count(log_lines: Iterable[str], start: datetime) -> int:
    """A line without a time of its own, such as a traceback, counts at the time of the stamped line above it."""
    count, line_time = 0, None
    for line in log_lines:
        try:
            line_time = stamp(line.split(" ", 1)[0])
        except ValueError:
            pass
        if line_time is not None and line_time >= start and LOCKED_TEXT in line:
            count += 1
    return count


def hook_wait_summaries(hook_waits: Iterable[HookWait], start: datetime) -> tuple[WaitSummary, WaitSummary]:
    hooks = [wait for wait in hook_waits if wait.received_at >= start and wait.role not in REQUEST_ROLES]
    return (WaitSummary.measured([wait.queued_ms for wait in hooks if wait.role == MAIN_ROLE]),
            WaitSummary.measured([wait.queued_ms for wait in hooks if wait.role != MAIN_ROLE]))


def unchecked_hook_count(hook_runs: Iterable[HookRun], start: datetime) -> int:
    return sum(1 for run in hook_runs if run.ended_at >= start and run.is_unchecked)


def table(locked_lines: int, main_waits: WaitSummary, helper_waits: WaitSummary, unchecked_hooks: int) -> str:
    return f"""measure                              count  median ms  p95 ms
database is locked lines           {locked_lines:>7}
hook wait, main agent              {main_waits.count:>7}  {main_waits.median_ms:>9.0f}  {main_waits.p95_ms:>6.0f}
hook wait, worker or helper        {helper_waits.count:>7}  {helper_waits.median_ms:>9.0f}  {helper_waits.p95_ms:>6.0f}
hooks let through unchecked        {unchecked_hooks:>7}"""


def log_lines(server_log: Path) -> list[str]:
    paths = [server_log.with_name(server_log.name + ".1"), server_log]
    return [line for path in paths if path.is_file() for line in path.read_text(errors="replace").splitlines()]


def stored_hook_waits(connection: sqlite3.Connection, start: datetime) -> list[HookWait]:
    rows = connection.execute(
        "SELECT json_extract(payload, '$.received_at'), coalesce(json_extract(payload, '$.role'), 'main'),"
        " coalesce(json_extract(payload, '$.queued_ms'), 0) FROM hook_requests WHERE json_extract(payload, '$.received_at') >= ?",
        [start.isoformat()]).fetchall()
    return [HookWait(stamp(received_at), role, float(queued_ms)) for received_at, role, queued_ms in rows]


def stored_hook_runs(connection: sqlite3.Connection, start: datetime) -> list[HookRun]:
    rows = connection.execute("SELECT ended_at, line, exit_code FROM request_runs WHERE process_type = 'hook' AND ended_at >= ?",
                              [start.isoformat(timespec="microseconds")]).fetchall()
    return [HookRun(stamp(ended_at), line, exit_code) for ended_at, line, exit_code in rows]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--journal", type=Path, default=Path(".journal"), help="the journal folder")
    parser.add_argument("--minutes", type=int, default=60, help="how many of the last minutes to measure")
    arguments = parser.parse_args()
    start = datetime.now(timezone.utc) - timedelta(minutes=arguments.minutes)
    connection = sqlite3.connect(f"file:{arguments.journal.resolve() / 'version-5.db'}?mode=ro", uri=True, timeout=30)
    main_waits, helper_waits = hook_wait_summaries(stored_hook_waits(connection, start), start)
    print(f"last {arguments.minutes} minutes, from {start.isoformat(timespec='seconds')}")
    print(table(locked_line_count(log_lines(arguments.journal / "runtime" / "server.log"), start), main_waits, helper_waits,
                unchecked_hook_count(stored_hook_runs(connection, start), start)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
