from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.nudge_debt import NudgeDebt


@dataclass(frozen=True)
class SettleDebt(Command[NudgeDebt]):
    """Closes a debt: its command ran, or the reason says why it will not."""

    debt_id: int
    skip_reason: str = ""
