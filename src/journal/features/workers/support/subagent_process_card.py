from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.features.workers.support.subagent_card import SubagentCard
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.models.message import Message
from journal.models.subagent import Subagent
from journal.models.subagent_state import SubagentState
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class SubagentProcessCard(ProcessCard):
    """The process card of a subagent's dispatch: who sent it, of which type and model and its own session once known, active until the subagent ends."""

    name = "subagent"

    def __init__(self, subagents: SubagentEntries, cards: ProcessCards, messages: Messages) -> None:
        self.subagents, self.cards, self.messages = subagents, cards, messages

    @staticmethod
    def key(row: Subagent) -> str:
        return f"subagent:{row.dispatch}"

    def show(self, environment_id: int, session: str, agent: int, row: Subagent, actor: Actor) -> None:
        data = {**SubagentCard.built(session, agent, row, SubagentState.ACTIVE, "").as_data(), "dispatch": row.dispatch, "active": row.is_running()}
        older = self.messages.keyed(self.key(row), actor)
        if older and all(older[0].data.get(k) == v for k, v in data.items()):
            return
        self.cards.show(self.name, environment_id, self.key(row), f"Subagent {row.agent_type}: {row.task}", data, actor, CardKind.SUBAGENTS, row.is_running(), row.task)

    def refresh(self, message: Message) -> dict:
        row = self.subagents.dispatched(message.data["session"], message.data["dispatch"])
        return {"model": row.model, "subagent": row.session, "active": row.is_running()}
