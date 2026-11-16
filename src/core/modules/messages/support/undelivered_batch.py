from dataclasses import dataclass
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class UndeliveredBatch:
    """The oldest messages waiting for an agent that this hook delivers, and how many wait in all."""

    messages: tuple[Message, ...]
    waiting: int
