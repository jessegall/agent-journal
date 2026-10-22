from journal.models.notice import Notice
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import USER_PREFIX


class Notices(ScopedRepository[Notice]):
    model = Notice

    def unviewed(self) -> int:
        return self.counted(self.query().filter_null("closed_at").filter_missing_prefix("creator", USER_PREFIX))

    def open_count(self) -> int:
        return self.counted(self.query().filter_null("closed_at"))

    def open_scoped(self) -> list[Notice]:
        return self.selected(self.query().filter_null("closed_at"))

    def open_titled(self, titles: tuple[str, ...]) -> list[Notice]:
        return self.selected(self.query().filter_null("closed_at").filter_listed("title", list(titles)))
