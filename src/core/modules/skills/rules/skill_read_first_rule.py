from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST, SKILL_COUNTDOWN, SKILL_TOOL_USES

from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_countdown import SkillCountdown
from core.modules.skills.support.kept_skills import KeptSkills
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded


class SkillReadFirstRule(DriverRule):
    """Names a due skill and the tool uses left before it is held, three from the moment it became due; a tool
    is refused once they have run out, until the skill has been read. A skill the program put back after a
    compaction counts as read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, unread_skills: UnreadSkills, files: SkillFiles, requirement: SkillRequirement, kept: KeptSkills, rows: AgentSkillRows, countdown: SkillCountdown) -> None:
        self.unread_skills, self.files, self.requirement, self.kept, self.rows, self.countdown = unread_skills, files, requirement, kept, rows, countdown

    def answer(self, hook: AgentHook) -> RuleAnswer:
        names = self.unread_skills.names(hook.agent_id)
        if not names:
            return RuleAnswer.allowed()
        loads = self.kept.loads(hook, names)
        kept_names = {entry.skill for entry in loads}
        missing = [name for name in names if name not in kept_names]
        if not missing or not self.requirement.is_required:
            return RuleAnswer.allowed().running(*loads)
        due = self.rows.find(hook.agent_id, missing[0])
        remaining = self.countdown.remaining(hook, due) if due is not None else SKILL_TOOL_USES
        if remaining > 0:
            return RuleAnswer.with_nudges(SKILL_COUNTDOWN.nudge(remaining, skill=missing[0])).running(*loads)
        instruction = self.files.instruction(missing[0], hook)
        return RuleAnswer.blocked(hook, READ_SKILL_FIRST.nudge(instruction=instruction), SkillLoaded(missing[0])).running(*loads)
