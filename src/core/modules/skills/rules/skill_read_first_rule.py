from core.modules.skills.nudges.read_skill_first_nudge import ReadSkillFirstNudge

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.skills.commands.load_skill.support.kept_skills import KeptSkills
from core.modules.skills.support.skill_block import SkillBlock
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement


class SkillReadFirstRule(DriverRule):
    """Gives a due skill three tool uses, then holds the agent's tools until the skill has been read. A skill the
    program put back after a compaction counts as read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, unread_skills: UnreadSkills, files: SkillFiles, requirement: SkillRequirement, kept: KeptSkills) -> None:
        self.unread_skills, self.files, self.requirement, self.kept = unread_skills, files, requirement, kept

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.unread_skills.names(hook.agent_id)
        if not names:
            return RuleAnswer.allowed()
        missing = names if self.kept.is_recorded(hook.agent_id) else self.kept.unloaded(hook.agent_id, hook.event.transcript, names)
        if not missing or not self.requirement.is_required:
            return RuleAnswer.allowed()
        return SkillBlock.answer(hook, ReadSkillFirstNudge.instructed(self.files.instruction(missing[0], hook)), missing[0])
