from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_resume import HelperResume


STOPPED = "Stopped"


class HelperEndedListener(CommitListener[AgentEnded]):
    """A helper that ends with a job line still waiting resumes for it; otherwise its open job ends with it, and one
    ended by another agent or a person has its program stopped."""

    name = "helpers.helper-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, jobs: HelperJobRows, resume: HelperResume, bus: Bus, launcher: LauncherLink) -> None:
        self.queries, self.jobs, self.resume, self.bus, self.launcher = queries, jobs, resume, bus, launcher

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        helper = event.row
        if helper.role != AgentRole.HELPER:
            return
        open_jobs = [job for job in self.jobs.helper_jobs(helper.id) if job.ended_at is None]
        if not open_jobs:
            return
        waiting = self.queries.query(AgentLine).filter(session_agent_id=helper.id, state=AgentLineState.WAITING, source=HELPER_JOB_SOURCE).oldest().first()
        if waiting is not None:
            self.resume.resume(helper, waiting.text)
            return
        stopped = logged.actor_id != helper.id
        self.bus.run(EndHelperJob(open_jobs[-1].id, STOPPED if stopped else ""), Actor.core(), cause_id=logged.id, environment_id=helper.environment_id)
        if stopped:
            self.launcher.stop(helper.id)
