from datetime import datetime, timezone

from journal.models.share import Share
from journal.repositories.scoped_repository import ScopedRepository


class Shares(ScopedRepository[Share]):
    model = Share

    def by_token(self, token: str) -> Share | None:
        rows = self.across_environments(token=token) if token else []
        return rows[0] if rows else None

    def open_anywhere(self) -> list[Share]:
        time = datetime.now(timezone.utc)
        return [share for share in self.selected_everywhere("1 ORDER BY id") if share.opens(time)]
