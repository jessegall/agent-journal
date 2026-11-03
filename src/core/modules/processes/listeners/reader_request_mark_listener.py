from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.scope.actor_scope import ActorScope
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder

MODULE_NAME = "journal.core.processes"
SAMPLE_LINES = 3
COMMAND_CHARACTERS = 70


class ReaderRequestMarkListener(CommitListener):
    """Shows one mark for each reader request and completes it when the request ends."""

    name = "processes.reader-request-mark"
    event = "reader_request.*"
    disabled_scopes = [ActorScope]

    def __init__(self, requests: ReaderRequestQuery, folder: OutputFolder, bus: Bus, actors: ModuleActors) -> None:
        self.requests, self.folder, self.bus, self.actors = requests, folder, bus, actors

    def handle(self, event: LoggedEvent) -> None:
        self.show(self.requests.find(event.row_id), event)

    def show(self, request: ReaderRequest, event: LoggedEvent) -> None:
        completed = request.completed_at is not None
        variant = ProcessMarkVariant.FINISHED if completed else ProcessMarkVariant.RUNNING
        outcome = MarkOutcome.WARNED if request.skip_reason else MarkOutcome.PASSED
        self.bus.run(ShowMark(request.environment_id, ProcessMarkType.READER_REQUEST, variant, f"reader-request:{request.id}",
                              f"Reader: {request.command[:COMMAND_CHARACTERS]}", detail=self.detail(request), row_model="process",
                              row_id=request.sample_process_id, outcome=outcome if completed else MarkOutcome.RUNNING, ended=completed),
                     self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=request.environment_id)

    def detail(self, request: ReaderRequest) -> str:
        lines = [request.reason]
        if request.sample_process_id is not None:
            first = [line for _, line in self.folder.numbered_lines(request.sample_process_id, 1, SAMPLE_LINES * 2 + 1)]
            lines.extend(first if len(first) <= SAMPLE_LINES * 2 else [*first[:SAMPLE_LINES], "…", *self.folder.last_lines(request.sample_process_id, SAMPLE_LINES)])
        if request.skip_reason:
            lines.append(f"Skipped: {request.skip_reason}")
        return "\n".join(lines)
