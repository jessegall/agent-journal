import time

from controllers.types import Pins, Rules
from resources.base import SYSTEM


def standing(record) -> list:
    return [r for controller in (Rules, Pins) for r in controller(record, actor=SYSTEM).all() if not r.completed]


def owed(record, days: int = 7) -> bool:
    events = record.events()
    since = float(record.cleanup_read_at) or (events[0].at if events else time.time())
    return time.time() - since > days * 86400
