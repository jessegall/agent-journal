
from core.base.driver.command_category import CommandCategory
from core.base.driver.shell_line import JOURNAL_PROGRAM
from core.base.query.conditions.prefix import Prefix
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
        words = text.split()
        return f"{JOURNAL_PROGRAM} {words[1]}" if program == JOURNAL_PROGRAM and category.is_watched and len(words) > 1 else text

    def runs(self, name: str) -> tuple[SilentRun, ...]:
        ended = self.processes.ended().with_part(Prefix("text", name)).newest().limited(RUNS_READ)
        found = []
        for process in ended:
            part = next((part for part in self.parts.process(process.id).all_rows() if self.name(part.text, part.program, part.category) == name), None)
            if part is not None and process.ended_at is not None:
                output = self.outputs.process_output(process.id)
                started_at = process.started_at or process.created_at
                found.append(SilentRun(process, part, int(started_at.elapsed_seconds(process.ended_at)), output is not None and output.progress > 0))
        return tuple(found)

    @staticmethod
    def silent_streak(runs: tuple[SilentRun, ...]) -> int:
        streak = 0
        for run in runs:
            if not run.is_silent:
                break
            streak += 1
        return streak
