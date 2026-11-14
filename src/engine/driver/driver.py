from collections.abc import Sequence
from typing import ClassVar, Never

from engine.driver.driver_rule import DriverRule
from engine.driver.agent_state import AgentState
from engine.guard.guard import Guard


class Driver:
    """The base of every driver: how the journal drives an agent of one role in one suite, by its rules, of
    which an exclusive overlay silences those not marked exempt, the guards for its agents only, and its
    opening lines."""

    name: ClassVar[str]
    suite_name: ClassVar[str]
    role: ClassVar[str]
    rules: ClassVar[Sequence[type[DriverRule]]] = []
    agent_states: ClassVar[Sequence[type[AgentState]]] = []
    guards: ClassVar[Sequence[type[Guard[Never]]]] = []
    opening_lines: ClassVar[Sequence[str]] = []
