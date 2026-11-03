from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import ShellLine
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.processes.queries.conditions.part_ran_seconds import PartRanSeconds
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings


class ForegroundLimit:
    """How a shell line is run: no limit to move at for a line of journal commands, in the
    background at once for an alias marked so, a test run, a build or a part that went past the
    limit in an earlier run, else the seconds the settings give, fewer while the user waits on a
    message; a line that runs an alias is judged by the command under the alias, as the hook
    classified it, and read by the alias's reader."""

    def __init__(self, settings: ProcessSettings, background: BackgroundCommands, processes: ProcessQuery, queries: Queries) -> None:
        self.settings, self.background, self.processes, self.queries = settings, background, processes, queries

    def decide(self, environment_id: int, shell: ShellLine) -> ForegroundRun:
        alias_runs = self.background.alias_runs(shell)
        if shell.is_journal_line and (not alias_runs or all(part.classification.category is CommandCategory.JOURNAL for part in shell.parts)):
            return ForegroundRun(0, False)
        declared = self.background.declared_category(shell)
        categories = {part.classification.category for part in shell.parts}
        categories.update(category for category in [declared] if category is not None)
        is_long = any(category.is_long_running for category in categories) or self.has_moved_run(environment_id, shell)
        reader_id = next((options.reader_id for options in alias_runs if options.reader_id is not None), None)
        return ForegroundRun(self.seconds_allowed(environment_id), self.background.includes(shell) or is_long, reader_id, self.background.alias_names(shell), declared)

    def has_moved_run(self, environment_id: int, shell: ShellLine) -> bool:
        commands = tuple(part.text for part in shell.parts)
        return bool(commands) and self.processes.environment(environment_id).with_part(Among("text", commands), PartRanSeconds(self.seconds_allowed(environment_id))).moved().exists()

    def seconds_allowed(self, environment_id: int) -> int:
        is_waiting = self.queries.query(Message).filter(environment_id=environment_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).exists()
        return self.settings.integer(ProcessSetting.WAITING_FOREGROUND_SECONDS if is_waiting else ProcessSetting.FOREGROUND_SECONDS, environment_id)
