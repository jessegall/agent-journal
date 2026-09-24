import time

from engine import bus
from resources.base import SYSTEM, Event

SHELL, TYPED, NOTED, DELIVERED = "Bash", "Typed", "Journal", "Delivered"


def announce(record, agent: int, tool: str, command: str, output: str = "", at: float | None = None) -> None:
    when = time.time() if at is None else at
    bus.emit(Event(0, when, "agent", agent, "command.ran", SYSTEM, {"at": when, "tool": tool, "command": command, "output": output}), record)


def tool_ran(record, agent: int, provider, tool) -> None:
    shell = provider.shell_command(tool)
    if shell is not None:
        announce(record, agent, SHELL, shell, tool.output)
        return
    announce(record, agent, tool.name, " ".join([tool.doing, *tool.paths[:1]]), tool.output)
