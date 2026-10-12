import time

from engine import bus
from engine.stepped import original_of
from events.agents import COMMAND_RAN
from resources.base import SYSTEM

from resources.runs import DELIVERED, NOTED, SHELL, STEP, TYPED  # noqa: F401  their home is resources, and the engine names them here


def announce(record, agent: int, tool: str, command: str, output: str = "", at: float | None = None, stepped: bool = False) -> None:
    when = time.time() if at is None else at
    bus.announce(record, "agent", agent, COMMAND_RAN, SYSTEM, {"at": when, "tool": tool, "command": command, "output": output, "stepped": stepped}, at=when)


def tool_ran(record, agent: int, tool) -> None:
    shell = tool.shell_command
    if shell is not None:
        asked = original_of(record.root, shell)
        announce(record, agent, SHELL, asked, tool.output, stepped=asked != shell)
        return
    announce(record, agent, tool.name, " ".join([tool.doing, *tool.paths[:1]]), tool.output)
