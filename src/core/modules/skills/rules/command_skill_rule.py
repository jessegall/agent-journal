from core.modules.skills.support.skill_nudges import READ_COMMAND_SKILL_FIRST
from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_requirement import SkillRequirement


class CommandSkillRule(DriverRule):
    """A journal command of a noun a skill covers is refused until the agent holds that skill loaded in its
    current text: every other tool but reading is blocked until it is read, and the refusal gives the path."""

    name = "skills.command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, catalogue: SkillCatalogue, rows: AgentSkillRows, files: SkillFiles, requirement: SkillRequirement) -> None:
        self.catalogue, self.rows, self.files, self.requirement = catalogue, rows, files, requirement

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        journal_parts = [part for part in parts if part.classification.category is CommandCategory.JOURNAL and part.arguments]
        covered = {part.subcommand or part.arguments[0] for part in journal_parts} | {" ".join(part.arguments[:2]) for part in journal_parts}
        if not covered:
            return RuleAnswer.allowed()
        missing = [skill for skill in self.catalogue.skills() if covered.intersection(skill.commands) and not self.rows.is_loaded(hook.agent_id, skill.folder, skill.digest)]
        if not missing or not self.requirement.is_required:
            return RuleAnswer.allowed()
        instruction = self.files.instruction(missing[0].folder, hook)
        return RuleAnswer.refused_with_block(hook, READ_COMMAND_SKILL_FIRST.nudge(instruction=instruction), SkillLoaded(missing[0].folder))
