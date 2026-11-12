from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class FoldMainsCheck(Command[str]):
    """Folds the older main agent rows on a copy of the database and files what the fold would do as a report."""
