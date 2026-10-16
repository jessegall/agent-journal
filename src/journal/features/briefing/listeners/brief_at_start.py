from datetime import datetime, timedelta, timezone

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
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


class BriefAtStart(AgentListener[SessionStarted]):
    """Every session start, and every resume after a compaction, is answered with where the agent is and what binds it: the journal's quiet rule, the laws, a takeover notice, the rules, facts and reminders, and what waits for it. Blocking, because it rides in the hook's answer."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, environments: Environments, agents: Agents, rules: Rules, facts: Facts, reminders: Reminders, tasks: Tasks, messages: Messages, questions: Questions) -> None:
        self.machine, self.nudger, self.environments, self.agents = machine, nudger, environments, agents
        self.rules, self.facts, self.reminders, self.tasks, self.messages, self.questions = rules, facts, reminders, tasks, messages, questions

    def handle(self, event: SessionStarted) -> Decision:
        from journal.features.briefing.feature import Briefing
        agent = self.machine.agent(event.session, event.environment_id)
        environment = self.environments.find(event.environment_id)
        rules = self.rules.all()
        lines = [
            Briefing.READY.about(env=environment.name),
            Briefing.QUIET.about(),
            Briefing.LAWS.about(),
            self.takeover(event),
            Briefing.RULES.about(count=len(rules), rows=self.numbered(r.text for r in rules)) if rules else None,
            Briefing.FACTS.about(rows=self.numbered(f.text for f in self.facts.in_())) if self.facts.in_() else None,
            Briefing.REMINDERS.about(rows=self.numbered(r.text for r in self.reminders.in_())) if self.reminders.in_() else None,
            self.waiting(event),
        ]
        return Decision.tell("\n".join(line for said in lines if said and (line := self.nudger.say(agent, said))))

    def takeover(self, event: SessionStarted):
        """Another session worked this environment lately: what the chat holds was written to it, not to this one. A compaction is the same session going on."""
        from journal.features.briefing.feature import Briefing
        if event.source == "compact":
            return None
        since = datetime.now(timezone.utc) - TAKEN_OVER_WITHIN
        others = self.agents.others_lately(event.session, since)
        return Briefing.TAKEOVER.about(at=others[-1].updated_at.astimezone().strftime("%H:%M")) if others else None

    def waiting(self, event: SessionStarted):
        from journal.features.briefing.feature import Briefing
        counts = {"tasks": len(self.tasks.in_state(TaskState.OPEN)), "messages": len(self.messages.unread()), "questions": len(self.questions.open())}
        parts = [f"{n} {name}" for name, n in counts.items() if n]
        return Briefing.WAITING.about(rows=", ".join(parts)) if parts else None

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))
