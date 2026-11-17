from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage

from engine.cli.subcommand_lookup import SubcommandLookup
from engine.driver.shell_line import ShellLine
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.journal_line import JournalLine
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.restricted_read_access import HELP_FLAG
from core.modules.drivers.support.type_command_check import TypeCommandCheck


class TypeCommandsPolicy(EventPolicy):
    """A helper runs every shell command and only the journal lines its type lists, beside the base list every
    helper has; the main agent runs every command."""

    key = "drivers.helper-type-commands"
    rank = "drivers.policies"

    def __init__(self, types: HelperTypeBook, lookup: SubcommandLookup, commands: TypeCommandCheck, agents: AgentRows) -> None:
        self.types, self.lookup, self.commands, self.agents = types, lookup, commands, agents

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        agent = self.agents.find(agent_id)
        if shell is None or not self.types.is_helper(agent.role):
            return None
        return self.commands.refusal(agent, self.journal_lines(shell))

    def journal_lines(self, shell: ShellLine) -> tuple[JournalLine, ...]:
        served = [arguments[:2] for arguments in shell.journal_argument_lines() if len(arguments) > 1 and HELP_FLAG not in arguments and arguments[1] in self.lookup.names(arguments[0])]
        return tuple(JournalLine(" ".join(line), JournalLineClass.subcommand_classes(type(self.lookup.subcommand(*line)))) for line in served)
