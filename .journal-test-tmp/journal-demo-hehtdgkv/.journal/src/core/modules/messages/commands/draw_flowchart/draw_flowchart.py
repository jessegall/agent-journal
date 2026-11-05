from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class DrawFlowchart(Command[Message]):
    """Draws a flowchart in the chat: a message whose text is its title, carrying its arrows as the agent
    wrote them."""

    title: str
    edges: Sequence[str]
