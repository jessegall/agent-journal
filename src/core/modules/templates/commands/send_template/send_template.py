from collections.abc import Mapping
from dataclasses import dataclass, field

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class SendTemplate(Command[Message]):
    """Sends a template request about one row with the values a person supplied."""

    template_id: int
    target: str
    values: Mapping[str, str] = field(default_factory=dict[str, str])
