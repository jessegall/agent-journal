import traceback
from datetime import datetime, timezone

from core.base.journal_home import JournalHome


class FaultLog:
    """Where a fault nobody expected is written whole, with its traceback, so the console can print one line that
    names it."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.fault_log

    def reported(self, argv: list[str], fault: BaseException) -> str:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with self.path.open("a") as log_file:
            log_file.write(f"{timestamp} journal {' '.join(argv)}\n{''.join(traceback.format_exception(fault))}\n")
        return f"the journal failed: {type(fault).__name__}: {fault} (written to {self.path})"
