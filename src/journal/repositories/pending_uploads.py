from journal.models.pending_upload import PendingUpload
from journal.repositories.repository import Repository


class PendingUploads(Repository[PendingUpload]):
    """The files waiting to be sent to the team server, oldest first."""

    model = PendingUpload

    def waiting(self) -> list[PendingUpload]:
        return self.all_matching()
