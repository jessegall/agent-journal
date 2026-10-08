from engine.events.engine import Measured
from engine.events.resources import ResourceCreated
from features.dev_faults.reports import BUDGET
from features.parts import Context, Handler
from controllers.types import Notifications
from resources.base import SYSTEM


class ReportSlow(Handler):
    def handle(self, context: Context, event: Measured) -> None:
        context.feature.reports.spent(event.root, event.env, event.kind, event.target, event.took, event.working, event.profile, event.garbage, event.waiting,
                                     event.after, event.whole_reads)


class LiftOverdueHold(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "todo":
            return
        for fault in Notifications(context.record, actor=SYSTEM).rows.standing():
            if fault.data.get("kind") in BUDGET:
                context.feature.reports.settle(context.record, fault.title)
