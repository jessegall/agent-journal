from engine.change.logged_event import LoggedEvent
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.change.touched import Touched
from core.base.model.model import Model


class SkillEventListener(SkillListener[Touched[Model]]):
    """When an event a skill names happens in an environment, the skill becomes due for the environment's main
    agent, unless the agent holds it loaded in its current text."""

    name = "skills.event"

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        if logged.environment_id is None:
            return
        called = [skill.folder for skill in self.catalogue.registry.skills if skill.covers_event(logged.event)]
        if not called:
            return
        for agent in MainAgentFinder.rows(self.queries):
            for folder in called:
                self.run(logged, RequireSkill(agent.id, folder))
