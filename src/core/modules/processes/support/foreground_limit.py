from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import ShellLine
from core.base.query.queries import Queries
from core.base.query.conditions.is_null import IsNull
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.process_settings import ProcessSettings

AT_ONCE = (CommandCategory.TEST_RUN, CommandCategory.BUILD)


@dataclass(frozen=True)
class ForegroundRun:
    """How long a line may run in the foreground, and whether it goes to the background at once."""

    seconds: int
    background: bool


class ForegroundLimit:
    """How a shell line is run: none to move for a line of journal commands, at once in the background for a journal
    command its module marks, a test run, a build or a command whose last run went past the limit, else the seconds
    the settings give, fewer while the user waits on a message."""

    def __init__(self, settings: ProcessSettings, background: BackgroundCommands, processes: ProcessQuery, queries: Queries) -> None:
        self.settings, self.background, self.processes, self.queries = settings, background, processes, queries

    def of(self, environment_id: int, shell: ShellLine) -> ForegroundRun:
        is_journal_background = self.background.includes(shell)
        if shell.is_journal_line and not is_journal_background:
            return ForegroundRun(0, False)
        seconds = self.waiting_or_usual(environment_id)
        return ForegroundRun(seconds, is_journal_background or self.is_at_once(environment_id, shell))

    def is_at_once(self, environment_id: int, shell: ShellLine) -> bool:
        if any(part.classification.category in AT_ONCE for part in shell.parts):
            return True
        return self.processes.environment(environment_id).line(shell.line).moved().exists()

    def waiting_or_usual(self, environment_id: int) -> int:
        is_waiting = self.queries.query(Message).filter(environment_id=environment_id, type=MessageType.USER).matching(IsNull("read_at")).exists()
        return self.settings.waiting_seconds(environment_id) if is_waiting else self.settings.foreground_seconds(environment_id)
