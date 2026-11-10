from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.tasks.commands.record_task_independence.record_task_independence import RecordTaskIndependence
from core.modules.tasks.models.task import Task


class RecordTaskIndependenceHandler(Handler[RecordTaskIndependence, Task]):
    """Keeps on the task the reason it waits on no other task."""

    command = RecordTaskIndependence

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordTaskIndependence, context: Context) -> Task:
        if not command.reason.strip():
            raise Refusal("say why this task waits on nothing", "give the reason with --why")
        return self.repository.save(replace(self.rows.required(Task, command.task_id), independence_reason=command.reason), context)
