from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.agent_role import AgentRole
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.support.helper_resume import HelperResume

RESUME_JOB_TEXT = "You were paused and may go on: finish your job."


class HelperResumeListener(CommitListener[Changed[Agent]]):
    """An agent that resumes takes back the helpers that ended while it was paused with a job still open."""

    name = "helpers.helper-resume"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, jobs: HelperJobRows, resume: HelperResume) -> None:
        self.queries, self.jobs, self.resume = queries, jobs, resume

    def handle(self, event: Changed[Agent], logged: LoggedEvent) -> None:
        if event.old_row is None or event.old_row.paused_at is None or event.row.paused_at is not None:
            return
        helpers = self.queries.query(Agent).filter(parent_id=event.row.id, role=AgentRole.HELPER).matching(Greater("ended_at", "")).all_rows()
        for helper in tuple(helpers):
            if self.jobs.open_job(helper.id) is not None:
                self.resume.resume(helper, RESUME_JOB_TEXT)
