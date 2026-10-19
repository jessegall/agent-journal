from journal.http.v3.row_counts import RowCounts
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.repositories.notices import Notices


class NoticesShaper(Shaper):
    type = "notice"

    def __init__(self, notices: Notices) -> None:
        self.notices = notices

    def counts(self, rows: list[V3Row]) -> RowCounts:
        return RowCounts(all=self.count_all(), open=self.notices.open_count(), unread=self.notices.unseen_by_user())

    def count_all(self) -> int:
        return self.notices.counted_in()

    def rows(self) -> list[V3Row]:
        return [V3Row.of("notice", n, title=n.title, brief=n.link, completed=seconds(n.closed_at) if n.closed_at else 0.0,
                         data={"link": n.link, "label": n.label, "tone": n.tone, "action": "", "session": "", "phone": "", "agent": ""}) for n in self.notices.in_()]
