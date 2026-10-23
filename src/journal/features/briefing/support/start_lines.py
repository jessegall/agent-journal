from datetime import datetime, timedelta, timezone

from journal.events.agent.session_started import SessionStarted
from journal.models.environment import Environment
from journal.models.message import Message
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.tasks import Tasks

TAKEOVER_WINDOW = timedelta(days=1)
HISTORY_MESSAGES = 10
HISTORY_CHARACTERS = 200


class StartLines:
    """What the start block names, worked out here once: when another session worked here lately, the rules, facts and reminders numbered, what waits, and in the Team chat its last ten messages and answers, each cut to 200 characters, so an agent on a machine that claimed it picks up from them; the briefing conduct says the block from the feature data that carries them."""

    def __init__(self, agents: Agents, rules: Rules, facts: Facts, reminders: Reminders, tasks: Tasks, messages: Messages, questions: Questions) -> None:
        self.agents, self.rules, self.facts, self.reminders = agents, rules, facts, reminders
        self.tasks, self.messages, self.questions = tasks, messages, questions

    def takeover_note(self, event: SessionStarted) -> str:
        return "" if event.source == "compact" else self.other_session_time(event.session)

    def other_session_time(self, session: str) -> str:
        peers = self.agents.recent_peers(session, datetime.now(timezone.utc) - TAKEOVER_WINDOW)
        return peers[-1].update_time.astimezone().strftime("%H:%M") if peers else ""

    def rules_numbered(self) -> str:
        return self.numbered(r.text for r in self.rules.all())

    def facts_numbered(self) -> str:
        return self.numbered(f.text for f in self.facts.scoped())

    def reminders_numbered(self) -> str:
        return self.numbered(r.text for r in self.reminders.scoped())

    def waiting(self) -> str:
        counts = {"tasks": len(self.tasks.open_tasks()), "messages": len(self.messages.unread()), "questions": len(self.questions.open())}
        return ", ".join(f"{n} {name}" for name, n in counts.items() if n)

    def team_history(self, environment: Environment) -> str:
        if not environment.is_team_chat:
            return ""
        return " | ".join(f"{self.writer(m)}: {m.text[:HISTORY_CHARACTERS]}" for m in self.messages.exchanges(HISTORY_MESSAGES))

    @staticmethod
    def writer(message: Message) -> str:
        return message.data.get(Message.TEAMMATE, str(message.author))

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))
