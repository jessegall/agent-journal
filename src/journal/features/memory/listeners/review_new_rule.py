from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.support.actor_kind import ActorKind
from journal.models.rule import Rule
from journal.repositories.agents import Agents


class ReviewNewRule(Listener[Created]):
    """A rule the agent just made is questioned once, in the output of the command that made it: is it a ruling for the whole project, or a fact or reminder in disguise?"""

    def __init__(self, nudger: Nudger, agents: Agents) -> None:
        self.nudger, self.agents = nudger, agents

    def handle(self, event: Created) -> None:
        from journal.features.memory.feature import Memory
        rule = event.model
        if not isinstance(rule, Rule) or event.by.kind != ActorKind.AGENT:
            return
        agent = self.agents.for_session(event.by.id)
        line = self.nudger.say(agent, Memory.RULE_REVIEW.create(n=rule.id))
        if line:
            print(line)
