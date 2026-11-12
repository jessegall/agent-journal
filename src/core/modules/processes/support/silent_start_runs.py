
from engine.enums.command_category import CommandCategory
from engine.driver.shell_line import JOURNAL_PROGRAM
from engine.query.conditions.prefix import Prefix
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.silent_run import SilentRun

RUNS_READ = 6


class SilentStartRuns:
    """The ended runs of one alias or command, newest first. An alias is known by its name, so its arguments
    change nothing; any other command by its text."""

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery, outputs: OutputQuery) -> None:
        self.processes, self.parts, self.outputs = processes, parts, outputs

    @staticmethod
    def name(text: str, program: str, category: CommandCategory) -> str:
        tokens = text.split()
        return f"{JOURNAL_PROGRAM} {tokens[1]}" if program == JOURNAL_PROGRAM and category.is_watched and len(tokens) > 1 else text

    def runs(self, name: str) -> tuple[SilentRun, ...]:
        ended = self.processes.ended().with_part(Prefix("text", name)).newest().take(RUNS_READ)
        silent_runs: list[SilentRun] = []
        for process in ended:
            part = next((part for part in self.parts.process(process.id).get() if self.name(part.text, part.program, part.category) == name), None)
            if part is not None and process.ended_at is not None:
                output = self.outputs.process_output(process.id)
                started_at = process.started_at or process.creation_timestamp()
                silent_runs.append(SilentRun(process, part, int(started_at.elapsed_seconds(process.ended_at)), output is not None and output.progress > 0))
        return tuple(silent_runs)

    @staticmethod
    def silent_run_count(runs: tuple[SilentRun, ...]) -> int:
        count = 0
        for run in runs:
            if not run.is_silent:
                break
            count += 1
        return count
