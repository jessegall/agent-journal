from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class AskMainAgent(Command[None]):
    """The merger asks the main agent: what is wrong, what it tried, the options and its recommendation."""

    problem: str
    tried: str
    options: tuple[str, ...]
    recommendation: str
    worker_id: int | None = None
