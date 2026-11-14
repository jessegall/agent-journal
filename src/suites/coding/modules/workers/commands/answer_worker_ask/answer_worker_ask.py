from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AnswerWorkerAsk(Command[str]):
    """The merger answers the question of a worker, named by the number of its line."""

    line_id: int
    text: str
