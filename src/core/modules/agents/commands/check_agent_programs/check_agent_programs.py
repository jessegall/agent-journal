from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CheckAgentPrograms(Command[None]):
    """Has the dispatcher correct, in one environment, each agent row that disagrees with its program."""
