from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.driver_rule import DriverRule
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.agent_role import AgentRole


class Driver:
    """The base of every driver: how the journal drives an agent of one role in one suite, by its permanent rules,
    which no overlay silences, its other rules, the guards for its agents only, and its opening lines."""

    name: ClassVar[str]
    suite: ClassVar[type[Suite]]
    role: ClassVar[AgentRole]
    permanent_rules: ClassVar[Sequence[type[DriverRule]]] = []
    rules: ClassVar[Sequence[type[DriverRule]]] = []
    guards: ClassVar[Sequence[type[Guard]]] = []
    opening_lines: ClassVar[Sequence[str]] = []
