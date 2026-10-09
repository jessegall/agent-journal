from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import Measured
from engine.events.resources import ResourceCreated, ResourceEvent
from features.dev_faults.reports import OVER
from features.parts import Context, Handler
from controllers.types import Todos
from resources.base import SYSTEM


class ReportSlow(Handler):
    def handle(self, context: Context, event: Measured) -> None:
        context.feature.reports.spent(event.root, event.env, event.kind, event.target, event.took, event.working, event.profile, event.garbage, event.waiting,
                                     event.after, event.whole_reads)


class LiftOverdueHold(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "todo":
            return
        title = Todos(context.record, actor=SYSTEM).load(event.n).title
        if OVER in title:
            context.feature.reports.lift(context.record.root, title)


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"


class RestartCountOnClose(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        title = Todos(context.record, actor=SYSTEM).load(event.n).title
        if OVER in title:
            context.feature.reports.restart(context.record.root, title)
