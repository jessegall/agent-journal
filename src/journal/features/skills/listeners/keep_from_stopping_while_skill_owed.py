from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.support.requiring import Requiring
from journal.support.decision import Decision


class KeepFromStoppingWhileSkillOwed(AgentListener[Idle]):
    """A stop while a skill is owed is held, naming the skill."""

    blocking = True

    def __init__(self, machine: Machine, registry: Registry, requiring: Requiring) -> None:
        self.machine, self.registry, self.requiring = machine, registry, requiring

    def handle(self, event: Idle) -> Decision | None:
        from journal.features.skills.feature import Skills
        agent = self.machine.agent(event.session, event.environment_id)
        names = self.requiring.owed_names(agent)
        if not names:
            return None
        said = Skills.STOPPED_OWING.about(skills=" and ".join(names))
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
