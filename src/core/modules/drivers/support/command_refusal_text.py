from dataclasses import dataclass

from engine.driver.agent_message import AgentMessage
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.journal_line import JournalLine
from core.modules.drivers.nudges.helper_type_command_message import HelperTypeCommandMessage

EMPTY_LIST_TEXT = "none"


@dataclass(frozen=True)
class CommandRefusalText:
    """The refusal of a journal line a helper's type does not list: it names the line and the groups and lines the
    type runs, and nothing else."""

    label: str
    commands: CommandAllowList

    def nudge(self, line: JournalLine) -> AgentMessage:
        return HelperTypeCommandMessage.declared().nudge(helper_type=self.label.lower(), line=line.text, groups=", ".join(self.commands.groups) or EMPTY_LIST_TEXT,
                                         lines=", ".join(self.commands.lines) or EMPTY_LIST_TEXT)
