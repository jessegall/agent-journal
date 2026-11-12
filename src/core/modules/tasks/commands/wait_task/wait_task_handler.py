from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.tasks.commands.block_task.block_task import BlockTask
from core.modules.tasks.commands.wait_task.wait_task import WaitTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_opener import USER_TARGET
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets


class WaitTaskHandler(Handler[WaitTask, Task]):
    """Blocks a task until its targets resolve, its command passes or someone unblocks it."""

    command = WaitTask

    def __init__(self, bus: Bus, queries: Queries, repository: Repository, targets: TaskWaitTargets) -> None:
        self.bus, self.queries, self.repository, self.targets = bus, queries, repository, targets

    def handle(self, command: WaitTask, context: Context) -> Task:
        targets = tuple(self.target(text, command.task_id) for text in command.targets)
        if command.user_wait and not command.reason.strip():
            raise Refusal("say what the user must do", "--until-user --reason '<words>'")
        if not (command.reason.strip() or targets or command.wait_command):
            raise Refusal("say what it waits on", f"{self.targets.target_help}, --until '<command>', or --reason '<words>'")
        reason = command.reason.strip() or command.wait_reason()
        task = self.bus.dispatch(BlockTask(command.task_id, reason), context)
        if command.user_wait:
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, target=USER_TARGET), context)
        for target in targets:
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, target=target), context)
        if command.wait_command:
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, command=command.wait_command, interval_minutes=command.interval_minutes), context)
        return task

    def reaches_task(self, task_id: int, target_id: int) -> bool:
        visited: set[int] = set()
        waiting = {task_id}
        while waiting:
            if target_id in waiting:
                return True
            visited |= waiting
            waiting = {edge.blocker_id for edge in self.queries.query(TaskEdge).matching(Among("task_id", sorted(waiting))).all_rows()} - visited
        return False

    def target(self, text: str, task_id: int) -> str:
        target_type, _, row_id = text.partition(":")
        if not row_id.isdigit():
            raise Refusal(f"{text} gives nothing to wait on", self.targets.target_help)
        if target_type == "task" and int(row_id) == task_id:
            raise Refusal(f"task {task_id} cannot wait on itself", "name another task")
        if target_type == "task" and self.reaches_task(int(row_id), task_id):
            raise Refusal(f"task {row_id} waits on task {task_id} already, so this would be a loop", "end one of the two waits first")
        return self.targets.target(target_type, int(row_id))
