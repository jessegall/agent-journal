from core.base.command.context import Context
from core.base.caller.caller import Caller
from core.modules.messages.support.work_source_snapshot import WorkSourceSnapshot


class AssignedWorkSources:
    """Reads the source of a current assignment supplied by an installed module."""

    def current(self, context: Context | Caller) -> WorkSourceSnapshot | None:
        return None

    def for_task(self, task_id: int, context: Context | Caller) -> WorkSourceSnapshot | None:
        return None
