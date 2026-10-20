import re

from journal.support.cards import Cards
from journal.support.ref import Ref
from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.supervisor_link import SupervisorLink
from journal.support.chat_mark import ChatMark


class Whisper(AgentListener[AgentEvent]):
    """A fact, rule or reminder whose keyword appears in what the agent writes or runs is whispered back to it once, and shown in the chat as a mark. The agent hears it with the next line; the tool call goes through."""

    def __init__(self, machine: Machine, nudger: Nudger, facts: Facts, rules: Rules, reminders: Reminders, cards: Cards, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.facts, self.rules, self.reminders, self.cards, self.supervisor = machine, nudger, facts, rules, reminders, cards, supervisor

    def handle(self, event: AgentEvent) -> Decision | None:
        text = event.words
        if not text:
            return None
        words = set(re.findall(r"[a-z][a-z0-9_-]*", text.lower()))
        agent = self.machine.agent(event.session, event.environment_id)
        for noun, mark, row in [(noun, mark, row) for noun, mark, row in self.rows() if words & set(row.keywords)]:
            line = self.nudger.say(agent, self.said(noun, row))
            if not line:
                continue
            self.supervisor.type(event.environment_id, line)
            self.cards.show(event.environment_id, event.session, f"Reminded the agent about {noun} {row.id}", "rules", "", "", str(Ref.to(row)), kind="whisper", shows=mark)
        return None

    def rows(self):
        """Each fact, rule and reminder with its noun and the chat's switch for it."""
        return [*(("fact", ChatMark.FACTS, f) for f in self.facts.in_()), *(("rule", ChatMark.RULES, r) for r in self.rules.all()), *(("reminder", ChatMark.REMINDERS, r) for r in self.reminders.in_())]

    @staticmethod
    def said(noun: str, row):
        from journal.features.memory.feature import Memory
        return Memory.MEMORY_WHISPERED_BACK.create(noun=noun, n=row.id, text=row.text)
