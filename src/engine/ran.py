import time

from engine import bus
from resources.base import SYSTEM, Event

SHELL, TYPED, NOTED = "Bash", "Typed", "Journal"


def announce(record, agent: int, tool: str, command: str, output: str = "", at: float | None = None) -> None:
    when = time.time() if at is None else at
    bus.emit(Event(0, when, "agent", agent, "command.ran", SYSTEM, {"at": when, "tool": tool, "command": command, "output": output}), record)
