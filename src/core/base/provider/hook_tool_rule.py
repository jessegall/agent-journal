from collections.abc import Sequence
from typing import ClassVar, Protocol

from engine.driver.hook_event_name import HookEventName
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.tool_type import ToolType


class HookToolRule(Protocol):
    """The event and tool categories a registered rule reads."""

    hook: ClassVar[HookEventName | HookWildcard]
    tools: ClassVar[Sequence[ToolType]]
