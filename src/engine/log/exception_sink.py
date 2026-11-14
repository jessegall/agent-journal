CLOCK_TICK_SOURCE = "clock tick"


class ExceptionSink:
    """Where an exception goes besides the error log file; this one keeps nothing, and a module that shows
    exceptions replaces it."""

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        return

    def flush(self) -> None:
        return
