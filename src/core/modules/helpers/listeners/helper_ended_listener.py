from engine.enums.helper_role import HelperRole
from core.base.change.logged_event import LoggedEvent
from engine.actor.actor import Actor
from core.base.command.bus import Bus
from engine.journal.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_resume import HelperResume


STOPPED = "Stopped"


class HelperEndedListener(CommitListener[AgentEnded]):
    """A helper that ends with a job line still waiting resumes for it; while it or its parent is paused its job
    stays held; otherwise its open job ends with a report so the parent always hears."""

    name = "helpers.helper-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, jobs: HelperJobRows, resume: HelperResume, bus: Bus, home: JournalHome) -> None:
        self.queries, self.jobs, self.resume, self.bus, self.home = queries, jobs, resume, bus, home

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        helper = event.row
        if helper.role != HelperRole.HELPER:
            return
        job = self.jobs.open_job(helper.id)
        if job is None:
            self.home.terminal_file(helper.id).unlink(missing_ok=True)
            return
        if self.is_paused(helper):
            return
        waiting = self.queries.query(AgentLine).filter(session_agent_id=helper.id, state=AgentLineState.WAITING, source=HELPER_JOB_SOURCE).oldest().first()
        if waiting is not None:
            self.resume.resume(helper, waiting.text)
            return
        self.end_job(helper, job, STOPPED if logged.actor_id != helper.id else "", logged)
        self.home.terminal_file(helper.id).unlink(missing_ok=True)

    def is_paused(self, helper: Agent) -> bool:
        parent = self.queries.query(Agent).find(helper.parent_id) if helper.parent_id is not None else None
        return helper.paused_at is not None or (parent is not None and parent.paused_at is not None)

    def end_job(self, helper: Agent, job: HelperJob, text: str, logged: LoggedEvent) -> None:
        if helper.parent_id is None:
            self.bus.run(EndHelperJob(job.id, text), Actor.core(), cause_id=logged.id, environment_id=helper.environment_id)
            return
        self.bus.run(RecordParentReport(helper.id, helper.parent_id, text, job.id), Actor.core(), cause_id=logged.id, environment_id=helper.environment_id)
