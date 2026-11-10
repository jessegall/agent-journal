from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE


class MergerAskMarkListener(MarkListener[Created[Message]]):
    """A message from the merger to the main agent shows in the chat, so a person can see that it asked."""

    name = "workers.merger-ask-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.session_agent_id is None or message.target_agent_id is not None:
            return
        sender = self.event_rows.required(Agent, message.session_agent_id)
        if sender.profile == MERGER_PROFILE:
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.MERGER_QUESTION, "The merger asks the main agent", None, AGENTS_TABLE, sender.id, detail=message.text)
