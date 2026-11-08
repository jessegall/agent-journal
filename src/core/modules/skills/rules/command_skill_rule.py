from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_nudges import READ_COMMAND_SKILL_FIRST, SKILL_COUNTDOWN, SKILL_TOOL_USES
from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.skill_countdown import SkillCountdown
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement


class CommandSkillRule(DriverRule):
    """A journal command of a noun a skill covers makes that skill due unless the agent holds it loaded in its
    current text, and names it with three tool uses before it is held. Once they run out the command is
    refused and every other tool but reading is blocked until the skill is read, and the refusal gives the
    path. A skill the agent's profile does not give it is not asked for, since it could not read it."""

    name = "skills.command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, catalogue: SkillCatalogue, rows: AgentSkillRows, files: SkillFiles, requirement: SkillRequirement, profile_skills: AgentProfileSkills, countdown: SkillCountdown) -> None:
        self.catalogue, self.rows, self.files, self.requirement, self.profile_skills, self.countdown = catalogue, rows, files, requirement, profile_skills, countdown

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        journal_parts = [part for part in parts if part.classification.category is CommandCategory.JOURNAL and part.arguments]
        covered = {part.subcommand or part.arguments[0] for part in journal_parts} | {" ".join(part.arguments[:2]) for part in journal_parts}
        if not covered:
            return RuleAnswer.allowed()
        missing = [skill for skill in self.catalogue.skills() if covered.intersection(skill.commands) and not self.rows.is_loaded(hook.agent_id, skill.folder, skill.digest) and not self.profile_skills.refuses(hook.agent_id, skill.folder)]
        if not missing or not self.requirement.is_required:
            return RuleAnswer.allowed()
        folder = missing[0].folder
        due = self.rows.find(hook.agent_id, folder)
        if due is None or due.state is not AgentSkillState.DUE:
            return RuleAnswer.with_nudges(SKILL_COUNTDOWN.nudge(SKILL_TOOL_USES, skill=folder)).running(RequireSkill(hook.agent_id, folder))
        remaining = self.countdown.remaining(hook, due)
        if remaining > 0:
            return RuleAnswer.with_nudges(SKILL_COUNTDOWN.nudge(remaining, skill=folder))
        instruction = self.files.instruction(folder, hook)
        return RuleAnswer.refused_with_block(hook, READ_COMMAND_SKILL_FIRST.nudge(instruction=instruction), SkillLoaded(folder))
