import time

from controllers.types import Agents
from engine.record import Record
from engine.sessions import Sessions
from resources.base import SYSTEM
from resources.types import BUSY, WORKING

OFFLINE, IDLE_STATE, WORKING_STATE, SILENT = "offline", "idle", "working", "silent"
REPORT_WITHIN = 30.0


def agent_state(record: Record, name: str) -> str:
    sessions = Sessions(record.root)
    holder = sessions.holder(name)
    if not holder:
        return OFFLINE
    row = Agents(record, actor=SYSTEM)._titled(holder)
    if row is not None and row.data.get("status") in (BUSY, WORKING):
        return WORKING_STATE
    if (row is None or not row.data.get("event")) and time.time() - sessions.read(holder).since > REPORT_WITHIN:
        return SILENT
    return IDLE_STATE
