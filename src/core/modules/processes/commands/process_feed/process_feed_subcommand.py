from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.processes.models.process_row import ProcessRow


class ProcessFeedSubcommand(ViewRowsSubcommand):
    """`journal process feed [--id <n>] [--environment-id <n>] [--before-id <n>] [--after-id <n>]`: a page of
    processes,
    newest first, with the line and state the commands windows draw."""

    model = ProcessRow
    filters = ("id", "environment_id")
    cli_name = "process"
    name = "feed"
