from core.base.container import Container
from core.modules.documents.actions.ended_documents import EndedDocuments


class CloseEndedDocumentsTick:
    """Closes documents whose agents ended before the server's last restart."""

    def __call__(self, container: Container) -> None:
        container.get(EndedDocuments).close_all()
