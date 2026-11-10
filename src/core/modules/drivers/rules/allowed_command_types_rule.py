from collections.abc import Sequence
from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.driver.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.access_nudges import COMMAND_RESTRICTION


class AllowedCommandTypesRule(DriverRule):
    """Allows journal commands and the command categories a driver declares or reads from its settings."""

    name = "drivers.allowed-command-types"
    hook = HookEventName.PRE_TOOL_USE
    exempt = True
    allowed_commands: ClassVar[Sequence[CommandCategory]] = tuple(CommandCategory)
    refusal: ClassVar[NudgeDeclaration] = COMMAND_RESTRICTION
    refuses_one_action = "Allows journal commands and the command categories a driver declares or reads from its settings"

    def command_types(self, hook: AgentHook) -> Sequence[str]:
        return tuple(category.value for category in self.allowed_commands)

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        allowed = self.command_types(hook)
        if shell.parse_error or not shell.parts:
            return RuleAnswer.refused(self.refusal.nudge(category=CommandCategory.UNKNOWN.value))
        if shell.has_non_journal_file_writes and CommandCategory.EDIT.value not in allowed:
            return RuleAnswer.refused(self.refusal.nudge(category=CommandCategory.EDIT.value))
        refused = shell.disallowed_part(allowed)
        if refused is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(self.refusal.nudge(category=refused.classification.category.value))
