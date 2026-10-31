from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection


class EndedOutputText:
    """The line that tells an agent a run of its own ended: what the reader of the run makes of it, else how it ended,
    and how to read it."""

    def __init__(self, folder: OutputFolder, readers: ReaderQuery, run: ReaderRun) -> None:
        self.folder, self.readers, self.run = folder, readers, run

    def line(self, process: Process) -> str:
        return f"output {process.id} ended: {self.summary(process) or self.how(process)}; journal output read {process.id} --summary"

    def summary(self, process: Process) -> str:
        reader = ReaderSelection.of(tuple(self.readers.all_rows()), process)
        text = "".join(self.folder.output(process.id, position) for position in range(1, len(self.folder.part_texts(process.id)) + 1))
        return self.run.summary(reader, text) if reader is not None else ""

    @staticmethod
    def how(process: Process) -> str:
        if process.state is ProcessState.FAILED:
            return f"failed with exit code {process.exit_code}"
        return process.state.value
