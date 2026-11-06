from core.base.command.context import Context
from core.modules.messages.support.work_source_snapshot import WorkSourceSnapshot


class AssignedWorkSources:
    """Reads the source of a current assignment supplied by an installed module."""

    def current(self, context: Context) -> WorkSourceSnapshot | None:
        return None
