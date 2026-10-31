class FaultSink:
    """Where a fault goes besides the error log file; this one keeps nothing, and a module that shows faults replaces it."""

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        return

    def flush(self) -> None:
        return
