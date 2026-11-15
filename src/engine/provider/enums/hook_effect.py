import re
from enum import StrEnum
from typing import TYPE_CHECKING

from engine.enums.hook_event_name import HookEventName
from engine.provider.provider import Provider

if TYPE_CHECKING:
    from engine.provider.managed_hook import ManagedHook


class HookEffect(StrEnum):
    """The capabilities of a project hook that may affect journal decisions."""

    CAN_REFUSE = "can_refuse"
    CAN_REWRITE = "can_rewrite"
    ADDS_LINES = "adds_lines"

    @classmethod
    def detected(cls, hook: "ManagedHook", provider: type[Provider], event: HookEventName) -> list["HookEffect"]:
        effects: list[HookEffect] = []
        if event in provider.refusals:
            effects.append(cls.CAN_REFUSE)
        if event in provider.rewrites and re.search(hook.matcher or ".*", "Bash"):
            effects.append(cls.CAN_REWRITE)
        if event in provider.line_events:
            effects.append(cls.ADDS_LINES)
        return effects
