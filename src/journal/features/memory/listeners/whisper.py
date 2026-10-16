import re

from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.supervisor_link import SupervisorLink


class Whisper(AgentListener[AgentEvent]):
    """A fact, rule or reminder whose keyword appears in what the agent writes or runs is whispered back to it once, and shown in the chat as a mark. The agent hears it with the next line; the tool call goes through."""

    def __init__(self, machine: Machine, nudger: Nudger, facts: Facts, rules: Rules, reminders: Reminders, cards: Cards, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.facts, self.rules, self.reminders, self.cards, self.supervisor = machine, nudger, facts, rules, reminders, cards, supervisor

    def handle(self, event: AgentEvent) -> Decision | None:
        text = self.written(event)
        if not text:
            return None
        words = set(re.findall(r"[a-z][a-z0-9_-]*", text.lower()))
        agent = self.machine.agent(event.session, event.environment_id)
        for noun, row in self.rows():
            if words & set(row.keywords) and (line := self.nudger.say(agent, self.said(noun, row))):
                self.supervisor.type(event.environment_id, line)
                self.cards.show(event.environment_id, event.session, f"Reminded the agent about {noun} {row.id}", "rules", "", "", f"{noun}:{row.id}", key=f"whisper:{noun}:{row.id}")
        return None

    @staticmethod
    def written(event: AgentEvent) -> str:
        if isinstance(event, TurnWritten):
            return event.text if event.final else ""
        if isinstance(event, ToolStarting):
            return event.input.get("command", "") if event.tool == "Bash" else ""
        return ""

    def rows(self):
        return [*(("fact", f) for f in self.facts.in_()), *(("rule", r) for r in self.rules.all()), *(("reminder", r) for r in self.reminders.in_())]

    @staticmethod
    def said(noun: str, row):
        from journal.features.memory.feature import Memory
        return Memory.WHISPER.about(noun=noun, n=row.id, text=row.text)
