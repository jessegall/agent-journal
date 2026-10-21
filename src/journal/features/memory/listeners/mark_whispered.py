from journal.support.cards import Cards
from journal.events.agent.line_said import LineSaid
from journal.events.agent_listener import AgentListener
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.support.chat_mark import ChatMark
from journal.support.ref import Ref

MEMORY_CHAT_KINDS = {"fact": ChatMark.FACTS, "rule": ChatMark.RULES, "reminder": ChatMark.REMINDERS}


class MarkWhispered(AgentListener[LineSaid]):
    """A fact, rule or reminder the memory conduct whispered back is shown in the chat as a mark, once per line said."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders, cards: Cards) -> None:
        self.cards = cards
        self.repositories = {"fact": facts, "rule": rules, "reminder": reminders}

    def handle(self, event: LineSaid) -> None:
        from journal.features.memory.feature import Memory
        if event.nudge != Memory.MEMORY_READ_REQUEST.key:
            return
        noun, n = event.values["noun"], int(event.values["n"])
        row = self.repositories[noun].find(n)
        self.cards.show(event.environment_id, event.session, f"Reminded the agent about {noun} {n}", "rules", "", "", str(Ref.to(row)), kind="whisper", shows=MEMORY_CHAT_KINDS[noun])
