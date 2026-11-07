from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper
from core.modules.helpers.support.helper_reach import HelperReach

STOPPED_RETURN = "The job was stopped while its helper was not running."


class StopHelperHandler(Handler[StopHelper, None]):
    """Ends a helper's row; HelperEndedListener then ends its job as stopped and EndedAgentProgramListener stops its
    program."""

    command = StopHelper

    def __init__(self, reach: HelperReach, bus: Bus, jobs: HelperJobRows) -> None:
        self.reach, self.bus, self.jobs = reach, bus, jobs

    def handle(self, command: StopHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context.actor)
        if helper.ended_at is None:
            self.bus.dispatch(EndAgent(helper.id), context)
            return
        job = self.jobs.open_job(helper.id)
        if job is not None:
            self.bus.dispatch(EndHelperJob(job.id, STOPPED_RETURN), context)
