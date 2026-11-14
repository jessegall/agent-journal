from engine.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.drivers.models.hook_call_row import HookCallRow


class HookCallFeedSubcommand(ViewRowsSubcommand):
    """`journal hook-call feed [--session-agent-id <n>] [--before-id <n>] [--after-id <n>]`: a page of an agent's
    hook calls with the fields the activity window draws."""

    model = HookCallRow
    filters = ["session_agent_id"]
    cli_name = "hook-call"
    name = "feed"
    outward = True
