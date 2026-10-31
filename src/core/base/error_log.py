import traceback
from datetime import datetime, timezone

from core.base.journal_home import JournalHome


class ErrorLog:
    """Records unexpected errors in full, so the console can point to them in one line."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.error_log

    def reported(self, argv: list[str], error: BaseException) -> str:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with self.path.open("a") as log_file:
            log_file.write(f"{timestamp} journal {' '.join(argv)}\n{''.join(traceback.format_exception(error))}\n")
        return f"the journal failed: {type(error).__name__}: {error} (written to {self.path})"
