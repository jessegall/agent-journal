from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneEvents(Command[int]):
    """Deletes one batch of the logged changes of short-lived rows, once they are old and every listener has
    passed them."""
