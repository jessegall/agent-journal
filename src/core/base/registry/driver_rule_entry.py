from collections.abc import Sequence
from dataclasses import dataclass
from fnmatch import fnmatchcase

from core.base.registry.dotted_path import DottedPath

ANY_HOOK = "*"


@dataclass(frozen=True)
class DriverRuleEntry:
    """A registered driver rule: its name, class, hook and place, the driver, overlay or module that declared it, the
    driver patterns and roles a module's added rule names, and whether it is a limit or essential."""

    name: str
    path: DottedPath
    hook: str
    position: int
    owner: str
    drivers: Sequence[str] = ()
    roles: Sequence[str] = ()
    limit: bool = False
    essential: bool = False

    @property
    def is_asked_first(self) -> bool:
        return self.essential or self.limit

    def covers_hook(self, hook_name: str) -> bool:
        return self.hook in (ANY_HOOK, hook_name)

    def covers_driver(self, driver: str, role: str) -> bool:
        if not self.drivers:
            return self.owner == driver
        return any(fnmatchcase(driver, pattern) for pattern in self.drivers) and (not self.roles or role in self.roles)
