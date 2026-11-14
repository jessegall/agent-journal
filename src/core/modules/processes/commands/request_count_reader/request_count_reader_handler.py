from engine.errors.refusal import Refusal
from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.repository.repository import Repository
from core.modules.processes.commands.request_count_reader.request_count_reader import RequestCountReader
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.reader_requests import COUNT_MISSING_REASON, ReaderRequests


class RequestCountReaderHandler(Handler[RequestCountReader, int]):
    """Opens the reader request of a run's first test part, whose tests could not be counted, so the agent that
    ran it may save a reader that counts them on its own; the part keeps the request."""

    command = RequestCountReader

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery, requests: ReaderRequests, repository: Repository) -> None:
        self.processes, self.parts, self.requests, self.repository = processes, parts, requests, repository

    def handle(self, command: RequestCountReader, context: Context) -> int:
        process = self.processes.find(command.process_id)
        part = self.parts.process(process.id).filter(category=CommandCategory.TEST_RUN).oldest().first()
        if part is None:
            raise Refusal(f"run {process.id} has no test part whose tests could be counted")
        spec = PartSpec(part.text, part.program, category=part.category, command=part.command)
        request_id = self.requests.open_request(process, spec, COUNT_MISSING_REASON.format(command=part.command or part.text), process.id, context)
        if part.reader_request_id is None:
            self.repository.save(replace(part, reader_request_id=request_id), context)
        return request_id
