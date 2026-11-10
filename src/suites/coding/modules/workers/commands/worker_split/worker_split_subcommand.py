from suites.coding.modules.workers.support.worker_split_problem import WorkerSplitProblem
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.errors.refusal import Refusal
from core.base.scope.scopes import Scopes
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.tasks.models.task import Task
from suites.coding.support.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.support.worker_routing import WorkerRouting
from suites.coding.modules.workers.support.worker_split_preview import WorkerSplitPreview
from argparse import ArgumentParser, Namespace
from dataclasses import asdict
from pathlib import Path

from core.base.caller.caller import Caller
from engine.journal.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.helper_counts import HelperCounts
from suites.coding.modules.workers.support.worker_counts import WorkerCounts


class WorkerSplitSubcommand(ReadSubcommand[RowList | WorkerSplitPreview | WorkerSplitProblem]):
    """Lists program shares, recent task counts and current availability."""

    cli_name = "worker"
    name = "split"
    row_line = "{id}  share {share}%  recent {recent}  {line}  {ends_at}"

    def __init__(self, providers: Providers, shares: ProgramShares, states: ProgramStates,
                 counts: WorkerCounts, environments: EnvironmentRows, home: JournalHome, helpers: HelperCounts, routing: WorkerRouting, profiles: ProfileFiles, types: HelperTypeBook, queries: Queries, scopes: Scopes) -> None:
        self.providers, self.shares, self.states, self.counts, self.environments = providers, shares, states, counts, environments
        self.home = home
        self.helpers = helpers
        self.routing, self.profiles, self.types, self.queries, self.scopes = routing, profiles, types, queries, scopes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--task", type=int, action="append", dest="task_ids", default=[])

    def read(self, arguments: Namespace, caller: Caller) -> RowList | WorkerSplitPreview | WorkerSplitProblem:
        if arguments.task_ids:
            return self.preview(arguments.task_ids, caller)
        folder = self.home.project_folder if caller.environment_id is None else Path(self.environments.find(caller.environment_id).folder)
        shares, counts = self.shares.shares(), self.counts.recent(caller.environment_id)
        helper_counts = self.helpers.recent(caller.environment_id)
        outages = {provider.name: self.states.outage_state(provider.name) for provider in self.providers.all()}
        return RowList([{"id": provider.name, "title": provider.title, "share": shares.get(provider.name, 0),
                         "recent": counts[provider.name], "helpers_recent": helper_counts[provider.name],
                         "windows": [window.line for window in self.states.windows(provider.name)],
                         "outage": not outages[provider.name].is_ready,
                         "outage_reason": outages[provider.name].line if not outages[provider.name].is_ready else None,
                         "outage_ends_at": outages[provider.name].ends_text,
                         **self.states.state(provider.name, folder).listed()}
                        for provider in self.providers.all()])


    def preview(self, task_ids: list[int], caller: Caller) -> WorkerSplitPreview | WorkerSplitProblem:
        tasks = self.queries.query(Task).find_many(task_ids)
        with self.scopes.row_scope(tasks[0]):
            agent = self.queries.query(Agent).find(caller.read_actor_id) if caller.read_actor_id is not None else MainAgentFinder.newest(self.queries)
            profile = self.profiles.effective(self.types.find(CodingHelperRole.WORKER).default_profile)
            try:
                choice = self.routing.choice(DispatchWorker(task_ids[0], delegated_ids=tuple(task_ids[1:])), tasks, agent, profile)
            except Refusal as refusal:
                return WorkerSplitProblem(tuple(task_ids), refusal.text)
            return WorkerSplitPreview(tuple(task_ids), choice.program, choice.model, choice.reason)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, (WorkerSplitPreview, WorkerSplitProblem)):
            output.write(value.line, asdict(value))
            return
        super().write_output(value, output)
