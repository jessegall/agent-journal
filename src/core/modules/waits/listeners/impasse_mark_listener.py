from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.waits.models.enums.wait_mark_type import WaitMarkType
from core.modules.waits.models.enums.wait_mark_variant import WaitMarkVariant
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait


class ImpasseMarkListener(MarkListener):
    """When an agent reports it is stuck, the chat shows an impasse mark with the reason it gave."""

    name = "waits.impasse-mark"
    event = "wait.create"
    module_name = "journal.core.waits"

    def handle(self, event: LoggedEvent) -> None:
        wait = self.queries.query(Wait).find(event.row_id)
        if wait.type is WaitType.HELP_REQUEST:
            environment_id = self.queries.query(Agent).find(wait.agent_id).environment_id
            self.show(event, WaitMarkType.IMPASSE, WaitMarkVariant.STUCK, f"Stuck: {wait.focus}", environment_id, wait.agent_id, "wait", wait.id)
