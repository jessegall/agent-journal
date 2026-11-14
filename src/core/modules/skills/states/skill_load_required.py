from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.open_row import OpenRow
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.support.unread_skills import UnreadSkills


class SkillLoadRequired(AgentState):
    """An agent has a skill due that it must still read: the first one it must read opens the state, and the rule that
    holds its tools until the skill is read is asked in its own place only then."""

    name = "skills.load-required"
    tier = StateTier.IN_PLACE
    role_group = RoleGroup.PROMPT
    rules = [SkillReadFirstRule]

    def __init__(self, unread_skills: UnreadSkills) -> None:
        self.unread_skills = unread_skills

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        due = self.unread_skills.due_rows(hook.agent_id)
        return [self.row(due[0])] if due else []

    @staticmethod
    def row(skill: AgentSkill) -> OpenRow:
        return OpenRow(AgentSkill.model_name, skill.id, skill.creation_timestamp())
