from pathlib import PurePath

from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from core.modules.helpers.support.helper_nudges import HELPER_SKILL_REFUSAL
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills


class HelperSkillReads:
    """Answers a helper's read of a skill's text: allowed when its profile lists the skill, refused when it does not."""

    def __init__(self, skills: AgentProfileSkills) -> None:
        self.skills = skills

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_skill_read:
            return RuleAnswer.allowed()
        unlisted = next((folder for folder in (PurePath(path).parent.name for path in tool.files) if self.skills.refuses(hook.agent_id, folder)), None)
        return RuleAnswer.allowed() if unlisted is None else RuleAnswer.refused(HELPER_SKILL_REFUSAL.nudge())
