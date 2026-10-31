from collections.abc import Sequence
from dataclasses import dataclass

from core.base.registry.dotted_path import DottedPath
from core.base.registry.driver_patterns import DriverPatterns

ANY_HOOK = "*"


@dataclass(frozen=True)
class DriverRuleEntry:
    """A registered driver rule: its name, class, hook and place, who declared it, the patterns and roles
    an added rule names, and whether it is a limit or essential; a standing rule is one of those two, asked
    before every layer."""

    name: str
    path: DottedPath
    hook: str
    position: int
    owner: str
    drivers: Sequence[str] = ()
    roles: Sequence[str] = ()
    limit: bool = False
    essential: bool = False
    history: bool = False
    claims_essential: bool = False

    @property
    def is_standing(self) -> bool:
        return self.essential or self.limit

    def covers_hook(self, hook_name: str) -> bool:
        return self.hook in (ANY_HOOK, hook_name)

    def covers_driver(self, driver: str, role: str) -> bool:
        if not self.drivers:
            return self.owner == driver
        return DriverPatterns(self.drivers).covers(driver) and (not self.roles or role in self.roles)

    def is_driver_standing_rule(self, driver: str) -> bool:
        return (self.essential and not self.limit) or (self.limit and self.owner == driver)

