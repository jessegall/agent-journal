from engine.events.engine import Measured
from features.parts import Context, Handler


class ReportSlow(Handler):
    def handle(self, context: Context, event: Measured) -> None:
        context.feature.reports.spent(event.root, event.env, event.kind, event.target, event.took, event.working, event.profile, event.garbage, event.waiting,
                                     event.after, event.whole_reads)
