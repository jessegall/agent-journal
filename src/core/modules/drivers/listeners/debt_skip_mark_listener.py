from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.enums.debt_mark_type import DebtMarkType
from core.modules.drivers.models.enums.debt_mark_variant import DebtMarkVariant
from core.modules.drivers.models.nudge_debt import NudgeDebt

SKIP_FIELD = "skip_reason"


class DebtSkipMarkListener(MarkListener):
    """A line the agent skipped shows in the chat with its reason."""

    module_name = "journal.core.drivers"
    name = "drivers.debt-skip-mark"
    event = "nudge_debt.*"

    def handle(self, event: LoggedEvent) -> None:
        if SKIP_FIELD not in event.data or not event.data[SKIP_FIELD][1]:
            return
        debt = self.queries.query(NudgeDebt).find(event.row_id)
        self.show(event, DebtMarkType.SKIPPED, DebtMarkVariant.SKIPPED, f"Skipped {debt.pays}: {debt.skip_reason}", self.queries.query(Agent).find(debt.agent_id).environment_id, debt.agent_id)
