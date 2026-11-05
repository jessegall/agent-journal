from dataclasses import replace

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
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_slots import RunSlots
from core.modules.processes.support.run_title import RunTitle
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class ReaderRequestCompleteListener(SaveListener[Changed[Reader]]):
    """Completes requests read by a newly saved proper reader."""

    name = "processes.reader-request-complete"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, requests: ReaderRequestQuery, judge: ReaderJudge, repository: Repository, clock: Clock, slots: RunSlots) -> None:
        self.queries, self.requests, self.judge, self.repository, self.clock, self.slots = queries, requests, judge, repository, clock, slots

    def handle(self, event: Changed[Reader], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        reader = event.row
        for request in self.requests.open_rows():
            scope = ReaderSampleScope(request.creator_id, request.command)
            if not ReaderSelection.reads_command(reader, request.command, request.category) or not self.judge.judged_command(reader, request.category, scope).is_proper:
                continue
            completed = self.repository.update(request, context, reader_id=reader.id, completed_at=self.clock.timestamp())
            self.requests.remove_completed(completed)
            for waiting in self.queries.query(ProcessPart).filter(reader_request_id=request.id).all_rows():
                for output in self.queries.query(Output).filter(process_id=waiting.process_id, ended_at=None).all_rows():
                    self.repository.save(replace(output, reader_id=reader.id, reader_position=waiting.position, read_offset=0,
                                                 title=RunTitle.title(reader, waiting.command or waiting.text)), context)
            self.slots.grant(request.environment_id, context)
