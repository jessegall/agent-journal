import time

from engine.events import ClockTicked
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from controllers.base import CONTROLLERS
from resources.base import ENVIRONMENT, SYSTEM, USER

KEEP = {"report": 14, "todo": 7}
PACK_AFTER = 30
UNPACKED = ("agent", "feature")
DAY = 86400


PRUNABLE = {"": lambda r: True, "seen": lambda r: USER in r.seen, "closed": lambda r: bool(r.completed)}


def prune(rows) -> None:
    prunable = sorted((r for r in rows._every(deleted=True) if PRUNABLE[rows.resource.pruned_when](r)), key=lambda r: r.created, reverse=True)
    for r in prunable[rows.resource.kept:]:
        rows.force_delete(r.n)


class ExpireOldRows(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        for type_, default in KEEP.items():
            days = context.record.keep.get(type_, default)
            if not days:
                continue
            rows = getattr(context.journal, f"{type_}s")
            cutoff = time.time() - days * DAY
            for r in rows._every():
                getattr(self, f"expire_{type_}")(rows, r, cutoff, days)
        for controller in CONTROLLERS.values():
            if controller.resource.kept:
                prune(controller(context.record, actor=SYSTEM))
        days = context.record.keep.get("pack", PACK_AFTER)
        if days:
            for controller in CONTROLLERS.values():
                if controller.resource.scope == ENVIRONMENT and controller.resource.type not in UNPACKED:
                    controller(context.record, actor=SYSTEM)._pack(time.time() - days * DAY)

    def expire_report(self, rows, r, cutoff: float, days: int) -> None:
        if not r.completed and r.created < cutoff:
            rows.complete(r.n, how=f"aged out after {days} days")
        else:
            self.expire_todo(rows, r, cutoff, days)

    def expire_todo(self, rows, r, cutoff: float, days: int) -> None:
        if r.completed and r.completed < cutoff:
            rows.delete(r.n, why=f"archived {days} days after it was closed")


