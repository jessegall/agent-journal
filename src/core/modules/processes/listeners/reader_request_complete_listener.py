from dataclasses import replace

from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.models.output import Output
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_title import RunTitle
from core.modules.processes.support.running_output_readers import RunningOutputReaders
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context


class ReaderRequestCompleteListener(SaveListener[Changed[Reader]]):
    """Completes requests read by a newly saved proper reader, and puts a reader an agent or a person saved on the
    running outputs it reads that have no reader yet; the stock readers are left to the start of a run."""

    name = "processes.reader-request-complete"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, requests: ReaderRequestQuery, judge: ReaderJudge, repository: Repository, clock: Clock, bus: Bus, rows: ReaderRows,
                 running: RunningOutputReaders) -> None:
        self.queries, self.requests, self.judge, self.repository, self.clock, self.bus, self.rows = queries, requests, judge, repository, clock, bus, rows
        self.running = running

    def handle(self, event: Changed[Reader], context: Context) -> None:
        if isinstance(event, Deleted):
            self.rows.remove(event.row)
            return
        reader = event.row
        self.rows.save(reader)
        for request in self.requests.open_rows():
            scope = ReaderSampleScope(request.creator_id, request.command)
            if not ReaderSelection.reads_command(reader, request.command, request.category) or not self.judge.judged_command(reader, request.category, scope).is_valid:
                continue
            completed = self.repository.update(request, context, reader_id=reader.id, completed_at=self.clock.timestamp())
            self.requests.remove_completed(completed)
            for waiting in self.queries.query(ProcessPart).filter(reader_request_id=request.id).all_rows():
                for output in self.queries.query(Output).filter(process_id=waiting.process_id, ended_at=None).all_rows():
                    self.repository.save(replace(output, reader_id=reader.id, reader_position=waiting.position, read_offset=0, displayed_offset=0,
                                                 title=RunTitle.title(reader, waiting.command or waiting.text)), context)
            self.bus.dispatch(GrantRunSlots(), context)
        if not reader.is_default:
            self.running.attach(reader, context)
