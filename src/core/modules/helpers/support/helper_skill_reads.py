from pathlib import PurePath

from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.support.helper_nudges import HELPER_SKILL_REFUSAL
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills


class HelperSkillReads:
    """Answers a helper's read of a skill's text: allowed when its profile lists the skill, refused when it does not."""

    def __init__(self, agents: AgentRows, profiles: ProfileFiles, skills: ProfileSkills) -> None:
        self.agents, self.profiles, self.skills = agents, profiles, skills

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_skill_read:
            return RuleAnswer.allowed()
        name = self.agents.find(hook.agent_id).profile
        profile = self.profiles.row(name) if self.profiles.has(name) else None
        if profile is None or isinstance(profile, ProfileProblem):
            return RuleAnswer.allowed()
        unlisted = next((folder for folder in (PurePath(path).parent.name for path in tool.files) if self.skills.refuses(profile, folder)), None)
        return RuleAnswer.allowed() if unlisted is None else RuleAnswer.refused(HELPER_SKILL_REFUSAL.nudge(skill=unlisted))
