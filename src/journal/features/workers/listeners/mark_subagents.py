from journal.engine.cards import Cards
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.workers.dispatch import Dispatch
from journal.features.workers.subagents import ENDS, Subagents
from journal.models.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages

DISPATCHING = ("Agent", "Task")
SETTLING = ENDS | {"SubagentEnded"}


class MarkSubagents(AgentListener[AgentEvent]):
    """Each subagent the agent dispatches is a mark in the chat, as a message: written when it starts and settled in place when it ends."""

    def __init__(self, subagents: Subagents, cards: Cards, messages: Messages, agents: Agents) -> None:
        self.subagents, self.cards, self.messages, self.agents = subagents, cards, messages, agents

    def handle(self, event: AgentEvent) -> None:
        if not self.moves(event):
            return
        by, agent = Actor.agent(event.session), self.agents.for_session(event.session).id
        for row in self.subagents.rows(event.session):
            self.marked(event, row, agent, by)

    @staticmethod
    def moves(event: AgentEvent) -> bool:
        """An Agent tool's call or answer, a subagent's own stop, or the end of the turn or session that settles what never answered."""
        return type(event).__name__ in SETTLING or (isinstance(event, (ToolStarting, ToolFinished)) and event.tool in DISPATCHING)

    def marked(self, event: AgentEvent, row: Dispatch, agent: int, by: Actor) -> None:
        key = f"subagent:{row.id}"
        data = {"kind": "subagent", "session": event.session, "agent": agent, "detail": row.task, "agent_type": row.type, "model": row.model, "subagent": row.session, "state": row.status}
        earlier = self.messages.keyed(key, by)
        if earlier and all(earlier[0].data.get(k) == v for k, v in data.items()):
            return
        self.cards.keyed(event.environment_id, key, f"Subagent {row.type}: {row.task}", data, by)
