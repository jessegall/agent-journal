from dataclasses import dataclass
from enum import StrEnum

from core.base.change.change import Change
from core.base.command.move_command import MoveCommand
from core.base.database.migration import Migration
from core.base.guard.guard import Guard
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.module.module import Module
from core.base.module.noun import Noun
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository


class ReviewState(StrEnum):
    REQUESTED = "requested"
    PASSED = "passed"
    FAILED = "failed"


class ReviewLifecycle(Lifecycle):
    states = ReviewState
    initial = (ReviewState.REQUESTED,)
    editable = (ReviewState.REQUESTED,)
    deletable = (ReviewState.REQUESTED,)

    passed = Move("passed", (ReviewState.REQUESTED,), ReviewState.PASSED)
    failed = Move("failed", (ReviewState.REQUESTED,), ReviewState.FAILED)


@dataclass(frozen=True, kw_only=True)
class Review(Model):
    """A request that a task's work be reviewed, and its verdict."""

    model_name = "review"
    cli_noun = "review"
    lifecycle = ReviewLifecycle

    task_id: int
    creator_id: int
    state: ReviewState = ReviewState.REQUESTED
    note: str = ""


@dataclass(frozen=True)
class ReviewFailed(MoveCommand[Review]):
    move = ReviewLifecycle.failed
    note: str


class ReviewsTable(Migration):
    number = 1
    statements = (
        "CREATE TABLE reviews (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'requested', note TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )


class ReviewedTaskGuard(Guard):
    """A task with a review requested closes only once the review has passed."""

    name = "reviews.task-closes-after-its-review"
    event = "task.close"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        if self.queries.query(Review).filter(task_id=change.row.id, state=ReviewState.REQUESTED).exists():
            raise Refusal(f"task {change.row.id} waits for its review", f"journal review list --task {change.row.id}")


class ForgetTaskReviews(DeletionListener):
    """Removes a task's reviews before the task is deleted."""

    name = "reviews.forget-task-reviews"
    event = "task.delete"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        for review in tuple(self.queries.query(Review).filter(task_id=change.row.id).all_rows()):
            self.repository.delete(review, change.context)


class ReviewsModule(Module):
    name = "reviews"
    requires_core = ">=5.0,<6"
    dependencies = ("tasks",)
    nouns = (Noun(Review, commands=("tests.stories.plugins.samples:ReviewFailed",)),)
    migrations = ("tests.stories.plugins.samples:ReviewsTable",)
    guards = ("tests.stories.plugins.samples:ReviewedTaskGuard",)
    listeners = ("tests.stories.plugins.samples:ForgetTaskReviews",)
