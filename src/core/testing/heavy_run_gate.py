import atexit
import fcntl
import os
import time
from collections.abc import Callable
from pathlib import Path
from typing import IO

GATE_FOLDER = Path(os.environ.get("JOURNAL_HEAVY_GATE_FOLDER", Path.home() / ".cache" / "agent-journal" / "heavy-runs"))
HOLDER_FILE = "holder.lock"
TICKETS_FOLDER = "waiting"
POLL_SECONDS = 0.2
REPEAT_SECONDS = 30


class HeavyRunGate:
    """One heavy run holds the machine's processors at a time and the others wait their turn, in the order they came.
    The holder keeps a lock on a file of the gate's folder, which the system drops when the holder ends, however it ends;
    a waiting run leaves a ticket named for its arrival and its process number, and only the oldest live ticket tries
    the lock."""

    def __init__(self, folder: Path = GATE_FOLDER) -> None:
        self.folder = folder
        self.held: IO[str] | None = None

    def enter(self, say: Callable[[str], None]) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        tickets = self.folder / TICKETS_FOLDER
        tickets.mkdir(exist_ok=True)
        mine = tickets / f"{time.time_ns():020d}-{os.getpid()}"
        mine.touch()
        said_at, said_place = 0.0, 0
        try:
            while True:
                waiting = self.live(tickets)
                place = waiting.index(mine) + 1 if mine in waiting else 1
                if place == 1 and self.try_lock():
                    break
                if place != said_place or time.monotonic() - said_at > REPEAT_SECONDS:
                    say(f"heavy run gate: another heavy run holds the processors, this run waits in place {place}")
                    said_at, said_place = time.monotonic(), place
                time.sleep(POLL_SECONDS)
        finally:
            mine.unlink(missing_ok=True)
        atexit.register(self.leave)

    def leave(self) -> None:
        if self.held is not None:
            fcntl.flock(self.held, fcntl.LOCK_UN)
            self.held.close()
            self.held = None

    def try_lock(self) -> bool:
        lock = open(self.folder / HOLDER_FILE, "a")
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            lock.close()
            return False
        self.held = lock
        return True

    @staticmethod
    def live(tickets: Path) -> list[Path]:
        found = []
        for ticket in sorted(tickets.iterdir()):
            if HeavyRunGate.is_alive(int(ticket.name.rpartition("-")[2])):
                found.append(ticket)
            else:
                ticket.unlink(missing_ok=True)
        return found

    @staticmethod
    def is_alive(pid: int) -> bool:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True
