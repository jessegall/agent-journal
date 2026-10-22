from journal.models.release_message import ReleaseMessage
from journal.repositories.repository import Repository


class ReleaseMessages(Repository[ReleaseMessage]):
    model = ReleaseMessage

    def unread(self) -> list[ReleaseMessage]:
        return self.all_matching(is_read=False)

    def has_version(self, version: str) -> bool:
        return bool(self.matching(version=version))
