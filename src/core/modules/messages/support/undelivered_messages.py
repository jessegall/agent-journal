
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE

from core.modules.messages.support.undelivered_batch import UndeliveredBatch
LISTED_MESSAGES = 5


class UndeliveredMessages:
    """The user's messages to an agent that a hook which takes lines, or the agent's step, delivers, at most
    five, unless the journal is typing a waiting message into its terminal. Main agents get typed
    notices from the waiting message path. A hook reads its batch once so the notice and delivery agree."""

    def __init__(self, queries: Queries, messages: MessageQuery, request_values: RequestValues, agents: AgentRows) -> None:
        self.queries, self.messages, self.request_values = queries, messages, request_values
        self.agents = agents

    # at a hook that takes lines, or at the agent's step, whose lines wait for the wake that types them
    def batch(self, event: HookEvent | None, agent_id: int) -> UndeliveredBatch | None:
        # read once a hook whatever changes meanwhile: recording a delivery takes the message off this list
        return self.request_values.step_value(f"messages.undelivered:{agent_id}", HookEvent.step_key(event), lambda: self.found(event, agent_id))

    def found(self, event: HookEvent | None, agent_id: int) -> UndeliveredBatch | None:
        if event is None and self.agents.find(agent_id).is_main:
            return None
        if event is not None and (not event.accepts_lines or event.event == HookEventName.TICK):
            return None
        messages = self.messages.oldest_undelivered(agent_id, LISTED_MESSAGES)
        if not messages or self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAITING_MESSAGE_SOURCE, state=AgentLineState.TYPING).exists():
            return None
        return UndeliveredBatch(tuple(messages), self.messages.undelivered(agent_id).count())
