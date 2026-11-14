import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

WINDOW_MINUTES = 5
MAX_WAIT_SECONDS = 30
ROWS_READ = 300


@dataclass(frozen=True)
class QueueWait:
    """One run that waited in the queue: when it joined, how long it waited, and what it ran."""

    queued_at: datetime
    seconds: float
    line: str

    @property
    def ended_at(self) -> datetime:
        return self.queued_at + timedelta(seconds=self.seconds)


def queue_waits(rows: list[dict], now: datetime) -> list[QueueWait]:
    """The runs that waited in the queue; a run still waiting has waited until now."""
    waits = []
    for row in rows:
        if row["queued_at"] is None:
            continue
        queued_at = datetime.fromisoformat(row["queued_at"])
        started_at = datetime.fromisoformat(row["started_at"]) if row["started_at"] else now
        waits.append(QueueWait(queued_at, (started_at - queued_at).total_seconds(), row["line"]))
    return waits


def sustained_waits(waits: list[QueueWait], now: datetime, window_minutes: int = WINDOW_MINUTES, max_wait_seconds: int = MAX_WAIT_SECONDS) -> list[QueueWait]:
    """The longest waits above the limit when, in each minute of the window, some run was waiting above the limit; none otherwise."""
    long_waits = [wait for wait in waits if wait.seconds > max_wait_seconds]
    seen: list[QueueWait] = []
    for minute in range(window_minutes):
        start = now - timedelta(minutes=window_minutes - minute)
        waiting = [wait for wait in long_waits if wait.queued_at < start + timedelta(minutes=1) and wait.ended_at > start]
        if not waiting:
            return []
        seen.extend(waiting)
    return sorted(set(seen), key=lambda wait: wait.seconds, reverse=True)[:3]


def main(journal: str) -> int:
    now = datetime.now(timezone.utc)
    read = subprocess.run([journal, "process", "list", "--json", "--limit", str(ROWS_READ)], capture_output=True, text=True, check=True)
    waits = queue_waits(json.loads(read.stdout)["rows"], now)
    sustained = sustained_waits(waits, now)
    if not sustained:
        longest = max((wait.seconds for wait in waits if wait.ended_at > now - timedelta(minutes=WINDOW_MINUTES)), default=0)
        print(f"no run waited in the queue above {MAX_WAIT_SECONDS} seconds in every minute of the last {WINDOW_MINUTES}; the longest wait in them was {longest:.0f} seconds")
        return 0
    print(f"runs waited in the queue above {MAX_WAIT_SECONDS} seconds in every minute of the last {WINDOW_MINUTES}:")
    for wait in sustained:
        print(f"{wait.seconds:.0f} seconds, queued at {wait.queued_at.isoformat()}: {wait.line}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1] if len(sys.argv) > 1 else "journal"))
