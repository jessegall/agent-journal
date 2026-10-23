from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.support.task_notification import TaskNotification
import time

from journal.chat.moment_cards import MomentCards
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.subagent_ended import SubagentEnded
from journal.events.agent.tool_failed import ToolFailed
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.workers.support.subagent_card import SubagentCard
from journal.features.workers.support.subagent_entries import SUBAGENT_KINDS, SubagentEntries
from journal.features.workers.support.subagent_process_card import SubagentProcessCard
from journal.models.subagent import Subagent
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.support.card_kind import CardKind
from journal.support.subagent_dispatch import SubagentDispatch


class SubagentCards(AgentListener[AgentEvent]):
    """Each subagent the agent dispatches is two cards in the chat, as messages: the dispatch, a process card running until the subagent ends, and each end after it, a moment card saying it finished, stopped or failed, with the last thing it said or the tool's error."""

    def __init__(self, subagents: SubagentEntries, card: SubagentProcessCard, cards: MomentCards, agents: Agents) -> None:
        self.subagents, self.card, self.cards, self.agents = subagents, card, cards, agents

    def handle(self, event: AgentEvent) -> None:
        if not self.moves(event):
            return
        actor, agent, moment = Actor.agent(event.session), self.agents.session_agent(event.session).row_id, time.time()
        for row in self.subagents.current_rows(event.session, moment):
            self.carded(event, row, agent, actor)

    @staticmethod
    def moves(event: AgentEvent) -> bool:
        return type(event).__name__ in SUBAGENT_KINDS or (isinstance(event, (ToolStarting, ToolFinished, ToolFailed)) and isinstance(event.call.operation, SubagentDispatch)) or (isinstance(event, PromptSubmitted) and bool(TaskNotification.parsed(event.prompt)))

    def carded(self, event: AgentEvent, row: Subagent, agent: int, actor: Actor) -> None:
        self.card.show(event.environment_id, event.session, agent, row, actor)
        if not row.is_running():
            self.end_card(event, row, agent, actor)

    def end_card(self, event: AgentEvent, row: Subagent, agent: int, actor: Actor) -> None:
        key = f"subagent:{row.dispatch}:ended:{int(row.ended_at)}"
        if self.cards.is_shown(key, actor):
            return
        report = event.report if isinstance(event, SubagentEnded) and event.subagent == row.session else ""
        data = SubagentCard.built(event.session, agent, row, row.state, row.reason).as_data()
        self.cards.show_fields(event.environment_id, event.session, f"Subagent {row.agent_type} ended: {row.task}", data, actor, CardKind.SUBAGENTS, report or row.task, key)
