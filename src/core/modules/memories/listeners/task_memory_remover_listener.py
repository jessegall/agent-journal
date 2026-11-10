from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from collections.abc import Sequence
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.event.moved import Moved
from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
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

    def __init__(self, bus: Bus, queries: Queries, kept: KeptRows) -> None:
        self.bus, self.queries, self.kept = bus, queries, kept

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        task_ids = list(dict.fromkeys(event.row_id for event in events))
        memories = self.queries.query(Memory).filter(state=MemoryState.ACTIVE).matching(Among("task_id", task_ids)).all_rows()
        for task_id in task_ids:
            self.kept.scoped_read("memories", lambda task_id=task_id: tuple(memory for memory in memories if memory.task_id == task_id),
                                  "task_id = ? AND state = ? AND removed_at IS NULL", [task_id, MemoryState.ACTIVE.value], name="memories.task_active")

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        memories = self.kept.scoped_read("memories", lambda: self.queries.query(Memory).filter(task_id=logged.row_id, state=MemoryState.ACTIVE).all_rows(),
                                         "task_id = ? AND state = ? AND removed_at IS NULL", [logged.row_id, MemoryState.ACTIVE.value], name="memories.task_active")
        for memory in memories:
            self.bus.run(RemoveMemory(memory.id, f"task {logged.row_id} ended"), Actor.core(), cause_id=logged.id)
