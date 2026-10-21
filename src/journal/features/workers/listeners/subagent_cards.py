import time

from journal.chat.cards import Cards
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_failed import ToolFailed
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.workers.support.subagent_entries import SUBAGENT_KINDS, SubagentEntries
from journal.models.subagent import Subagent
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.support.card_kind import CardKind
from journal.support.subagent_dispatch import SubagentDispatch


class SubagentCards(AgentListener[AgentEvent]):
    """Each subagent the agent dispatches is a mark in the chat, as a message: written when it starts, settled in place when it ends, and marked failed with the tool's error when the dispatch did not run."""

    def __init__(self, subagents: SubagentEntries, cards: Cards, messages: Messages, agents: Agents) -> None:
        self.subagents, self.cards, self.messages, self.agents = subagents, cards, messages, agents

    def handle(self, event: AgentEvent) -> None:
        if not self.moves(event):
            return
        actor, agent, moment = Actor.agent(event.session), self.agents.session_agent(event.session).id, time.time()
        for row in [row for row in self.subagents.rows(event.session) if row.is_current(moment)]:
            self.carded(event, row, agent, actor)

    @staticmethod
    def moves(event: AgentEvent) -> bool:
        return type(event).__name__ in SUBAGENT_KINDS or (isinstance(event, (ToolStarting, ToolFinished, ToolFailed)) and isinstance(event.call.operation, SubagentDispatch))

    def carded(self, event: AgentEvent, row: Subagent, agent: int, actor: Actor) -> None:
        key = f"subagent:{row.dispatch}"
        data = {"kind": "subagent", "session": event.session, "agent": agent, "agent_type": row.agent_type, "model": row.model, "subagent": row.session, "state": row.state.value, "reason": row.reason}
        older = self.messages.keyed(key, actor)
        if older and all(older[0].data.get(k) == v for k, v in data.items()):
            return
        self.cards.keyed(event.environment_id, key, f"Subagent {row.agent_type}: {row.task}", data, actor, CardKind.SUBAGENTS, row.task)
