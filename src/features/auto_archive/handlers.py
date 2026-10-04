import time

from controllers.base import CONTROLLERS
from controllers.types import Reports, Todos
from engine.events.engine import ClockTicked
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from features.trigger import DAY
from resources.base import ENVIRONMENT, SYSTEM

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


EXPIRED = ((Reports, 14, expire_report), (Todos, 7, expire_todo))


def expire(record) -> None:
    for controller, default, expired in EXPIRED:
        days = record.keep.get(controller.resource.type, default)
        if not days:
            continue
        rows = controller(record, actor=SYSTEM)
        cutoff = time.time() - days * DAY
        for r in rows._every():
            expired(rows, r, cutoff, days)


def prune(record) -> None:
    for controller in CONTROLLERS.values():
        if controller.resource.kept:
            controller(record, actor=SYSTEM)._prune()


def pack(record) -> None:
    days = record.keep.get("pack", PACK_AFTER)
    if not days:
        return
    for controller in CONTROLLERS.values():
        if controller.resource.scope == ENVIRONMENT and controller.resource.type not in UNPACKED:
            controller(record, actor=SYSTEM)._pack(time.time() - days * DAY)


class ExpireOldRows(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        expire(context.record)
        prune(context.record)
        pack(context.record)
