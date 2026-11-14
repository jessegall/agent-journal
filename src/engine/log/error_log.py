import traceback

from engine.log.exception_sink import ExceptionSink
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter


class ErrorLog:
    """Records an unexpected error in full in the system log and as a row, so the console can point to it in one
    line."""

    def __init__(self, system_log: SystemLogWriter, sink: ExceptionSink) -> None:
        self.system_log, self.sink = system_log, sink

    def reported(self, argv: list[str], error: BaseException, environment_id: int | None = None) -> str:
        self.system_log.write(LogLevel.ERROR, f"journal {' '.join(argv)}\n{''.join(traceback.format_exception(error))}")
        self.recorded(argv, error, environment_id)
        return f"the journal failed: {type(error).__name__}: {error} (written to {self.system_log.path})"

    def recorded(self, argv: list[str], error: BaseException, environment_id: int | None) -> None:
        try:
            self.sink.record(" ".join(argv), f"{type(error).__name__}: {error}", environment_id)
        except Exception as failure:
            self.system_log.write(LogLevel.ERROR, f"an exception could not be recorded as a row: {type(failure).__name__}: {failure}")
