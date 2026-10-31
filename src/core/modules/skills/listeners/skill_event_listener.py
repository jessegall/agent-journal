from core.base.agent_role import AgentRole
from core.base.change.event_pattern import EventPattern
from core.base.change.logged_event import LoggedEvent
from core.base.query.conditions.is_null import IsNull
from core.modules.agents.models.agent import Agent
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener


class SkillEventListener(SkillListener):
    """When an event a skill names happens in an environment, the skill becomes due for the environment's main
    agent, unless the agent holds it loaded in its current text."""

    name = "skills.event"
    event = "*"

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is None:
            return
        called = [skill.folder for skill in self.registry.skills if any(EventPattern(pattern).matches(event.event) for pattern in skill.events)]
        for agent in self.queries.query(Agent).filter(environment_id=event.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows():
            for folder in called:
                self.run(event, RequireSkill(agent.id, folder))
