from engine.driver.command_category import CommandCategory
from engine.driver.shell_line import ShellLine
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_waits import RunWaits

MEGABYTE = 1 << 20
MAX_FOREGROUND_SECONDS = 15


class ForegroundLimit:
    """How a shell line is run: in the background at once for an alias marked so or a part that went past the
    limit in an earlier run, else the seconds the settings give, fewer for the main agent while the user
    waits on a message; a line that runs an alias is judged by the command under the alias, as the hook
    classified it, and read by the alias's reader. The test runs and builds of a line keep more of their
    output. A queued line of an agent with a wait of its own holds the call for that wait."""

    def __init__(self, settings: ProcessSettings, background: BackgroundCommands, processes: ProcessQuery, messages: MessageQuery, waits: RunWaits) -> None:
        self.settings, self.background, self.processes, self.messages, self.waits = settings, background, processes, messages, waits

    def decide(self, shell: ShellLine, agent_id: int) -> ForegroundRun:
        alias_runs = self.background.alias_runs(shell)
        part_commands = tuple(self.background.part_command(part, shell) for part in shell.parts)
        declared = self.background.declared_category(shell)
        if shell.is_journal_line and all(command.category is CommandCategory.JOURNAL for command in part_commands):
            return ForegroundRun(0, self.background.includes(shell), part_commands=part_commands, most_output_bytes=self.output_limit(ProcessSetting.MOST_OUTPUT_MEGABYTES))
        seconds = self.seconds_allowed(agent_id)
        is_long = self.processes.has_moved_run(tuple(dict.fromkeys(part.text for part in shell.pipeline_heads)), seconds)
        reader_ids = {options.reader_id for options in alias_runs if options.reader_id is not None}
        reader_id = reader_ids.pop() if len(reader_ids) == 1 else None
        has_long_part = any(part.classification.category.is_long_running or self.background.is_long_alias(part, shell) for part in shell.parts)
        output_setting = ProcessSetting.MOST_TEST_OUTPUT_MEGABYTES if has_long_part else ProcessSetting.MOST_OUTPUT_MEGABYTES
        queued = any(command.category.is_queued for command in part_commands) and all(command.category.is_queued or command.category is CommandCategory.JOURNAL for command in part_commands)
        background, queue_wait = self.background.includes(shell) or is_long, self.settings.integer(ProcessSetting.QUEUE_WAIT_SECONDS)
        wait = self.waits.seconds(agent_id) if queued else None
        if wait is not None:
            seconds, background, queue_wait = wait, wait == 0, wait
        return ForegroundRun(seconds, background, reader_id, self.background.alias_names(shell), declared, part_commands=part_commands,
                             queued=queued,
                             most_output_bytes=self.output_limit(output_setting),
                             read_flags=tuple(f"{position}:{part.read_flag}" for position, part in enumerate(shell.parts, start=1) if part.read_flag),
                             queue_wait_seconds=queue_wait,
                             timeout_durations=tuple(part.timeout_duration for part in shell.parts if part.timeout_duration is not None),
                             counted_queue=wait is not None)

    def output_limit(self, setting: ProcessSetting) -> int:
        return max(1, self.settings.integer(setting)) * MEGABYTE

    def seconds_allowed(self, agent_id: int) -> int:
        is_waiting = self.messages.unread(agent_id).exists()
        return min(MAX_FOREGROUND_SECONDS, max(1, self.settings.integer(ProcessSetting.WAITING_FOREGROUND_SECONDS if is_waiting else ProcessSetting.FOREGROUND_SECONDS)))
