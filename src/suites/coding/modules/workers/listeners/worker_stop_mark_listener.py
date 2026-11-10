from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from engine.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.base.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import DisabledScopes
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.worker_stop_detail import WorkerStopDetail
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from core.base.change.event_subscriber import E


class WorkerStopMarkListener(MarkListener[E]):
    """What the marks of a stopped and a stuck worker share: a warning in the main chat that opens the worker and
    says what it was on and what it last wrote."""

    disabled_scopes: ClassVar[DisabledScopes] = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, unfinished: WorkerUnfinishedTasks, detail: WorkerStopDetail, event_rows: EventRows) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.unfinished, self.detail = unfinished, detail

    def show_stop(self, logged: LoggedEvent, worker: Agent, variant: WorkerMarkVariant, move: str, tasks: tuple[Task, ...]) -> None:
        name = worker.given_name or f"Worker {worker.id}"
        detail = self.detail.text(worker, tasks)
        self.show(logged, WorkerMarkType.WORKER, variant, f"{name} {move}", None, AGENTS_TABLE, worker.id, detail=detail, outcome=MarkOutcome.WARNED)
