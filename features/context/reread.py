import time

from controllers.types import Facts, Rules
from resources.base import SYSTEM


def standing(record) -> list:
    return [r for controller in (Rules, Facts) for r in controller(record, actor=SYSTEM)._standing()]


def owed(record, days: int = 7) -> bool:
    events = record.events()
    since = float(record.cleanup_read_at) or (events[0].at if events else time.time())
    return time.time() - since > days * 86400
