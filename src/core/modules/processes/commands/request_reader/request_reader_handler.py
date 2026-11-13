from dataclasses import replace

from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.processes.commands.request_reader.request_reader import RequestReader
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_requests import ReaderRequests

MESSAGE = "Output {output} has no reader that gives its progress, and its box is empty: draw a reader for it, reader request {request}, with journal reader draft {request}."


class RequestReaderHandler(Handler[RequestReader, ReaderRequest]):
    """Opens the reader request of a run's visible command and posts one chat message, from the user, to the
    agent that ran it, naming the output and the request; the part keeps the request, which is how the card
    knows the agent was asked."""

    command = RequestReader

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery, requests: ReaderRequests, opened: ReaderRequestQuery, repository: Repository, bus: Bus) -> None:
        self.processes, self.parts, self.requests, self.opened, self.repository, self.bus = processes, parts, requests, opened, repository, bus

    def handle(self, command: RequestReader, context: Context) -> ReaderRequest:
        if not context.actor.is_person():
            raise Refusal("only a user asks for a reader this way", "an agent draws a reader with journal reader draft")
        process = self.processes.find(command.process_id)
        parts = self.parts.run_parts(process.id)
        part = next((part for part in parts if part.category.is_watched), parts[0] if parts else None)
        if part is None or part.reader_request_id is not None:
            raise Refusal(f"output {process.id} has no command to draw a reader for, or one was asked already")
        spec = PartSpec(part.text, part.program, category=part.category, command=part.command)
        request_id = self.requests.open_request(process, spec, "a user asked for a reader because the box of the output is empty", process.id, context)
        self.repository.save(replace(part, reader_request_id=request_id), context)
        self.bus.dispatch(SendMessage(MESSAGE.format(output=process.id, request=request_id), target_agent_id=process.session_agent_id), context)
        return self.opened.find(request_id)
