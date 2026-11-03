from collections.abc import Mapping, Sequence
from typing import Protocol

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.refusal_style import RefusalStyle


class HookAnswerProgram(Protocol):
    """What is needed to decode a program's native hook answer: its refusal formats, and the events on which the
    program takes a hook's plain text output into the context."""

    @property
    def refusals(self) -> Mapping[HookEventName, RefusalStyle]: ...

    @property
    def plain_output_events(self) -> Sequence[HookEventName]: ...
