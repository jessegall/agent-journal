from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.sequences.models.sequence_run_row import SequenceRunRow


class SequenceRunListSubcommand(ViewRowsSubcommand):
    """`journal sequence-run list [--sequence-id <n>]`: the sequence runs still going in this environment."""

    cli_name = "sequence-run"
    name = "list"
    model = SequenceRunRow
    filters = ("environment_id", "sequence_id")
