from engine.event.changed import Changed
from engine.event.logged_event import LoggedEvent
from engine.enums.helper_role import HelperRole
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.support.helper_resume import HelperResume

RESUME_JOB_TEXT = "You were paused and may go on: finish your job."
CHILD_HELPERS_REASON = "the resume reaches every ended child helper of the agent with an open job"


class HelperResumeListener(CommitListener[Changed[Agent]]):
    """An agent that resumes takes back the helpers that ended while it was paused with a job still open."""

    name = "helpers.helper-resume"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, jobs: HelperJobRows, resume: HelperResume) -> None:
        self.queries, self.jobs, self.resume = queries, jobs, resume

    def handle(self, event: Changed[Agent], logged: LoggedEvent) -> None:
        if event.old_row is None or event.old_row.paused_at is None or event.row.paused_at is not None:
            return
        helpers = self.queries.query(Agent).where(parent_id=event.row.id, role=HelperRole.HELPER).where("ended_at", ">", "").where_in("id", self.jobs.open_job_helpers())
        for helper in tuple(helpers.every_row(CHILD_HELPERS_REASON)):
            self.resume.resume(helper, RESUME_JOB_TEXT)
