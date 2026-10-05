import time

from controllers.types import Facts, Rules
from resources.base import SYSTEM
from features.trigger import DAY


def standing(record) -> list:
    return [r for controller in (Rules, Facts) for r in controller(record, actor=SYSTEM).rows.standing()]


def owed(record, days: int = 7) -> bool:
    events = record.event_log.events()
    since = float(record.cleanup_read_at) or (events[0].at if events else time.time())
    return time.time() - since > days * DAY
