from dataclasses import replace

from core.base.change.change import Change
from core.base.clock import Clock
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.models.output import Output
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_slots import RunSlots


class ReaderRequestSettleListener(SaveListener):
    """Settles requests read by a newly saved proper reader."""

    name = "processes.reader-request-settle"
    event = "reader.*"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, requests: ReaderRequestQuery, judge: ReaderJudge, repository: Repository, clock: Clock, slots: RunSlots) -> None:
        self.queries, self.requests, self.judge, self.repository, self.clock, self.slots = queries, requests, judge, repository, clock, slots

    def handle(self, change: Change[Model]) -> None:
        reader = change.new_row
        if not isinstance(reader, Reader):
            return
        for request in tuple(self.requests.open().all_rows()):
            if not ReaderSelection.reads_command(reader, request.command, request.category) or not self.judge.judged(reader, request.category).is_proper:
                continue
            self.repository.save(replace(request, reader_id=reader.id, settled_at=self.clock.timestamp()), change.context)
            for waiting in self.queries.query(ProcessPart).filter(reader_request_id=request.id).all_rows():
                for output in self.queries.query(Output).filter(process_id=waiting.process_id, ended_at=None).all_rows():
                    self.repository.save(replace(output, reader_id=reader.id, reader_position=waiting.position, read_offset=0), change.context)
            self.slots.grant(request.environment_id, change.context)
