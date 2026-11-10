from dataclasses import dataclass
from enum import StrEnum

from core.base.command.move_command import MoveCommand
from core.base.database.migration import Migration
from engine.guard.guard import Guard
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.base.change.deleted import Deleted


class SignoffState(StrEnum):
    REQUESTED = "requested"
    PASSED = "passed"
    FAILED = "failed"


class SignoffLifecycle(Lifecycle):
    states = SignoffState
    initial = [SignoffState.REQUESTED]
    editable = [SignoffState.REQUESTED]
    deletable = [SignoffState.REQUESTED]

    passed = Move("passed", [SignoffState.REQUESTED], SignoffState.PASSED)
    failed = Move("failed", [SignoffState.REQUESTED], SignoffState.FAILED)


@dataclass(frozen=True, kw_only=True)
class Signoff(Model):
    """A request that a task's work be signed off, and its result."""

    model_name = "signoff"
    cli_name = "signoff"
    lifecycle = SignoffLifecycle

    task_id: int
    creator_id: int
    state: SignoffState = SignoffState.REQUESTED
    note: str = ""


@dataclass(frozen=True)
class SignoffFailed(MoveCommand[Signoff]):
    move = SignoffLifecycle.failed
    note: str


class SignoffsTable(Migration):
    number = 1
    statements = (
        "CREATE TABLE signoffs (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'requested', note TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX signoffs_task_state ON signoffs (task_id, state)",
    )


class SignedTaskGuard(Guard[Moved[Task]]):
    """A task with a signoff requested closes only once the signoff has passed."""

    name = "signoffs.task-closes-after-its-signoff"
    moves = tuple([TaskLifecycle.close])

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Moved[Task], context: Context) -> None:
        if self.queries.query(Signoff).filter(task_id=event.row.id, state=SignoffState.REQUESTED).exists():
            raise Refusal(f"task {event.row.id} waits for its signoff", f"journal signoff list --task {event.row.id}")


class ForgetTaskSignoffs(DeletionListener[Deleted[Task]]):
    """Removes a task's signoffs before the task is deleted."""

    name = "signoffs.forget-task-signoffs"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Task], context: Context) -> None:
        for signoff in tuple(self.queries.query(Signoff).filter(task_id=event.row.id).all_rows()):
            self.repository.delete(signoff, context)


class SignoffsModule(Module):
    name = "signoffs"
    requires_core = ">=5.0,<6"
    dependencies = ["journal.core.tasks"]
    models = [ModelDeclaration(Signoff, commands=[SignoffFailed])]
    migrations = [SignoffsTable]
    guards = [SignedTaskGuard]
    listeners = [ForgetTaskSignoffs]
