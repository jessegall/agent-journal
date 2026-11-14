from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ForwardWorkerQuestions(Command[None]):
    """The journal sends the open questions of a worker to the main agent, since the merger did not end them."""

    worker_id: int
