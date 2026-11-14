from dataclasses import dataclass

from engine.command.command import Command
from core.modules.asks.models.ask_stack import AskStack


@dataclass(frozen=True)
class ApproveAskStack(Command[AskStack]):
    """Puts a question stack an agent set into force, in place of the one its topic had."""

    stack_id: int
