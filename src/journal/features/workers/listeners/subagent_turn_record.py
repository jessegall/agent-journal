from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.workers.support.subagent_chat import SubagentChat
from journal.repositories.subagents import Subagents


class SubagentTurnRecord(AgentListener[AgentEvent]):
    """At each of a subagent's hooks, its end among them, after the hook is answered, the text it wrote since the last read becomes its messages, the first read starting with its prompt."""

    is_worker_listener = True

    def __init__(self, chat: SubagentChat, subagents: Subagents) -> None:
        self.chat, self.subagents = chat, subagents

    def handle(self, event: AgentEvent) -> None:
        for subagent in [s for s in self.subagents.session_subagents(event.session) if event.subagent and s.session == event.subagent]:
            self.chat.read(subagent)
