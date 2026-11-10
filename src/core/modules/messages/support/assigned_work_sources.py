from core.base.command.context import Context
from engine.caller.caller import Caller
from core.modules.messages.support.work_source_copy import WorkSourceCopy


class AssignedWorkSources:
    """Reads the source of a current assignment supplied by an installed module."""

    def current(self, context: Context | Caller) -> WorkSourceCopy | None:
        return None

    def task_source(self, task_id: int, context: Context | Caller) -> WorkSourceCopy | None:
        return None
