from argparse import Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.helpers.support.program_states import ProgramStates
from suites.coding.modules.workers.support.worker_counts import WorkerCounts


class WorkerSplitSubcommand(ReadSubcommand[RowList]):
    """Lists program shares, recent task counts and current availability."""

    cli_name = "worker"
    name = "split"
    row_line = "{id}  share {share}%  recent {recent}  {line}  {ends_at}"

    def __init__(self, providers: Providers, shares: ProgramShares, states: ProgramStates,
                 counts: WorkerCounts, environments: EnvironmentRows, home: JournalHome) -> None:
        self.providers, self.shares, self.states, self.counts, self.environments = providers, shares, states, counts, environments
        self.home = home

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        folder = self.home.project_folder if caller.environment_id is None else Path(self.environments.find(caller.environment_id).folder)
        shares, counts = self.shares.shares(), self.counts.recent(caller.environment_id)
        return RowList([{"id": provider.name, "title": provider.title, "share": shares.get(provider.name, 0),
                         "recent": counts[provider.name], **self.states.state(provider.name, folder).listed()}
                        for provider in self.providers.all()])
