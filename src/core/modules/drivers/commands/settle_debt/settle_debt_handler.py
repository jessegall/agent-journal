from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.commands.settle_debt.settle_debt import SettleDebt
from core.modules.drivers.models.nudge_debt import NudgeDebt


class SettleDebtHandler(Handler[SettleDebt, NudgeDebt]):
    """Marks a debt settled, once."""

    command = SettleDebt

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SettleDebt, context: Context) -> NudgeDebt:
        debt = self.queries.query(NudgeDebt).find(command.debt_id)
        if debt.settled_at is not None:
            raise Refusal(f"debt {debt.id} is settled already")
        return self.repository.save(replace(debt, settled_at=context.timestamp, skip_reason=command.skip_reason), context)
