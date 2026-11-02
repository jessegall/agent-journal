from dataclasses import dataclass
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_condition import BlockCondition


@dataclass(frozen=True)
class RanCommand(BlockCondition):
    """The block ends when the agent runs this command."""

    name: ClassVar[str] = "ran-command"

    command: str

    @property
    def text(self) -> str:
        return self.command

    def is_true(self, hook: AgentHook) -> bool:
        tool = hook.event.tool
        return tool is not None and tool.shell is not None and self.command in tool.shell.line
