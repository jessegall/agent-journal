from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RequestCountReader(Command[int]):
    """A run whose tests could not be counted asks the agent that ran it for a reader that counts them; the answer
    is the number of the reader request."""

    process_id: int
