from dataclasses import dataclass

from core.modules.documents.support.work_context_message import WorkContextMessage, WorkContextReference, WorkContextAttachment


@dataclass(frozen=True)
class WorkContextRequest:
    """The requested conversation page, text segment or ancestry continuation."""

    page: int = 1
    page_size: int = 5
    message_id: int | None = None
    text_offset: int = 0
    ancestor_cursor: str | None = None
    attachment: str | None = None
    attachment_page: int | None = None


@dataclass(frozen=True)
class WorkContextPage:
    """One bounded page within a conversation's ancestry window."""

    model: str
    id: int
    messages: tuple[WorkContextMessage, ...]
    page: int
    page_size: int
    total: int
    ancestor_start: int
    next_command: str | None
    ancestor_cursor: str | None
    ancestor_command: str | None
    references: tuple[WorkContextReference, ...] = ()

    def lines(self) -> tuple[str, ...]:
        continuations = tuple(command for command in (self.next_command, self.ancestor_command) if command is not None)
        references = tuple(f"{row.model}:{row.id}: {row.title}" + (" (unavailable)" if row.unavailable else "") for row in self.references)
        return (f"{self.model}:{self.id} conversation, {self.total} messages in this ancestry segment",
                *(line for message in self.messages for line in message.lines()), *references, *continuations)


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
        continuation = () if self.next_command is None else (self.next_command,)
        return (f"message:{self.message_id} attachments, page {self.page}, {self.total} files",
                *(line for file in self.attachments for line in file.lines()), *continuation)


@dataclass(frozen=True)
class WorkContextFileContent:
    """The named attachment bytes returned by an explicit authorized file request."""

    name: str
    content_base64: str
    caption: str


@dataclass(frozen=True)
class WorkContextFile:
    """One attachment opened only after its message passes context authorization."""

    model: str
    id: int
    message_id: int
    attachment: WorkContextFileContent

    def lines(self) -> tuple[str, ...]:
        return (f"message:{self.message_id} attachment", self.attachment.content_base64)
