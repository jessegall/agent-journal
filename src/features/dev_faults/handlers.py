
from events.measured import Measured
from events.resources import ResourceCreated
from features.dev_faults.reports import OVER
from features.parts import Context, Handler
from controllers.types import Todos
from resources.base import SYSTEM
from events.todos import TodoCompleted


class ReportSlow(Handler):
    def handle(self, context: Context, event: Measured) -> None:
        context.feature.reports.spent(event.root, event.env, event.kind, event.target, event.took, event.working, event.profile, event.garbage, event.waiting,
                                     event.after, event.whole_reads, event.stacks, event.request, event.within)


class LiftOverdueHold(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "todo":
            return
        title = Todos(context.record, actor=SYSTEM).load(event.n).title
        if OVER in title:
            context.feature.reports.lift(context.record.root, title)


class RestartCountOnClose(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        title = Todos(context.record, actor=SYSTEM).load(event.n).title
        if OVER in title:
            context.feature.reports.restart(context.record.root, title)
