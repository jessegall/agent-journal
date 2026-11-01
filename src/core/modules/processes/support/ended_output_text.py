import re
from pathlib import PurePath

from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery

FILE_REDIRECT = re.compile(r"(?:^|\s)(?:\d|&)?>>?\s*(?!/dev/)[\w./~-]+")


class EndedOutputText:
    """The lines that tell an agent a run of its own ended: what the reader of the run makes of it, else how it
    ended, and how to read it; and how to read such a run better next time."""

    def __init__(self, outputs: OutputQuery) -> None:
        self.outputs = outputs

    def line(self, process: Process) -> str:
        return f"output {process.id} ended: {self.summary(process) or self.outcome(process)}; journal output read {process.id} --summary"

    def lines(self, process: Process) -> tuple[str, ...]:
        advice = self.advice(process)
        return (self.line(process), advice) if advice else (self.line(process),)

    def advice(self, process: Process) -> str:
        if FILE_REDIRECT.search(process.line):
            return f"output {process.id} sent its output to a file, so no reader saw it: run it without the redirect and read it with journal output read {process.id}"
        kept = self.outputs.process(process.id).page(1, 1).rows
        if not kept or kept[0].reader_id is not None or not kept[0].line_count:
            return ""
        first = process.line.split()[0]
        name = PurePath(first).name
        return f'no reader reads {name} yet: fill in journal reader add {name} --commands "{first}*" --lines "<the lines that matter>" from this run\'s output and run it'

    def summary(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return kept[0].reader_summary if kept else ""

    @staticmethod
    def outcome(process: Process) -> str:
        if process.state is ProcessState.FAILED:
            return f"failed with exit code {process.exit_code}"
        return process.state.value
