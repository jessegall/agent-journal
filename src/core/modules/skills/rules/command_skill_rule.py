from engine.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.skills.support.missing_command_skill import MissingCommandSkill
from core.modules.skills.support.skill_block import SkillBlock
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import READ_COMMAND_SKILL_FIRST


class CommandSkillRule(DriverRule):
    """A journal command of a subject a skill covers gives the agent three tool uses to load it. After them only
    reading that skill goes through, and the refusal gives the path. A skill the agent's profile does not give
    it is not asked for, since it could not read it."""

    name = "skills.command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, missing: MissingCommandSkill, files: SkillFiles) -> None:
        self.missing, self.files = missing, files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        folder = self.missing.first(hook.agent_id, tool.journal_commands if tool is not None else ())
        if folder is None:
            return RuleAnswer.allowed()
        return SkillBlock.answer(hook, READ_COMMAND_SKILL_FIRST.nudge(instruction=self.files.instruction(folder, hook)), folder, strict=True)
