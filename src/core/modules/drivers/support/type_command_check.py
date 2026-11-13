from collections.abc import Sequence

from engine.driver.nudge import Nudge
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.journal_line import JournalLine
from core.modules.agents.support.base_commands import BASE_COMMANDS
from core.modules.drivers.support.command_refusal_text import CommandRefusalText


class TypeCommandCheck:
    """Whether an agent of one type may run journal lines: a helper runs its type's list beside the base list every
    helper has, and the main agent runs every line. The hook rule and the server both ask it."""

    def __init__(self, types: HelperTypeBook) -> None:
        self.types = types

    def refusal(self, role: str, lines: Sequence[JournalLine]) -> Nudge | None:
        if not self.types.is_helper(role):
            return None
        helper_type = self.types.find(role)
        commands = BASE_COMMANDS.joined(helper_type.commands)
        refused_line = commands.refused_line(lines)
        return CommandRefusalText(helper_type.label, commands).nudge(refused_line) if refused_line is not None else None
