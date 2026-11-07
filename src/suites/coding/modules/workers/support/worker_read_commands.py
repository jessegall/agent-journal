from core.modules.processes.support.read_commands import ReadCommands


class WorkerReadCommands(ReadCommands):
    """Adds the coding suite's commands that count as a read."""

    def names(self) -> tuple[str, ...]:
        return (*super().names(), "worker status", "worker logs", "merger next", "proof list")
