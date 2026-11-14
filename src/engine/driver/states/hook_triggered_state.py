from collections.abc import Sequence
from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow

HOOK_TABLE = "hook"


class HookTriggeredState(AgentState):
    """An abstract shape: a state that is open for one hook when the agent's shell line runs one of the
    journal commands it names. It reads no row: the line is the whole of what opens it."""

    commands: ClassVar[Sequence[str]] = []

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not self.commands or not shell.parts_running_journal_command(*self.commands):
            return []
        return [OpenRow(HOOK_TABLE, 0, hook.timestamp)]
