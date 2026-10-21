from journal.chat.cards import Cards
from journal.events.agent.line_delivered import LineDelivered
from journal.events.agent_listener import AgentListener
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.support.card_kind import CardKind
from journal.models.support.ref import Ref

MEMORY_CHAT_KINDS = {"fact": CardKind.FACTS, "rule": CardKind.RULES, "reminder": CardKind.REMINDERS}


class MemoryHintCard(AgentListener[LineDelivered]):
    """A fact, rule or reminder the memory conduct whispered back is shown in the chat as a mark, once per line said."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders, cards: Cards) -> None:
        self.cards = cards
        self.repositories = {"fact": facts, "rule": rules, "reminder": reminders}

    def handle(self, event: LineDelivered) -> None:
        from journal.features.memory.feature import Memory
        if event.nudge != Memory.MEMORY_READ_REQUEST.key:
            return
        noun, n = event.values["noun"], int(event.values["n"])
        row = self.repositories[noun].find(n)
        self.cards.show(event.environment_id, event.session, f"Reminded the agent about {noun} {n}", "rules", "", "", Ref.build(row), kind="whisper", shows=MEMORY_CHAT_KINDS[noun])
