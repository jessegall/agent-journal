from dataclasses import dataclass

from core.modules.documents.support.work_context_attachment import WorkContextAttachment


@dataclass(frozen=True)
class WorkContextAttachmentPage:
    """One bounded page of attachment metadata from an authorized message."""

    model: str
    id: int
    message_id: int
    attachments: tuple[WorkContextAttachment, ...]
    page: int
    total: int
    next_command: str | None

    def lines(self) -> tuple[str, ...]:
        continuation = [] if self.next_command is None else [self.next_command]
        return (f"message:{self.message_id} attachments, page {self.page}, {self.total} files",
                *(line for file in self.attachments for line in file.lines()), *continuation)
