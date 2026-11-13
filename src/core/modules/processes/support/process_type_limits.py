from collections.abc import Sequence

from core.modules.processes.models.process import Process
from core.modules.processes.support.process_type_admission import ProcessTypeAdmission


class ProcessTypeLimits:
    """The limits of the declared kinds of run for one pass of the queue, read once for the runs that wait. A module
    that declares kinds of run, such as the plugins module, binds its own answer."""

    def admissions(self, waiting: Sequence[Process]) -> ProcessTypeAdmission:
        return ProcessTypeAdmission()
