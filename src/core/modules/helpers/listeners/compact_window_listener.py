from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.helpers.support.compact_windows import CompactWindows
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class CompactWindowListener(CommitListener[Moved[Task]]):
    """A task that an agent starts, or that leaves its hands, sets the context size at which that agent's program
    compacts by itself."""

    name = "helpers.compact-window"
    moves = (TaskLifecycle.start, TaskLifecycle.retest, TaskLifecycle.test, TaskLifecycle.release, TaskLifecycle.close, TaskLifecycle.cancel, TaskLifecycle.block)

    def __init__(self, windows: CompactWindows) -> None:
        self.windows = windows

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        holders = {event.row.holder_id, None if event.old_row is None else event.old_row.holder_id}
        for agent_id in sorted(holder for holder in holders if holder is not None):
            self.windows.write(agent_id)
