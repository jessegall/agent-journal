from collections.abc import Sequence

from engine.enums.agent_kind import AgentKind
from engine.enums.agent_role import AgentRole
from engine.module.default_state import DefaultState
from engine.module.errors.module_error import ModuleError
from engine.module.suite import Suite
from engine.module.suite_list import SuiteList
from engine.registry.default_state_entry import DefaultStateEntry


class SuiteFunnel:
    """Takes in at sync the default states a suite and the suites that join it declare, refusing one that
    names a state no module registers or a role, driver or helper type nothing registers."""

    def __init__(self, suites: SuiteList, state_names: Sequence[str], driver_names: Sequence[str], helper_type_keys: Sequence[str]) -> None:
        self.suites = suites
        self.state_names = frozenset(state_names)
        self.known_values = {AgentKind.ROLE: frozenset(role.value for role in AgentRole), AgentKind.DRIVER: frozenset(driver_names),
                             AgentKind.HELPER_TYPE: frozenset(helper_type_keys)}

    def entries(self, suite: type[Suite]) -> tuple[DefaultStateEntry, ...]:
        joining = [default for second in self.suites.suites if second.joins == suite.name for default in second.default_states]
        return tuple(self.entry(suite, default.declared()) for default in [*suite.default_states, *joining])

    def entry(self, suite: type[Suite], default: DefaultState) -> DefaultStateEntry:
        if default.state.name not in self.state_names:
            raise ModuleError(f"suite {suite.name} gives the default state {default.state.name}, which no module registers")
        if default.value not in self.known_values[default.kind]:
            raise ModuleError(f"suite {suite.name} gives a default state to the {default.kind.value} {default.value}, which nothing registers")
        return DefaultStateEntry(default.state.name, default.kind, default.value, default.removed_while)
