from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class JudgeSkippedTasks(Command[int]):
    """Judges again the tasks a rule was skipped for, and the free tasks a stop left with no decision, in every
    environment with a rule turned on, or in the one the command runs in; answers how many tasks were judged.
    """
