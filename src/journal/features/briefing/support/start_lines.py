from datetime import datetime, timedelta, timezone

from journal.engine.nudge import Nudge
from journal.events.agent.session_started import SessionStarted
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.tasks import Tasks

TAKEN_OVER_WITHIN = timedelta(days=1)
"""Another session that worked here this recently makes a start a takeover."""


class StartLines:
    """The start block the engine says at every session start and after a compaction, in its order: ready, quiet, the laws, a takeover, the rules, facts and reminders, and what waits; what each line names is worked out here once, for the block and for a workflow that names the same."""

    def __init__(self, environments: Environments, agents: Agents, rules: Rules, facts: Facts, reminders: Reminders, tasks: Tasks, messages: Messages, questions: Questions) -> None:
        self.environments, self.agents, self.rules, self.facts, self.reminders = environments, agents, rules, facts, reminders
        self.tasks, self.messages, self.questions = tasks, messages, questions

    def said(self, event: SessionStarted) -> list[Nudge]:
        from journal.features.briefing.feature import Briefing
        taken_over_at, rules, facts, reminders, waiting = self.taken_over_at(event), self.rules_said(), self.facts_said(), self.reminders_said(), self.waiting()
        optional = (
            (taken_over_at, lambda: Briefing.YOU_TOOK_OVER.create(at=taken_over_at)),
            (rules, lambda: Briefing.RULES_IN_FORCE.create(count=len(self.rules.all()), rows=rules)),
            (facts, lambda: Briefing.FACTS_HERE.create(rows=facts)),
            (reminders, lambda: Briefing.REMINDERS_HERE.create(rows=reminders)),
            (waiting, lambda: Briefing.WAITING_FOR_YOU.create(rows=waiting)),
        )
        return [Briefing.JOURNAL_READY.create(env=self.environments.find(event.environment_id).name), Briefing.HANDLE_THE_JOURNAL_QUIETLY.create(), Briefing.THE_LAWS_APPLY.create(), *(line() for named, line in optional if named)]

    def taken_over_at(self, event: SessionStarted) -> str:
        """The time of day another session that worked here within a day last did anything, when this start is not the same session going on after a compaction; empty when none did."""
        if event.source == "compact":
            return ""
        others = self.agents.others_lately(event.session, datetime.now(timezone.utc) - TAKEN_OVER_WITHIN)
        return others[-1].updated_at.astimezone().strftime("%H:%M") if others else ""

    def rules_said(self) -> str:
        """The rules in force, numbered."""
        return self.numbered(r.text for r in self.rules.all())

    def facts_said(self) -> str:
        """The facts about this environment, numbered."""
        return self.numbered(f.text for f in self.facts.in_())

    def reminders_said(self) -> str:
        """The reminders here, numbered."""
        return self.numbered(r.text for r in self.reminders.in_())

    def waiting(self) -> str:
        """What waits for the agent, by count: open tasks, unread messages, open questions."""
        counts = {"tasks": len(self.tasks.in_state(TaskState.OPEN)), "messages": len(self.messages.unread()), "questions": len(self.questions.open())}
        return ", ".join(f"{n} {name}" for name, n in counts.items() if n)

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))
