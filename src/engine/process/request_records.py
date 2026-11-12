from engine.enums.process_kind import ProcessKind


class RequestRecords:
    """Keeps a process row for each hook, journal command and viewer request that comes in, from its start to its
    end. With no processes module installed nothing is kept; the processes module binds the rows."""

    def begun(self, kind: ProcessKind, line: str) -> int | None:
        return None

    def ended(self, row_id: int | None, exit_code: int) -> None:
        return None
