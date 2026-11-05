from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.base.change.moved import Moved
from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.remove_memory.remove_memory import RemoveMemory
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.tasks.models.task import Task



class TaskMemoryRemoverListener(CommitListener[Moved[Task]]):
    """When a task is closed or cancelled, the memories kept for it are removed, each with the task named
    as the reason."""

    name = "memories.task-memory-remover"
    disabled_scopes = [ActorScope]
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        for memory in self.queries.query(Memory).filter(task_id=logged.row_id, state=MemoryState.ACTIVE).all_rows():
            self.bus.run(RemoveMemory(memory.id, f"task {logged.row_id} ended"), Actor.core(), cause_id=logged.id)
