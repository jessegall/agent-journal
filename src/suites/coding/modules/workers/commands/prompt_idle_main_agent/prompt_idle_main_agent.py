from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PromptIdleMainAgent(Command[None]):
    """Wakes the idle main agent of an environment that keeps going while work is left, when it has a task to
    take or tasks to send to a worker."""
