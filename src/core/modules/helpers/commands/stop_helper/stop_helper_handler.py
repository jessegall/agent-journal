from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.queries.helper_job_query import HelperJobQuery
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper
from core.modules.helpers.support.helper_reach import HelperReach

STOPPED = "Stopped"


class StopHelperHandler(Handler[StopHelper, None]):
    """Ends a helper's open job as stopped and ends the helper; the launcher stops a program whose row ended."""

    command = StopHelper

    def __init__(self, reach: HelperReach, jobs: HelperJobQuery, bus: Bus, repository: Repository) -> None:
        self.reach, self.jobs, self.bus, self.repository = reach, jobs, bus, repository

    def handle(self, command: StopHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context)
        for job in self.jobs.helper_jobs(helper.id):
            if job.ended_at is None:
                self.repository.save(job.changed(ended_at=context.timestamp, returned=STOPPED), context)
        if helper.ended_at is None:
            self.bus.dispatch(EndAgent(helper.id), context)
