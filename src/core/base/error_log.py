from core.base.file_access import FileAccess
import traceback
from datetime import datetime, timezone

from core.base.exception_sink import ExceptionSink
from core.base.journal_home import JournalHome


class ErrorLog:
    """Records unexpected errors in full, so the console can point to them in one line, and notes a hook the
    journal let through because no row holds its agent."""

    def __init__(self, home: JournalHome, sink: ExceptionSink) -> None:
        self.path, self.sink = home.error_log, sink

    def noted(self, line: str) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(self.path, "a") as log_file:
            log_file.write(f"{datetime.now(timezone.utc).isoformat(timespec='seconds')} {line}\n")

    def reported(self, argv: list[str], error: BaseException, environment_id: int | None = None) -> str:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with FileAccess.shared().writer(self.path, "a") as log_file:
            log_file.write(f"{timestamp} journal {' '.join(argv)}\n{''.join(traceback.format_exception(error))}\n")
        self.recorded(argv, error, environment_id)
        return f"the journal failed: {type(error).__name__}: {error} (written to {self.path})"

    def recorded(self, argv: list[str], error: BaseException, environment_id: int | None) -> None:
        try:
            self.sink.record(" ".join(argv), f"{type(error).__name__}: {error}", environment_id)
        except Exception as failure:
            self.noted(f"an exception could not be recorded as a row: {type(failure).__name__}: {failure}")
