from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent.enums.role_group import RoleGroup
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.driver_patterns import DriverPatterns

ANY_HOOK = "*"


@dataclass(frozen=True)
class DeferredRuleEntry:
    """A registered deferred rule: its name and class, the deferred state it belongs to, the hook it runs after and the
    drivers and roles it covers."""

    name: str
    path: DottedPath
    state: str
    hook: str
    drivers: Sequence[str]
    role_group: RoleGroup = RoleGroup.ANY

    def covers_hook(self, hook_name: str) -> bool:
        return self.hook in (ANY_HOOK, hook_name)

    def covers(self, driver: str) -> bool:
        return DriverPatterns(self.drivers).covers(driver)
