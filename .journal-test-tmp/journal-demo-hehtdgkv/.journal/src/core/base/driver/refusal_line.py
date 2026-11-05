import shlex
from collections.abc import Mapping, Sequence

from core.base.driver.hook_event import HookEvent
from core.base.driver.tool_type import ToolType

COMMAND_PREFIX = "printf '%s\\n' "


class RefusalLine:
    """The shell line a refused shell line is replaced with, for a program that shows a refusal best as a
    command's output: it prints the journal's reason and runs nothing else."""

    @staticmethod
    def tool_input(event: HookEvent, refusal: str, output_tools: Sequence[ToolType]) -> Mapping[str, object]:
        tool = event.tool
        if not refusal or tool is None or tool.shell is None or tool.category not in output_tools:
            return {}
        return {**{str(field): value for field, value in event.tool_input().items()}, "command": f"{COMMAND_PREFIX}{shlex.quote(refusal)}"}
