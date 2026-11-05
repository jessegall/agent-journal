from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class SkillLoaded(BlockCondition):
    """The agent holds this skill loaded in its current text, or no module declares the skill any more."""

    name = "skill-loaded"

    def is_true(self, check: BlockCheck) -> bool:
        skill = next((skill for skill in check.container.get(SkillCatalogue).skills() if skill.folder == self.text), None)
        return skill is None or check.container.get(AgentSkillRows).is_loaded(check.hook.agent_id, skill.folder, skill.digest)
