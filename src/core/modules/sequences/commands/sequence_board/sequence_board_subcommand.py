from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run_row import SequenceRunRow
from core.modules.sequences.support.sequence_board import SequenceBoard


class SequenceBoardSubcommand(ReadSubcommand[SequenceBoard]):
    """Reads sequences with their current runs."""

    cli_name = "sequence"
    name = "board"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> SequenceBoard:
        sequences = self.queries.query(Sequence).oldest().all_rows()
        runs = self.queries.query(SequenceRunRow).newest().limited(PAGE_SIZE_ROWS)
        return SequenceBoard(tuple(sequences), tuple(runs))

    def write_output(self, value: object, output: Output) -> None:
        assert isinstance(value, SequenceBoard)
        output.write("\n".join(row.title for row in value.sequences) or "no sequences yet", {
            "rows": [output.values(row) for row in value.sequences], "runs": [row.json() for row in value.runs],
        })
