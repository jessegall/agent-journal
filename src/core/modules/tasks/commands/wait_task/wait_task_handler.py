from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.tasks.commands.block_task.block_task import BlockTask
from core.modules.tasks.commands.wait_task.wait_task import WaitTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_wait import TaskWait

TARGET_TABLES = {"task": "tasks", "question": "questions", "plan": "plans"}
FINISHED_STATES = ("completed", "cancelled", "answered", "closed")


class WaitTaskHandler(Handler[WaitTask, Task]):
    """Blocks a task on what it waits on: rows that open it once they resolve, a command that opens it once it passes,
    or a reason in words, which is opened by hand."""

    command = WaitTask

    def __init__(self, bus: Bus, queries: Queries, repository: Repository, database: Database) -> None:
        self.bus, self.queries, self.repository, self.database = bus, queries, repository, database

    def handle(self, command: WaitTask, context: Context) -> Task:
        targets = tuple(self.target(text, command.task_id) for text in command.targets)
        if not (command.reason or targets or command.until_command):
            raise Refusal("say what it waits on", "--on task:<n>, --on question:<n> or --on plan:<n>, --until '<command>', or --reason '<words>'")
        reason = command.reason or self.reason(command)
        task = self.bus.dispatch(BlockTask(command.task_id, reason), context)
        for target in targets:
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, target=target), context)
        if command.until_command:
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, command=command.until_command, interval_minutes=command.interval_minutes), context)
        return self.queries.query(Task).find(task.id)

    def waits_on(self, task_id: int, other_id: int) -> bool:
        edges = tuple(self.queries.query(TaskEdge).all_rows())
        seen: set[int] = set()
        waiting = [task_id]
        while waiting:
            current = waiting.pop()
            if current == other_id:
                return True
            if current not in seen:
                seen.add(current)
                waiting += [edge.waits_on_id for edge in edges if edge.task_id == current]
        return False

    def reason(self, command: WaitTask) -> str:
        words = [*(f"waits on {text.replace(':', ' ')}" for text in command.targets), *([f"waits until this passes: {command.until_command}"] if command.until_command else [])]
        return ", ".join(words)

    def target(self, text: str, task_id: int) -> str:
        noun, _, row_id = text.partition(":")
        table = TARGET_TABLES.get(noun)
        if table is None or not row_id.isdigit():
            raise Refusal(f"{text} names nothing to wait on", "write --on task:<n>, --on question:<n> or --on plan:<n>")
        if noun == "task" and int(row_id) == task_id:
            raise Refusal(f"task {task_id} cannot wait on itself", "name another task")
        if noun == "task" and self.waits_on(int(row_id), task_id):
            raise Refusal(f"task {row_id} waits on task {task_id} already, so this would be a loop", "end one of the two waits first")
        rows = self.database.rows(Statement(f"SELECT state FROM {table} WHERE id = ?", [int(row_id)]))
        if not rows:
            raise Refusal(f"{noun} {row_id} does not exist", "name a row that does")
        if rows[0]["state"] in FINISHED_STATES:
            raise Refusal(f"{noun} {row_id} is {rows[0]['state']} already", "nothing waits on it; carry on with the task")
        return f"{table}:{row_id}"
