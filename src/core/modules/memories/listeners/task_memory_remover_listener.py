from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.remove_memory.remove_memory import RemoveMemory
from core.modules.memories.models.enums.memory_state import MemoryState
from core.base.change.touched import Touched
from core.modules.tasks.models.task import Task

ENDING_MOVES = ("task.close", "task.cancel")


class TaskMemoryRemoverListener(CommitListener[Touched[Task]]):
    """When a task is closed or cancelled, the memories kept for it are removed, each with the task named
    as the reason."""

    name = "memories.task-memory-remover"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Touched[Task], logged: LoggedEvent) -> None:
        if logged.event not in ENDING_MOVES:
            return
        for memory in self.queries.query(Memory).filter(task_id=logged.row_id, state=MemoryState.ACTIVE).all_rows():
            self.bus.run(RemoveMemory(memory.id, f"task {logged.row_id} ended"), Actor.core(), cause_id=logged.id, environment_id=logged.environment_id)
