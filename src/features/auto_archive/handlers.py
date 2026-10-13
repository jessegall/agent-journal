from controllers.types import CONTROLLERS
from declaring.trigger import DAY
from events import Fact
from events.agents import ClockTicked
from receiving import Handler
from resources.base import ENVIRONMENT
from resources.types import Report, Todo
from serving import Clock, Elsewhere, Rows

PACK_AFTER = 3
UNPACKED = ("agent", "feature")


def expire_report(rows, r, cutoff: float, days: int) -> None:
    if not r.completed and r.created < cutoff:
        rows.complete(r.n, how=f"aged out after {days} days")
    else:
        expire_todo(rows, r, cutoff, days)


def expire_todo(rows, r, cutoff: float, days: int) -> None:
    if r.completed and r.completed < cutoff:
        rows.delete(r.n, why=f"archived {days} days after it was closed")


class ExpireOldRows(Handler[ClockTicked]):
    def handle(self, event: ClockTicked, reports: Rows[Report], todos: Rows[Todo], elsewhere: Elsewhere, clock: Clock) -> list[Fact]:
        here, now = elsewhere.here(), clock.now()
        keep = here.setting("keep") or {}
        for rows, default, expired in ((reports, 14, expire_report), (todos, 7, expire_todo)):
            days = keep.get(rows.resource.type, default)
            for r in rows.rows.every() if days else ():
                expired(rows, r, now - days * DAY, days)
        for name, controller in CONTROLLERS.items():
            if controller.resource.kept:
                here.rows_named(name).prune_kept()
        packing = keep.get("pack", PACK_AFTER)
        for name, controller in CONTROLLERS.items():
            if packing and controller.resource.scope == ENVIRONMENT and controller.resource.type not in UNPACKED:
                here.rows_named(name).rows.pack(now - packing * DAY)
        return []
