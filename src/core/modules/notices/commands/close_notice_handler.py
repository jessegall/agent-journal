from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.notices.commands.close_notice import CloseNotice
from core.modules.notices.models.notice import Notice
from core.modules.notices.queries.notice_query import NoticeQuery


class CloseNoticeHandler(Handler[CloseNotice, Notice]):
    """Closes an open notice; one closed already is refused."""

    command = CloseNotice

    def __init__(self, notices: NoticeQuery, repository: Repository) -> None:
        self.notices, self.repository = notices, repository

    def handle(self, command: CloseNotice, context: Context) -> Notice:
        notice = self.notices.find(command.notice_id)
        if notice.closed_at is not None:
            raise Refusal(f"notice {notice.id} is closed already", "journal notice list shows the open ones")
        return self.repository.save(notice.changed(closed_at=context.timestamp), context)
