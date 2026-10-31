from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery


class EndedOutputText:
    """The line that tells an agent a run of its own ended: what the reader of the run makes of it, else how it
    ended, and how to read it."""

    def __init__(self, outputs: OutputQuery) -> None:
        self.outputs = outputs

    def line(self, process: Process) -> str:
        return f"output {process.id} ended: {self.summary(process) or self.outcome(process)}; journal output read {process.id} --summary"

    def summary(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return kept[0].reader_summary if kept else ""

    @staticmethod
    def outcome(process: Process) -> str:
        if process.state is ProcessState.FAILED:
            return f"failed with exit code {process.exit_code}"
        return process.state.value
