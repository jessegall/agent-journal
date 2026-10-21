from datetime import datetime, timezone

from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.notice import Notice
from journal.repositories.notices import Notices


class NoticeController(Controller[Notice]):
    """Notices pinned for the user, open until closed."""

    def __init__(self, notices: Notices) -> None:
        self.repository = notices

    def rows(self) -> list[Notice]:
        return self.repository.in_()

    def is_open(self, row: Notice) -> bool:
        return row.closed_at is None

    def counts(self, rows: list[Notice]) -> Counts:
        return Counts(all=self.repository.count(), open=self.repository.open_count(), unread=self.repository.unseen_by_user())

    def close(self, request: Request) -> Response:
        notice = self.repository.find(request.number("id"))
        return Response.json(self.repository.save(notice.closed(datetime.now(timezone.utc)), request.actor))
