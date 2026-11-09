import re
from collections.abc import Sequence
from enum import StrEnum
from typing import TYPE_CHECKING

from core.base.driver.hook_event_name import HookEventName
from core.base.provider.hook_tool_rule import HookToolRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.provider.provider import Provider

if TYPE_CHECKING:
    from core.base.provider.managed_hook import ManagedHook


class HookEffect(StrEnum):
    """The capabilities of a project hook that may affect journal decisions."""

    CAN_REFUSE = "can_refuse"
    CAN_REWRITE = "can_rewrite"
    ADDS_LINES = "adds_lines"
    OVERLAPS = "overlaps"

    @classmethod
    def detected(cls, hook: "ManagedHook", provider: type[Provider], event: HookEventName,
           rules: Sequence[type[HookToolRule]] = ()) -> list["HookEffect"]:
        effects: list[HookEffect] = []
        if event in provider.refusals:
            effects.append(cls.CAN_REFUSE)
        if event in provider.rewrites and re.search(hook.matcher or ".*", "Bash"):
            effects.append(cls.CAN_REWRITE)
        if event in provider.line_events:
            effects.append(cls.ADDS_LINES)
        categories = {category for rule in rules if rule.hook in (event, HookWildcard.ALL_HOOKS) for category in rule.tools}
        if categories and any(category in categories and re.search(hook.matcher or ".*", name)
                              for name, category in provider.tool_categories.items()):
            effects.append(cls.OVERLAPS)
        return effects
