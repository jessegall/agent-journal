from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from engine.driver.nudger import Nudger
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reader_request import ReaderRequest
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import READER_SAMPLE_READY
from engine.change.updated import Updated
from engine.command.context import Context


class ReaderSampleReadyListener(SaveListener[Updated[ReaderRequest]]):
    """Tells workers how to read an ended sample with its new reader."""

    name = "workers.reader-sample-ready"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, event: Updated[ReaderRequest], context: Context) -> None:
        request = event.row
        if request.reader_id is None or request.sample_process_id is None:
            return
        if event.old_row is not None and event.old_row.completed_at is not None:
            return
        sample = self.queries.query(Process).find(request.sample_process_id)
        if sample.ended_at is None:
            return
        reader = self.queries.query(Reader).find(request.reader_id)
        if self.queries.query(Agent).find(sample.session_agent_id).role == CodingHelperRole.WORKER:
            self.nudger.send(sample.session_agent_id, READER_SAMPLE_READY, WORKER_JOB_SOURCE, context, output=sample.id, reader=reader.name)
