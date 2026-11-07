from argparse import ArgumentParser, Namespace

from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.base.driver.hook_event_name import HookEventName
from core.base.model.view_model import ViewModel
from core.base.query.query import Query
from core.modules.drivers.models.hook_call_row import HookCallRow


class HookCallStopsSubcommand(ViewRowsSubcommand):
    """Reads one agent's stops and their checks from the existing hook records."""

    model = HookCallRow
    cli_name = "hook-call"
    name = "stops"

    def arguments(self, parser: ArgumentParser) -> None:
        super().arguments(parser)
        parser.add_argument("--session-agent-id", type=int, required=True)

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query.filter(session_agent_id=arguments.session_agent_id, hook=HookEventName.STOP)
