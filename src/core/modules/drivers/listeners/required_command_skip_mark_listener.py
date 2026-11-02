from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.enums.required_command_mark_type import RequiredCommandMarkType
from core.modules.drivers.models.enums.required_command_mark_variant import RequiredCommandMarkVariant
from core.modules.drivers.models.required_command import RequiredCommand

SKIP_FIELD = "skip_reason"


class RequiredCommandSkipMarkListener(MarkListener):
    """A line the agent skipped shows in the chat with its reason."""

    module_name = "journal.core.drivers"
    name = "drivers.required_command-skip-mark"
    event = "required_command.*"

    def handle(self, event: LoggedEvent) -> None:
        if SKIP_FIELD not in event.data or not event.data[SKIP_FIELD][1]:
            return
        required_command = self.queries.query(RequiredCommand).find(event.row_id)
        self.show(event, RequiredCommandMarkType.SKIPPED, RequiredCommandMarkVariant.SKIPPED, f"Skipped {required_command.required_command}: {required_command.skip_reason}", self.queries.query(Agent).find(required_command.agent_id).environment_id, required_command.agent_id)
