from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reader_request import ReaderRequest
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import READER_SAMPLE_READY


class ReaderSampleReadyListener(SaveListener):
    """Tells workers how to read an ended sample with its new reader."""

    name = "workers.reader-sample-ready"
    event = "reader_request.update"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, change: Change[Model]) -> None:
        request = change.new_row
        if not isinstance(request, ReaderRequest) or request.reader_id is None or request.sample_process_id is None:
            return
        if isinstance(change.old_row, ReaderRequest) and change.old_row.settled_at is not None:
            return
        sample = self.queries.query(Process).find(request.sample_process_id)
        if sample.ended_at is None:
            return
        reader = self.queries.query(Reader).find(request.reader_id)
        worker_ids = {self.queries.query(Process).find(part.process_id).agent_id for part in self.queries.query(ProcessPart).filter(reader_request_id=request.id).all_rows()}
        for worker_id in worker_ids:
            if self.queries.query(Agent).find(worker_id).role is AgentRole.WORKER:
                self.nudger.send(worker_id, READER_SAMPLE_READY, WORKER_JOB_SOURCE, change.context, output=sample.id, reader=reader.name)
