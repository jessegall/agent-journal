from dataclasses import dataclass
from core.modules.documents.support.work_context_attachment import WorkContextAttachment


@dataclass(frozen=True)
class WorkContextMessage:
    """One quoted conversation message and its non-selecting continuation."""

    id: int
    text: str
    author: str
    author_id: int | None
    message_type: str
    created_at: str
    relations: tuple[str, ...]
    next_text_offset: int | None = None
    next_text_command: str | None = None
    attachments: tuple[WorkContextAttachment, ...] = ()
    attachment_total: int = 0
    attachment_command: str | None = None
    is_journal_record: bool = False

    def lines(self) -> tuple[str, ...]:
        header = f"message:{self.id} from {self.author} ({', '.join(self.relations)})"
        continuation = tuple(command for command in (self.next_text_command, self.attachment_command) if command is not None)
        reference = ["journal record reference; not a person request"] if self.is_journal_record else []
        return (header, *reference, *(f"> {line}" for line in self.text.splitlines()),
                *(line for file in self.attachments for line in file.lines()), *continuation)
