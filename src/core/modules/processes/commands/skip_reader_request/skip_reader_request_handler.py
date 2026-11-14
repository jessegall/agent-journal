from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.skip_reader_request.skip_reader_request import SkipReaderRequest
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.run_slots import RunSlots


class SkipReaderRequestHandler(Handler[SkipReaderRequest, ReaderRequest]):
    """Completes a request and releases its queued runs without a reader."""

    command = SkipReaderRequest
    runs_once = True

    def __init__(self, requests: ReaderRequestQuery, repository: Repository, writers: ReaderWriters, slots: RunSlots) -> None:
        self.requests, self.repository, self.writers, self.slots = requests, repository, writers, slots

    def handle(self, command: SkipReaderRequest, context: Context) -> ReaderRequest:
        self.writers.check(context.actor)
        if not command.reason.strip():
            raise Refusal("say why the reader is not needed", '--reason "<why>"')
        request = self.requests.find(command.request_id)
        if request.completed_at is not None:
            return request
        completed = self.repository.save(replace(request, completed_at=context.timestamp, skip_reason=command.reason.strip()), context)
        self.slots.grant(context)
        return completed
