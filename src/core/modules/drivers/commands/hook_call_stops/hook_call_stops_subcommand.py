from argparse import Namespace

from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.base.driver.hook_event_name import HookEventName
from core.base.model.view_model import ViewModel
from core.base.query.query import Query
from core.modules.drivers.models.hook_call_row import HookCallRow


class HookCallStopsSubcommand(ViewRowsSubcommand):
    """Reads stops and their checks from the existing hook records."""

    model = HookCallRow
    filters = ["session_agent_id"]
    cli_name = "hook-call"
    name = "stops"

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query.filter(hook=HookEventName.STOP)
