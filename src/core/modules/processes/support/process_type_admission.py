from collections.abc import Sequence

from engine.execution.classes.execution_class import ExecutionClass
from core.modules.processes.models.process import Process


class ProcessTypeAdmission:
    """What the kinds of run say during one pass of the queue over its waiting runs: whether a run must wait for
    its kind, given the runs that hold a place now, that a run was just given its place, and the class of each kind.
    A kind nobody declares never holds a run."""

    def is_blocked(self, waiting: Process, running: Sequence[Process]) -> bool:
        return False

    def admitted(self, process: Process) -> None:
        return None

    # the class of each declared kind among the waiting runs, by its plugin and kind; a kind nobody declares has none
    def kind_classes(self) -> dict[tuple[str, str], ExecutionClass]:
        return {}
