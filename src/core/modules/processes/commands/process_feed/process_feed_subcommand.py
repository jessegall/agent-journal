from argparse import Namespace

from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.base.model.view_model import ViewModel
from core.base.query.query import Query
from core.modules.processes.models.process_row import ProcessRow
from core.modules.processes.support.main_agent_runs import MainAgentRuns


class ProcessFeedSubcommand(ViewRowsSubcommand):
    """`journal process feed`: a page of processes, newest first, with the line and state the commands windows
    draw, by --id, --agent-id, --environment-id, --before-id and --after-id; the main agent's unless it names
    an agent or a process."""

    model = ProcessRow
    filters = ("id", "environment_id", "agent_id")
    cli_name = "process"
    name = "feed"

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query if arguments.id is not None or arguments.agent_id is not None else query.matching(MainAgentRuns())
