from collections.abc import Sequence
from typing import ClassVar, Protocol

from engine.enums.hook_event_name import HookEventName
from engine.enums.hook_wildcard import HookWildcard
from engine.enums.tool_type import ToolType


class HookToolRule(Protocol):
    """The event and tool categories a registered rule reads."""

    hook: ClassVar[HookEventName | HookWildcard]
    tools: ClassVar[Sequence[ToolType]]
