from collections.abc import Sequence

from engine.execution.classes.execution_class import ExecutionClass
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_type_admission import ProcessTypeAdmission


class ProcessTypeLimits:
    """The limits of the declared kinds of run for one pass of the queue, read once for the runs that wait. A module
    that declares kinds of run, such as the plugins module, binds its own answer."""

    def admissions(self, waiting: Sequence[Process]) -> ProcessTypeAdmission:
        return ProcessTypeAdmission()

    # the class of each declared kind among the waiting runs, by its plugin and kind; a kind nobody declares has none
    def kind_classes(self, waiting: Sequence[Process]) -> dict[tuple[str, str], ExecutionClass]:
        return {}
