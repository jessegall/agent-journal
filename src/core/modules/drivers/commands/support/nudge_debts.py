from collections.abc import Sequence

from core.base.command.context import Context
from core.base.driver.nudge import Nudge
from core.base.query.queries import Queries
from core.base.query.conditions.is_null import IsNull
from core.base.repository.repository import Repository
from core.modules.drivers.models.nudge_debt import NudgeDebt


class NudgeDebts:
    """Opens a debt for each line said that declares the command paying it, once while it stays open."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def open(self, agent_id: int, nudges: Sequence[Nudge], call_id: int, context: Context) -> None:
        for nudge in nudges:
            if nudge.pays and not self.queries.query(NudgeDebt).filter(agent_id=agent_id, pays=nudge.pays).matching(IsNull("settled_at")).exists():
                self.repository.save(NudgeDebt(agent_id=agent_id, creator_id=context.actor.id, key=nudge.key, line=nudge.text, pays=nudge.pays, opened_call_id=call_id), context)
