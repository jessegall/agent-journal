from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.skills.support.unread_skills import UnreadSkills


class SkillsRead(BlockCondition):
    """The agent has no skill due."""

    name = "skills-read"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(UnreadSkills).names(check.hook.agent_id)
