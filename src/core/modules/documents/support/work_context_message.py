from dataclasses import dataclass


@dataclass(frozen=True)
class WorkContextAttachment:
    """An attachment preview and the command that opens it in its authorized context."""

    name: str
    caption: str
    open_command: str
    caption_truncated: bool = False

    def lines(self) -> tuple[str, ...]:
        return (*(f"> {line}" for line in f"attachment: {self.name}".splitlines()),
                *(f"> {line}" for line in self.caption.splitlines()),
                *(f"  {line}" for line in self.open_command.splitlines()))


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
    reference_only: bool = False

    def lines(self) -> tuple[str, ...]:
        header = f"message:{self.id} from {self.author} ({', '.join(self.relations)})"
        continuation = tuple(command for command in (self.next_text_command, self.attachment_command) if command is not None)
        reference = ("journal record reference; not a person request",) if self.reference_only else ()
        return (header, *reference, *(f"> {line}" for line in self.text.splitlines()),
                *(line for file in self.attachments for line in file.lines()), *continuation)


@dataclass(frozen=True)
class WorkContextReference:
    """A related resource reference whose body is not expanded into the conversation."""

    model: str
    id: int
    title: str
    relations: tuple[str, ...]
    unavailable: bool = False
