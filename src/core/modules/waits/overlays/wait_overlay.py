from collections.abc import Sequence

from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from engine.query.queries import Queries
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.rules.long_wait_rule import LongWaitRule
from core.modules.waits.rules.work_ends_wait_rule import WorkEndsWaitRule


class WaitOverlay(Overlay):
    """An open wait on rows: its rules come first, and while it is open the driver's ordinary rules are
    silent."""

    name = "waits.wait"
    exclusive = True
    rules = [LongWaitRule, WorkEndsWaitRule]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        waits = self.queries.query(Wait).filter(session_agent_id=agent_id, state=WaitState.OPEN, type=WaitType.ROWS).get()
        return [OpenRow("wait", wait.id, wait.opened_at) for wait in waits]
