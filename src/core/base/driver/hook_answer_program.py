from collections.abc import Mapping
from typing import Protocol

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.refusal_style import RefusalStyle


class HookAnswerProgram(Protocol):
    """The refusal formats needed to decode a program's native hook answer."""

    @property
    def refusals(self) -> Mapping[HookEventName, RefusalStyle]: ...
