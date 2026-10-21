from datetime import datetime, timedelta, timezone

from journal.events.agent.session_started import SessionStarted
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.tasks import Tasks

TAKEN_OVER_WITHIN = timedelta(days=1)


class StartLines:
    """What the start block names, worked out here once: when another session worked here lately, the rules, facts and reminders numbered, and what waits; the briefing conduct says the block from the readings that carries them."""

    def __init__(self, agents: Agents, rules: Rules, facts: Facts, reminders: Reminders, tasks: Tasks, messages: Messages, questions: Questions) -> None:
        self.agents, self.rules, self.facts, self.reminders = agents, rules, facts, reminders
        self.tasks, self.messages, self.questions = tasks, messages, questions

    def taken_over_at(self, event: SessionStarted) -> str:
        return "" if event.source == "compact" else self.last_other_session_at(event.session)

    def last_other_session_at(self, session: str) -> str:
        others = self.agents.others_lately(session, datetime.now(timezone.utc) - TAKEN_OVER_WITHIN)
        return others[-1].updated_at.astimezone().strftime("%H:%M") if others else ""

    def rules_numbered(self) -> str:
        return self.numbered(r.text for r in self.rules.all())

    def facts_numbered(self) -> str:
        return self.numbered(f.text for f in self.facts.in_())

    def reminders_numbered(self) -> str:
        return self.numbered(r.text for r in self.reminders.in_())

    def waiting(self) -> str:
        counts = {"tasks": len(self.tasks.in_state(TaskState.OPEN)), "messages": len(self.messages.unread()), "questions": len(self.questions.open())}
        return ", ".join(f"{n} {name}" for name, n in counts.items() if n)

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))
