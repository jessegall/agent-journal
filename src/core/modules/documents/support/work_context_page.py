from dataclasses import asdict, dataclass
from collections.abc import Mapping

from core.modules.documents.support.work_context_message import WorkContextMessage
from core.modules.documents.support.work_context_reference import WorkContextReference


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

    def json(self) -> Mapping[str, object]:
        return asdict(self)

    def lines(self) -> tuple[str, ...]:
        continuations = tuple(command for command in (self.next_command, self.ancestor_command) if command is not None)
        references = tuple(f"{row.model}:{row.id}: {row.title}" + (" (unavailable)" if row.unavailable else "") for row in self.references)
        return (f"{self.model}:{self.id} conversation, {self.total} messages in this ancestry segment",
                *(line for message in self.messages for line in message.lines()), *references, *continuations)
