from collections.abc import Sequence

from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WORK_ENDED_TYPES
from core.modules.waits.rules.work_ends_wait_rule import WorkEndsWaitRule


class HelpRequestOverlay(Overlay):
    """An open stuck report or question: the agent is told nothing and its stop goes through, until it uses a
    tool outside the journal or the wait is ended."""

    name = "waits.stuck"
    exclusive = True
    delays_lines = True
    rules = [WorkEndsWaitRule]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        waits = self.queries.query(Wait).filter(session_agent_id=agent_id, state=WaitState.OPEN).matching(Among("type", WORK_ENDED_TYPES)).get()
        return [OpenRow("wait", wait.id, wait.opened_at) for wait in waits]
