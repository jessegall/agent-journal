from journal.support.cards import Cards
from journal.support.ref import Ref
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.memory.support.memory_standing_reader import MemoryStandingReader
from journal.repositories.agents import Agents
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules


class MarkWhispered(AgentListener[AgentEvent]):
    """A fact, rule or reminder the memory conduct whispered back, its keyword in what the agent writes or runs, is shown in the chat as a mark."""

    def __init__(self, reader: MemoryStandingReader, agents: Agents, facts: Facts, rules: Rules, reminders: Reminders, cards: Cards) -> None:
        self.reader, self.agents, self.cards = reader, agents, cards
        self.repositories = {"fact": facts, "rule": rules, "reminder": reminders}

    def handle(self, event: AgentEvent) -> None:
        if not event.words:
            return
        for row in self.reader.read(self.agents.for_session(event.session)).whispered_by(event.words):
            found = self.repositories[row.noun].find(row.id)
            self.cards.show(event.environment_id, event.session, f"Reminded the agent about {row.noun} {row.id}", "rules", "", "", str(Ref.to(found)), kind="whisper", shows=row.mark)
