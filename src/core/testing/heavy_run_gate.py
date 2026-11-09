import atexit
import fcntl
import os
import time
from collections.abc import Callable
from pathlib import Path
from typing import IO

from core.base.process_ids import ProcessIds
from core.base.file_access import FileAccess

GATE_FOLDER = Path(os.environ.get("JOURNAL_HEAVY_GATE_FOLDER", Path.home() / ".cache" / "agent-journal" / "heavy-runs"))
HOLDER_FILE = "holder.lock"
TICKETS_FOLDER = "waiting"
POLL_SECONDS = 0.2
REPEAT_SECONDS = 30


class HeavyRunGate:
    """One heavy run holds the machine's processors at a time and the others wait their turn, in the order
    they came. The holder keeps a lock on a file of the gate's folder, which the system drops when the
    holder ends, however it ends; a waiting run leaves a ticket named for its arrival and its process
    number, and only the oldest live ticket tries the lock."""

    def __init__(self, folder: Path = GATE_FOLDER) -> None:
        self.folder = folder
        self.lock_handle: IO[str] | None = None

    def enter(self, announce: Callable[[str], None]) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        tickets = self.folder / TICKETS_FOLDER
        tickets.mkdir(exist_ok=True)
        mine = tickets / f"{time.time_ns():020d}-{os.getpid()}"
        FileAccess.shared().update_timestamp(mine)
        announced_at, announced_place = 0.0, 0
        try:
            while True:
                waiting = self.active_tickets(tickets)
                place = waiting.index(mine) + 1 if mine in waiting else 1
                if place == 1 and self.try_lock():
                    break
                if place != announced_place or time.monotonic() - announced_at > REPEAT_SECONDS:
                    announce(f"heavy run gate: another heavy run holds the processors, this run waits in place {place}")
                    announced_at, announced_place = time.monotonic(), place
                time.sleep(POLL_SECONDS)
        finally:
            mine.unlink(missing_ok=True)
        atexit.register(self.leave)

    def leave(self) -> None:
        if self.lock_handle is not None:
            fcntl.flock(self.lock_handle, fcntl.LOCK_UN)
            self.lock_handle.close()
            self.lock_handle = None

    def try_lock(self) -> bool:
        lock = os.fdopen(os.open(self.folder / HOLDER_FILE, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644), "a")
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            lock.close()
            return False
        self.lock_handle = lock
        return True

    @staticmethod
    def active_tickets(tickets: Path) -> list[Path]:
        active = []
        for ticket in sorted(tickets.iterdir()):
            if ProcessIds.exists(int(ticket.name.rpartition("-")[2])):
                active.append(ticket)
            else:
                ticket.unlink(missing_ok=True)
        return active
