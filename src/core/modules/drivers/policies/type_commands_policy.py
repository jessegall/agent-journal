from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from collections.abc import Sequence

from engine.cli.subcommand_lookup import SubcommandLookup
from engine.driver.shell_line import ShellLine
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.journal_line import JournalLine
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.base_commands import BASE_COMMANDS
from core.modules.drivers.nudges.helper_type_category_message import HelperTypeCategoryMessage
from core.modules.drivers.support.read_only_access import HELP_FLAG
from core.modules.drivers.support.type_command_check import TypeCommandCheck


class TypeCommandsPolicy(EventPolicy):
    """A helper runs only the shell command types and the journal lines its type lists, beside the base list every
    helper has; the main agent runs every command."""

    key = "drivers.helper-type-commands"
    rank = "drivers.policies"

    def __init__(self, types: HelperTypeBook, lookup: SubcommandLookup, settings: SettingValues, commands: TypeCommandCheck, agents: AgentRows) -> None:
        self.types, self.lookup, self.settings, self.commands, self.agents = types, lookup, settings, commands, agents

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        agent = self.agents.find(agent_id)
        if shell is None or not self.types.is_helper(agent.role):
            return None
        helper_type = self.types.find(agent.role)
        refused_part = shell.disallowed_part(self.command_types(helper_type, BASE_COMMANDS.joined(helper_type.commands)))
        if refused_part is not None:
            return HelperTypeCategoryMessage.declared().nudge(helper_type=helper_type.label.lower(), category=refused_part.classification.category.value,
                                                            hint=f". {helper_type.refusal_hint}" if helper_type.refusal_hint else "")
        return self.commands.refusal(agent, self.journal_lines(shell))

    def command_types(self, helper_type: HelperTypeEntry, commands: CommandAllowList) -> Sequence[str]:
        if helper_type.command_types_setting:
            return self.settings.texts(helper_type.command_types_setting)
        return tuple(category.value for category in commands.categories)

    def journal_lines(self, shell: ShellLine) -> tuple[JournalLine, ...]:
        served = [arguments[:2] for arguments in shell.journal_argument_lines() if len(arguments) > 1 and HELP_FLAG not in arguments and arguments[1] in self.lookup.names(arguments[0])]
        return tuple(JournalLine(" ".join(line), JournalLineClass.subcommand_classes(type(self.lookup.subcommand(*line)))) for line in served)
