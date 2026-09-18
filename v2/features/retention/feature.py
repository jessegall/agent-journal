import time

from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.resources.base import SYSTEM


class Retention(Feature):
    name = "retention"
    title_ = "Retention"
    abstract_ = "Reports age out and finished to-dos are archived after their keep days, once an hour"
    help_ = "keep.report and keep.todo are days per environment; 0 keeps everything listed."
    trigger = {"every": 60, "unit": trigger.MINUTES}
    keep = {"report": 14, "todo": 7}

    @on("agent.updated")
    def sweep(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        for type_, default in self.keep.items():
            days = record.setting("keep", {}).get(type_, default)
            if not days:
                continue
            c = CONTROLLERS[type_](record, actor=SYSTEM)
            for r in c.all():
                stale = r.completed and time.time() - r.completed > days * 86400
                old = type_ == "report" and not r.completed and time.time() - r.created > days * 86400
                if old:
                    c.complete(r.n, how=f"aged out after {days} days")
                elif stale:
                    c.delete(r.n, why=f"archived {days} days after it was closed")
