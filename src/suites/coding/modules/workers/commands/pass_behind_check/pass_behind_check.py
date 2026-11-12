from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PassBehindCheck(Command[None]):
    """The merger hands the decision about a worker behind its base to the main agent, with the reason."""

    worker_id: int
    reason: str
