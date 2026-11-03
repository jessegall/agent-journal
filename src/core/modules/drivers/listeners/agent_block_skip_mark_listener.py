from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.enums.required_command_mark_type import RequiredCommandMarkType
from core.modules.drivers.models.enums.required_command_mark_variant import RequiredCommandMarkVariant

SKIP_FIELD = "skip_reason"


class AgentBlockSkipMarkListener(MarkListener):
    """A block the agent skipped shows in the chat with its reason."""

    module_name = "journal.core.drivers"
    name = "drivers.agent_block-skip-mark"
    event = "agent_block.*"

    def handle(self, event: LoggedEvent) -> None:
        if SKIP_FIELD not in event.data or not event.data[SKIP_FIELD][1]:
            return
        block = self.queries.query(AgentBlock).find(event.row_id)
        self.show(event, RequiredCommandMarkType.SKIPPED, RequiredCommandMarkVariant.SKIPPED, f"Skipped {block.condition_text}: {block.skip_reason}", self.queries.query(Agent).find(block.agent_id).environment_id, block.agent_id)
