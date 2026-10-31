from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.memories.memory import Memory
from core.modules.memories.memory_remove import MemoryRemove
from core.modules.memories.memory_state import MemoryState

ENDING_MOVES = ("task.close", "task.cancel")


class TaskMemoryRemover(CommitListener):
    """When a task is closed or cancelled, the memories kept for it are removed, each with the task named as the
    reason."""

    name = "memories.task-memory-remover"
    event = "task.*"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in ENDING_MOVES:
            return
        for memory in self.queries.query(Memory).filter(task_id=event.row_id, state=MemoryState.ACTIVE).all_rows():
            self.bus.run(MemoryRemove(memory.id, f"task {event.row_id} ended"), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
