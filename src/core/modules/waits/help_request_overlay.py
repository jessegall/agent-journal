from collections.abc import Sequence

from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.query.queries import Queries
from core.modules.waits.wait import Wait
from core.modules.waits.wait_state import WaitState
from core.modules.waits.wait_type import WaitType
from core.modules.waits.work_ends_wait import WorkEndsWait


class HelpRequestOverlay(Overlay):
    """An open stuck report: the agent is told nothing and its stop goes through, until it uses a tool outside the
    journal or the report is ended."""

    name = "waits.stuck"
    exclusive = True
    delays_lines = True
    rules = [WorkEndsWait]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        waits = self.queries.query(Wait).filter(agent_id=agent_id, state=WaitState.OPEN, type=WaitType.HELP_REQUEST).all_rows()
        return [OpenRow("wait", wait.id, wait.opened_at) for wait in waits]
