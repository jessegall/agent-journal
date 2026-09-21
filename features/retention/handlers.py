import time

from engine.events import AgentUpdated
from features.parts import WHOLE_FEATURE, Context, Handler
from resources.base import USER

KEEP = {"report": 14, "todo": 7, "notification": 1}
FORGOTTEN = ("notification",)
DAY = 86400


class ExpireOldRows(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: AgentUpdated) -> None:
        for type_, default in KEEP.items():
            days = context.record.keep.get(type_, default)
            if not days:
                continue
            rows = getattr(context.journal, f"{type_}s")
            cutoff = time.time() - days * DAY
            for r in rows._every(deleted=type_ in FORGOTTEN):
                getattr(self, f"expire_{type_}")(rows, r, cutoff, days)

    def expire_report(self, rows, r, cutoff: float, days: int) -> None:
        if not r.completed and r.created < cutoff:
            rows.complete(r.n, how=f"aged out after {days} days")
        else:
            self.expire_todo(rows, r, cutoff, days)

    def expire_todo(self, rows, r, cutoff: float, days: int) -> None:
        if r.completed and r.completed < cutoff:
            rows.delete(r.n, why=f"archived {days} days after it was closed")

    def expire_notification(self, rows, r, cutoff: float, days: int) -> None:
        if USER in r.seen and r.created < cutoff:
            rows.force_delete(r.n)
