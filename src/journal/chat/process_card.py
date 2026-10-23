from abc import ABC, abstractmethod
from typing import ClassVar

from journal.models.message import Message


class ProcessCard(ABC):
    """A chat card for one process that lasts, such as a active command, a dispatch or an open question: it has a state, it is updated in place while the process runs, and while it runs the viewer asks its refresh every second for the fields its card shows now."""

    name: ClassVar[str]

    @abstractmethod
    def refresh(self, message: Message) -> dict:
        ...
