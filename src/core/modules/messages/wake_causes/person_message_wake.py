from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.wake_cause import WakeCause
from core.modules.messages.queries.message_query import MessageQuery


class PersonMessageWake(WakeCause):
    """A person's message the agent has not been told of, while its program sits at its prompt waiting on background
    work of its own, such as a Monitor (doc 1310 section 6.4): the message wakes it at once, where the agent that
    rests is woken by the stop the message refuses."""

    key = "messages.person-message"
    wakes_mid_turn = True

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def requires_wake(self, view: AgentView) -> bool:
        return view.is_at_prompt and not view.is_resting and self.messages.undelivered(view.agent.agent_id).exists()

    def text(self, view: AgentView) -> str:
        return "A person's message waits: read it"
