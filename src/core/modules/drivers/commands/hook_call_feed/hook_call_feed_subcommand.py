from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.drivers.models.hook_call_row import HookCallRow


class HookCallFeedSubcommand(ViewRowsSubcommand):
    """`journal hook-call feed [--agent-id <n>] [--before-id <n>] [--after-id <n>]`: a page of an agent's hook calls
    with the fields the activity window draws."""

    cli_name = "hook-call"
    name = "feed"
    model = HookCallRow
    filters = ("agent_id",)
