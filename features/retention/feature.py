import time

from controllers.types import CONTROLLERS
from features import trigger
from features.base import Feature, event
from resources.base import SYSTEM, USER


class Retention(Feature):
    name = "retention"
    title_ = "Retention"
    abstract_ = "Reports age out, finished to-dos are archived and notifications the user has seen are removed, after their keep days, once an hour"
    help_ = "keep.report, keep.todo and keep.notification are days per environment; 0 keeps everything listed."
    trigger = {"every": 60, "unit": trigger.MINUTES}
    keep = {"report": 14, "todo": 7, "notification": 1}
    forgotten = ("notification",)

    @event("agent.updated")
    def sweep(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        for type_, default in self.keep.items():
            days = record.keep.get(type_, default)
            if not days:
                continue
            c = CONTROLLERS[type_](record, actor=SYSTEM)
            cutoff = time.time() - days * 86400
            for r in c._every(deleted=type_ in self.forgotten):
                getattr(self, f"expire_{type_}")(c, r, cutoff, days)

    def expire_report(self, c, r, cutoff: float, days: int) -> None:
        if not r.completed and r.created < cutoff:
            c.complete(r.n, how=f"aged out after {days} days")
        else:
            self.expire_todo(c, r, cutoff, days)

    def expire_todo(self, c, r, cutoff: float, days: int) -> None:
        if r.completed and r.completed < cutoff:
            c.delete(r.n, why=f"archived {days} days after it was closed")

    def expire_notification(self, c, r, cutoff: float, days: int) -> None:
        if USER in r.seen and r.created < cutoff:
            c.force_delete(r.n)
