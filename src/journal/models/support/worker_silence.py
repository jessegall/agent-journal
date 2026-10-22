from dataclasses import dataclass, replace

from journal.support.timeout import Timeout


@dataclass(frozen=True)
class WorkerSilence:
    """How long a worker out may go without a word before its dispatcher is told, since when it counts, and whether this quiet span was told already."""

    timeout: Timeout
    is_reported: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "WorkerSilence":
        return cls(Timeout.parsed(data["timeout"]), bool(data["is_reported"]))

    def started(self, time: float) -> "WorkerSilence":
        return WorkerSilence(self.timeout.started(time))

    def reported(self) -> "WorkerSilence":
        return replace(self, is_reported=True)

    def is_elapsed(self, time: float) -> bool:
        return not self.is_reported and self.timeout.is_elapsed(time)

    def minutes(self) -> int:
        return int(self.timeout.amount // 60)
