from datetime import datetime, timezone

from journal.models.share import Share
from journal.repositories.scoped_repository import ScopedRepository


class Shares(ScopedRepository[Share]):
    model = Share

    def by_token(self, token: str) -> Share | None:
        """The share a link names, in whichever environment it was made."""
        found = self.across_environments(token=token) if token else []
        return found[0] if found else None

    def open_anywhere(self) -> list[Share]:
        """Every link that opens now, in every environment: while one does, the tunnel is wanted."""
        now = datetime.now(timezone.utc)
        return [share for share in self.selected_everywhere("1 ORDER BY id") if share.opens(now)]
