from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import ShellLine
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings

BACKGROUND_CATEGORIES = frozenset((CommandCategory.TEST_RUN, CommandCategory.BUILD))


class ForegroundLimit:
    """How a shell line is run: no limit to move at for a line of journal commands, in the
    background at once for an alias marked so, a test run, a build or a command whose last run
    went past the limit, else the seconds the settings give, fewer while the user waits on a
    message; a line that runs an alias is a shell line, read by the alias's reader."""

    def __init__(self, settings: ProcessSettings, background: BackgroundCommands, processes: ProcessQuery, queries: Queries) -> None:
        self.settings, self.background, self.processes, self.queries = settings, background, processes, queries

    def decide(self, environment_id: int, shell: ShellLine) -> ForegroundRun:
        alias_runs = self.background.alias_runs(shell)
        if shell.is_journal_line and not alias_runs:
            return ForegroundRun(0, False)
        declared = self.background.declared_category(shell)
        categories = {part.classification.category for part in shell.parts}
        categories.update(category for category in [declared] if category is not None)
        is_long = bool(categories & BACKGROUND_CATEGORIES) or self.has_moved_run(environment_id, shell.line)
        reader_id = next((options.reader_id for options in alias_runs if options.reader_id is not None), None)
        return ForegroundRun(self.seconds_allowed(environment_id), self.background.includes(shell) or is_long, reader_id, self.background.alias_names(shell), declared)

    def has_moved_run(self, environment_id: int, line: str) -> bool:
        return self.processes.environment(environment_id).line(line).moved().exists()

    def seconds_allowed(self, environment_id: int) -> int:
        is_waiting = self.queries.query(Message).filter(environment_id=environment_id, type=MessageType.USER).matching(IsNull("read_at")).exists()
        return self.settings.integer(ProcessSetting.WAITING_FOREGROUND_SECONDS if is_waiting else ProcessSetting.FOREGROUND_SECONDS, environment_id)
