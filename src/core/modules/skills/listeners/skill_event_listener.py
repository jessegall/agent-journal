from core.base.change.event_pattern import EventPattern
from core.base.change.logged_event import LoggedEvent
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class SkillEventListener(SkillListener):
    """When an event a skill names happens in an environment, the skill becomes due for the environment's main
    agent, unless the agent holds it loaded in its current text."""

    name = "skills.event"
    event = "*"

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is None:
            return
        called = [skill.folder for skill in self.catalogue.skills() if any(EventPattern(pattern).matches(event.event) for pattern in skill.events)]
        for agent in MainAgentFinder.rows(self.queries, event.environment_id):
            for folder in called:
                self.run(event, RequireSkill(agent.id, folder))
