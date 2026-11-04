from collections.abc import Sequence
from dataclasses import dataclass

from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.driver_patterns import DriverPatterns
from core.base.role_group import RoleGroup

ANY_HOOK = "*"


@dataclass(frozen=True)
class DriverRuleEntry:
    """A registered driver rule: its name, class, hook and place, who declared it, the patterns and roles
    an added rule names, and whether it is exempt or essential; a standing rule is one of those two, asked
    before every layer."""

    name: str
    path: DottedPath
    hook: str
    position: int
    owner: str
    drivers: Sequence[str] = ()
    roles: Sequence[str] = ()
    exempt: bool = False
    essential: bool = False
    history: bool = False
    claims_essential: bool = False
    role_group: RoleGroup = RoleGroup.ANY
    priority: int = 0

    @property
    def is_standing(self) -> bool:
        return self.essential or self.exempt

    def covers_hook(self, hook_name: str) -> bool:
        return self.hook in (ANY_HOOK, hook_name)

    def covers_driver(self, driver: str, role: str) -> bool:
        if not self.drivers:
            return self.owner == driver
        return DriverPatterns(self.drivers).covers(driver) and (not self.roles or role in self.roles)

    def is_driver_standing_rule(self, driver: str) -> bool:
        return (self.essential and not self.exempt) or (self.exempt and self.owner == driver)

