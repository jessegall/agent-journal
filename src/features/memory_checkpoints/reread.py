import time

from controllers.types import Facts, Rules
from resources.base import SYSTEM
from features.trigger import DAY

STATE, READ_AT = "memory_checkpoints", "cleanup_read_at"


def standing(record) -> list:
    return [r for controller in (Rules, Facts) for r in controller(record, actor=SYSTEM).rows.standing()]


def owed(record, days: int = 7) -> bool:
    since = float(record.state(STATE).get(READ_AT, 0)) or record.event_log.started_at()
    return time.time() - since > days * DAY
