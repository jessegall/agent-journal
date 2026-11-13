from collections.abc import Sequence

from core.modules.processes.models.process import Process


class ProcessTypeAdmission:
    """What the kinds of run say during one pass of the queue over its waiting runs: whether a run must wait for
    its kind, given the runs that hold a place now, and that a run was just given its place. A kind nobody
    declares never holds a run."""

    def is_blocked(self, waiting: Process, running: Sequence[Process]) -> bool:
        return False

    def admitted(self, process: Process) -> None:
        return None
