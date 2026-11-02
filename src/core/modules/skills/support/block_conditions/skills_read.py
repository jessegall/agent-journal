from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.skills.support.due_skills import DueSkills


class SkillsRead(BlockCondition):
    """The agent has no skill due."""

    name = "skills-read"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(DueSkills).folders(check.hook.agent_id)
