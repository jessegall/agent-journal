from collections.abc import Sequence
from dataclasses import dataclass

from engine.dotted_path.dotted_path import DottedPath
from engine.registry.driver_patterns import DriverPatterns


@dataclass(frozen=True)
class AgentStateEntry:
    """A registered agent state as the registry lists it: its name, the dotted path of its class, the module or
    driver that declares it, its place in the order, its tier, the drivers it applies to, the state it is a substate
    of, and the names of the rules and deferred rules it gates."""

    name: str
    path: DottedPath
    owner: str
    position: int
    tier: int
    drivers: Sequence[str]
    parent: str = ""
    rules: Sequence[str] = ()
    deferred: Sequence[str] = ()

    def covers(self, driver: str) -> bool:
        return DriverPatterns(self.drivers).covers(driver)
