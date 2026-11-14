from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.remove_reader.remove_reader import RemoveReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.reader_writers import ReaderWriters

READER_USES_REASON = "a removed reader is taken off every output and request that used it"


class RemoveReaderHandler(Handler[RemoveReader, Reader]):
    """Deletes the reader; the guard says whose it may be."""

    command = RemoveReader

    def __init__(self, readers: ReaderQuery, requests: ReaderRequestQuery, outputs: OutputQuery, repository: Repository, writers: ReaderWriters) -> None:
        self.readers, self.requests, self.outputs, self.repository, self.writers = readers, requests, outputs, repository, writers

    def handle(self, command: RemoveReader, context: Context) -> Reader:
        self.writers.check(context.actor)
        reader = self.readers.with_name(command.name).first()
        if reader is None:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        outputs = tuple(self.outputs.filter(reader_id=reader.id).every_row(READER_USES_REASON))
        if any(output.ended_at is None for output in outputs):
            raise Refusal(f"reader {reader.name} is in use by a running output", "wait for the output to end")
        for output in outputs:
            self.repository.update(output, context, reader_id=None)
        for request in self.requests.filter(reader_id=reader.id).every_row(READER_USES_REASON):
            if request.completed_at is not None:
                self.repository.update(request, context, reader_id=None)
        self.repository.delete(reader, context)
        return reader
