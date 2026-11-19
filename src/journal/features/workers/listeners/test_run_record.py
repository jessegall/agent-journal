from pathlib import Path

from journal.events.listener import Listener
from journal.events.rows.row_resolved import RowResolved
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.readers import Readers
from journal.features.workers.support.test_run_result import TestRunResult
from journal.features.workers.support.test_turns import TestTurns
from journal.models.command_output import CommandOutput
from journal.models.support.ref import Ref
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.test_turns import TestTurns as TurnRows


class TestRunRecord(Listener[RowResolved]):
    """A worker's test run moved to the background is kept on its worker once its output ends, as a run that ends in the foreground is by its turn; a run stopped before it ended counts neither way."""

    __test__ = False

    def __init__(self, turns: TestTurns, rows: TurnRows, outputs: CommandOutputs, readers: Readers) -> None:
        self.turns, self.rows, self.outputs, self.readers = turns, rows, outputs, readers

    def handle(self, event: RowResolved) -> None:
        ref = Ref.parse(event.ref)
        if ref.type != CommandOutput.table():
            return
        turns = self.rows.output_turns(ref.id)
        output = self.outputs.find(ref.id)
        if not turns or output.is_interrupted:
            return
        files = OutputFiles(Path(output.folder))
        lines = files.lines() if files.is_stored() else []
        self.turns.recorded(turns[0], TestRunResult.read(output.status, lines, self.readers.reading(turns[0].command)))
