from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.waits.models.waiting_row import WaitingRow


class WaitingWaitSubcommand(ViewRowsSubcommand):
    """`journal wait waiting [--before-id <n>] [--after-id <n>]`: the open waits that wait on the user, each
    with the rows it waits on."""

    model = WaitingRow
    cli_name = "wait"
    name = "waiting"
