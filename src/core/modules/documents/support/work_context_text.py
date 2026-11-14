from dataclasses import dataclass

from core.modules.documents.support.work_context_attachment import WorkContextAttachment


@dataclass(frozen=True)
class WorkContextText:
    """One authorized text segment that leaves the selected request unchanged."""

    model: str
    id: int
    message_id: int
    text: str
    text_offset: int
    next_text_offset: int | None
    next_command: str | None
    author: str
    message_type: str
    attachments: tuple[WorkContextAttachment, ...] = ()
    attachment_total: int = 0
    attachment_command: str | None = None

    def lines(self) -> tuple[str, ...]:
        continuation = tuple(command for command in (self.next_command, self.attachment_command) if command is not None)
        return (f"message:{self.message_id} from {self.author} ({self.message_type}), text at {self.text_offset}",
                *(f"> {line}" for line in self.text.splitlines()), *(line for file in self.attachments for line in file.lines()), *continuation)
