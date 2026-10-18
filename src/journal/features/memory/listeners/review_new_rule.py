from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.actor_kind import ActorKind
from journal.models.rule import Rule
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class ReviewNewRule(Listener[Created]):
    """A rule the agent just made is questioned once: is it a ruling for the whole project, or a fact or reminder in disguise?"""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.memory.feature import Memory
        rule = event.model
        if not isinstance(rule, Rule) or event.by.kind != ActorKind.AGENT:
            return
        agent = self.agents.for_session(event.by.id)
        line = self.nudger.say(agent, Memory.RULE_REVIEW.about(n=rule.id))
        if line:
            self.supervisor.type(agent.environment_id, line)
