from argparse import Namespace

from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.base.model.view_model import ViewModel
from core.base.query.query import Query
from core.modules.agents.conditions.main_agent_rows import MainAgentRows
from core.modules.processes.models.process_row import ProcessRow


class ProcessFeedSubcommand(ViewRowsSubcommand):
    """`journal process feed`: a page of processes, newest first, with the line and state the commands windows
    draw, by --id, --session-agent-id, --before-id and --after-id; the main agent's unless it names
    an agent or a process."""

    model = ProcessRow
    filters = ("id", "session_agent_id")
    cli_name = "process"
    name = "feed"
    outward = True

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query if arguments.id is not None or arguments.session_agent_id is not None else query.matching(MainAgentRows())
