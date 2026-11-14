from collections.abc import Sequence

from engine.cli.subcommand_lookup import SubcommandLookup
from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.journal_line import JournalLine
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.base_commands import BASE_COMMANDS
from core.modules.drivers.support.access_nudges import HELPER_TYPE_CATEGORY
from core.modules.drivers.support.type_command_check import TypeCommandCheck

HELP_FLAG = "--help"


class HelperTypeCommandsRule(DriverRule):
    """A helper runs only the shell command types and the journal lines its type lists, beside the base list every
    helper has; the main agent runs every command."""

    name = "drivers.helper-type-commands"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A helper runs only the shell command types and the journal lines its type lists"

    def __init__(self, types: HelperTypeBook, lookup: SubcommandLookup, settings: SettingValues, commands: TypeCommandCheck, agents: AgentRows) -> None:
        self.types, self.lookup, self.settings, self.commands, self.agents = types, lookup, settings, commands, agents

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not self.types.is_helper(hook.role):
            return RuleAnswer.allowed()
        helper_type = self.types.find(hook.role)
        refused_part = shell.disallowed_part(self.command_types(helper_type, BASE_COMMANDS.joined(helper_type.commands)))
        if refused_part is not None:
            return RuleAnswer.refused(HELPER_TYPE_CATEGORY.nudge(helper_type=helper_type.label.lower(), category=refused_part.classification.category.value))
        refusal = self.commands.refusal(self.agents.find(hook.agent_id), self.journal_lines(shell))
        return RuleAnswer.allowed() if refusal is None else RuleAnswer.refused(refusal)

    def command_types(self, helper_type: HelperTypeEntry, commands: CommandAllowList) -> Sequence[str]:
        if helper_type.command_types_setting:
            return self.settings.texts(helper_type.command_types_setting)
        return tuple(category.value for category in commands.categories)

    def journal_lines(self, shell: ShellLine) -> tuple[JournalLine, ...]:
        served = [arguments[:2] for arguments in shell.journal_argument_lines() if len(arguments) > 1 and HELP_FLAG not in arguments and arguments[1] in self.lookup.names(arguments[0])]
        return tuple(JournalLine(" ".join(line), JournalLineClass.subcommand_classes(type(self.lookup.subcommand(*line)))) for line in served)
