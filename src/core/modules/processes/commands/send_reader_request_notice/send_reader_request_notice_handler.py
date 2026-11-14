from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.reader_request_text import ReaderRequestText


class SendReaderRequestNoticeHandler(Handler[SendReaderRequestNotice, None]):
    """Wakes the main agent for a reader request at most once in ten minutes."""

    command = SendReaderRequestNotice
    disabled_scopes = [ActorScope]

    def __init__(self, requests: ReaderRequestQuery, notices: ReaderRequestNotices, request_text: ReaderRequestText, main_line: MainAgentLine) -> None:
        self.requests, self.notices, self.request_text, self.main_line = requests, notices, request_text, main_line

    def handle(self, command: SendReaderRequestNotice, context: Context) -> None:
        request = self.requests.find(command.request_id)
        if request.completed_at is not None or self.notices.has_recent_notice(command.agent_id, request.id, context.timestamp):
            return
        self.main_line.send_nudge(self.request_text.line(request), self.notices.source(request.id), context)
