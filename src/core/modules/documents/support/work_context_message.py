from dataclasses import dataclass


@dataclass(frozen=True)
class WorkContextMessage:
    """One quoted conversation message and its non-selecting continuation."""

    id: int
    text: str
    author: str
    author_id: int
    message_type: str
    created_at: str
    relations: tuple[str, ...]
    next_text_offset: int | None = None
    next_text_command: str | None = None

    def lines(self) -> tuple[str, ...]:
        header = f"message:{self.id} from {self.author} ({', '.join(self.relations)})"
        continuation = () if self.next_text_command is None else (self.next_text_command,)
        return (header, *(f"> {line}" for line in self.text.splitlines()), *continuation)


@dataclass(frozen=True)
class WorkContextReference:
    """A related resource reference whose body is not expanded into the conversation."""

    model: str
    id: int
    title: str
    relations: tuple[str, ...]
    unavailable: bool = False
