from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.report_stopped_worker_runs.report_stopped_worker_runs import SOURCE_KEY_PREFIX, ReportStoppedWorkerRuns
from suites.coding.modules.workers.models.merger_line import MergerLine

STOPPED_RUNS_REASON = "the tick reports in every environment with a run of a stopped worker"


class StoppedWorkerRuns:
    """Has each environment report its stopped workers that wait on a run that still goes: an environment
    with a run of an ended worker, or with a line about such a run that is still open."""

    def __call__(self, container: Container) -> None:
        queries = container.get(Queries)
        runs = tuple(container.get(ProcessQuery).running().every_row(STOPPED_RUNS_REASON))
        owners = queries.query(Agent).find_many(sorted({run.session_agent_id for run in runs}))
        stopped_workers = [owner for owner in owners if owner.role == CodingHelperRole.WORKER and owner.ended_at is not None]
        open_lines = queries.query(MergerLine).matching(Prefix("source_key", SOURCE_KEY_PREFIX)).matching(IsNull("outcome")).every_row(STOPPED_RUNS_REASON)
        for environment_id in sorted({row.environment_id for row in (*stopped_workers, *open_lines)}):
            container.get(Bus).run(ReportStoppedWorkerRuns(), Actor.core(), environment_id=environment_id)
