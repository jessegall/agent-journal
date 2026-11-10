from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE


class HelperJobSourceListener(SaveListener[Moved[AgentLine]]):
    """Activates a follow-up's request only when the helper receives that job."""

    name = "helpers.job-source"
    moves = [AgentLineLifecycle.deliver, AgentLineLifecycle.enter]

    def __init__(self, queries: Queries, jobs: HelperJobRows, repository: Repository) -> None:
        self.queries, self.jobs, self.repository = queries, jobs, repository

    def handle(self, event: Moved[AgentLine], context: Context) -> None:
        if event.row.source != HELPER_JOB_SOURCE:
            return
        pending = self.queries.query(HelperJob).filter(source_line_id=event.row.id).first()
        if pending is None or pending.started_at is not None or pending.helper_id != event.row.session_agent_id:
            return
        active = self.jobs.open_job(event.row.session_agent_id)
        if active is not None:
            self.repository.update(active, context, ended_at=context.timestamp)
        self.repository.update(pending, context, started_at=context.timestamp)
