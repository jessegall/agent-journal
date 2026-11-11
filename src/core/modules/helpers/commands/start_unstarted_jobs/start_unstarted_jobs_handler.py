from datetime import timedelta

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_standing import AgentStanding
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.start_unstarted_jobs.start_unstarted_jobs import StartUnstartedJobs
from core.modules.helpers.support.helper_resume import HelperResume

JOB_START_SECONDS = 60


class StartUnstartedJobsHandler(Handler[StartUnstartedJobs, None]):
    """Starts each kept helper that has had an open job for over a minute while its row is ended and no program
    of it runs: the start of that job was lost, as when the server stopped while it was under way. A helper
    whose program runs is left alone, and the launcher refuses a second program of one agent."""

    command = StartUnstartedJobs
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, standings: AgentStanding, resume: HelperResume) -> None:
        self.queries, self.standings, self.resume = queries, standings, resume

    def handle(self, command: StartUnstartedJobs, context: Context) -> None:
        latest_start = context.timestamp.value - timedelta(seconds=JOB_START_SECONDS)
        open_jobs = self.queries.query(HelperJob).matching(IsNull("ended_at")).all_rows()
        briefs = {job.helper_id: job.brief for job in open_jobs if job.helper_id is not None and job.creation_timestamp().value <= latest_start}
        for helper in self.queries.query(Agent).find_many(sorted(briefs)):
            if self.has_lost_start(helper):
                self.resume.resume(helper, briefs[helper.id])

    def has_lost_start(self, helper: Agent) -> bool:
        return helper.ended_at is not None and helper.is_kept_helper and not self.standings.read(helper).is_running
