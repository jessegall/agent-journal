from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules


class BriefAtStart(AgentListener[SessionStarted]):
    """Every session start, and every resume after a compaction, is answered with where the agent is and what binds it. Blocking, because it rides in the hook's answer."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, environments: Environments, rules: Rules, facts: Facts, reminders: Reminders) -> None:
        self.machine, self.nudger, self.environments, self.rules, self.facts, self.reminders = machine, nudger, environments, rules, facts, reminders

    def handle(self, event: SessionStarted) -> Decision:
        from journal.features.briefing.feature import Briefing
        agent = self.machine.agent(event.session, event.environment_id)
        environment = self.environments.find(event.environment_id)
        rules = self.rules.all()
        lines = [
            Briefing.READY.about(env=environment.name),
            Briefing.RULES.about(count=len(rules), rows=self.numbered(r.text for r in rules)) if rules else None,
            Briefing.FACTS.about(rows=self.numbered(f.text for f in self.facts.in_(agent.environment_id))) if self.facts.in_(agent.environment_id) else None,
            Briefing.REMINDERS.about(rows=self.numbered(r.text for r in self.reminders.in_(agent.environment_id))) if self.reminders.in_(agent.environment_id) else None,
        ]
        return Decision.tell("\n".join(line for said in lines if said and (line := self.nudger.say(agent, said))))

    @staticmethod
    def numbered(texts) -> str:
        return "; ".join(f"{n}. {text}" for n, text in enumerate(texts, 1))
