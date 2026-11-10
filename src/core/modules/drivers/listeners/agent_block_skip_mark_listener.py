from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.enums.required_command_mark_type import RequiredCommandMarkType
from core.modules.drivers.models.enums.required_command_mark_variant import RequiredCommandMarkVariant
from engine.event.changed import Changed

SKIP_FIELD = "skip_reason"


class AgentBlockSkipMarkListener(MarkListener[Changed[AgentBlock]]):
    """A block the agent skipped shows in the chat with its reason."""

    module_name = "journal.core.drivers"
    name = "drivers.agent_block-skip-mark"

    def handle(self, event: Changed[AgentBlock], logged: LoggedEvent) -> None:
        if SKIP_FIELD not in logged.data or not logged.data[SKIP_FIELD][1]:
            return
        block = event.row
        self.show(logged, RequiredCommandMarkType.SKIPPED, RequiredCommandMarkVariant.SKIPPED, f"Skipped {block.condition_text}: {block.skip_reason}", block.session_agent_id)
