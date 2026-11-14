from collections.abc import Sequence
from dataclasses import replace

from engine.driver.driver_rule import DriverRule
from engine.module.module import Module
from engine.module.suite_list import SuiteList
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.driver_entry import DriverEntry
from engine.registry.driver_rule_entry import DriverRuleEntry
from engine.registry.overlay_entry import OverlayEntry
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.deferred_rule_entry import DeferredRuleEntry
from engine.enums.state_tier import StateTier
from engine.driver.agent_state import AgentState
from engine.registry.suite_entry import SuiteEntry
from engine.module.errors.module_error import ModuleError
from engine.module.suite import Suite
from engine.module.suite_funnel import SuiteFunnel
from engine.module.task_assigner import TaskAssigner

DRIVERS_MODULE = "journal.core.drivers"


class DriverEntries:
    """The registry entries of the modules' suites, drivers, overlays and driver rules, in sync order: per
    module, each driver's rules, each overlay's rules, then the rules the module adds."""

    def suites(self, modules: Sequence[type[Module]], shipped_modules: Sequence[type[Module]], suites: SuiteList) -> tuple[SuiteEntry, ...]:
        funnel = SuiteFunnel(suites, [state.name for state in self.agent_states(modules)], [driver.name for module in modules for driver in module.drivers],
                             [helper_type.key for module in modules for helper_type in suites.helper_types(module)])
        return tuple(SuiteEntry(suite.name, module.name, tuple(suite.requires), suite.complete_control, tuple(suite.included_overlays),
                                      suite.offered_windows(), suite.default_layouts(), suite.offered_presets(),
                                      self.task_assigner_path(suite), shipped=module in shipped_modules, entrances=suite.entrance_windows(), default_states=funnel.entries(suite))
                     for module in modules for suite in suites.module_suites(module))

    @staticmethod
    def task_assigner_path(suite: type[Suite]) -> str:
        if suite.task_assigner is None:
            return ""
        if not (isinstance(suite.task_assigner, type) and issubclass(suite.task_assigner, TaskAssigner)):
            raise ModuleError(f"the task assigner of suite {suite.name} does not extend TaskAssigner")
        return DottedPath.class_path(suite.task_assigner).text

    def drivers(self, modules: Sequence[type[Module]]) -> tuple[DriverEntry, ...]:
        return tuple(DriverEntry(driver.name, DottedPath.class_path(driver), module.name, driver.suite_name, driver.role, tuple(driver.opening_lines),
                                 tuple(guard.name for guard in driver.guards))
                     for module in modules for driver in module.drivers)

    def overlays(self, modules: Sequence[type[Module]]) -> tuple[OverlayEntry, ...]:
        overlays = [overlay for module in modules for overlay in module.overlays]
        return tuple(OverlayEntry(overlay.name, DottedPath.class_path(overlay), position, tuple(overlay.drivers)) for position, overlay in enumerate(overlays, 1))

    # every agent state a module or a driver declares, with its substates after it, refused at sync when one has no
    # name, two share a name, or a rule is gated twice or both gated and declared by a module as an ordinary rule
    def agent_states(self, modules: Sequence[type[Module]]) -> tuple[AgentStateEntry, ...]:
        declared = [(module.name, state, "") for module in modules for state in module.agent_states]
        declared += [(driver.name, state, "") for module in modules for driver in module.drivers for state in driver.agent_states]
        declared = [entry for owner, state, parent in declared for entry in self.with_substates(owner, state, parent)]
        self.check_substates(declared)
        entries = tuple(AgentStateEntry(state.name, DottedPath.class_path(state), owner, position, int(state.tier), tuple(state.drivers), parent,
                                        tuple(rule.name for rule in state.rules), tuple(rule.name for rule in state.deferred))
                        for position, (owner, state, parent) in enumerate(declared, 1))
        self.check_states(entries, {rule.name for module in modules for rule in module.driver_rules})
        return entries

    # the deferred rules of every state, recorded under it; a deferred rule that declares a refusal, one in a state that is
    # not deferred, and a deferred state that gates rules are refused, since nothing can refuse after the answer
    def deferred_rules(self, modules: Sequence[type[Module]]) -> tuple[DeferredRuleEntry, ...]:
        declared = [(state, owner) for owner, state in [(module.name, state) for module in modules for state in module.agent_states]
                    + [(driver.name, state) for module in modules for driver in module.drivers for state in driver.agent_states]]
        entries: list[DeferredRuleEntry] = []
        for root, _ in declared:
            for state in self.state_tree([root]):
                self.check_deferred(state)
                entries += [DeferredRuleEntry(rule.name, DottedPath.class_path(rule), state.name, str(rule.hook), tuple(rule.drivers), rule.role_group) for rule in state.deferred]
        return tuple(entries)

    @staticmethod
    def check_deferred(state: type[AgentState]) -> None:
        if state.deferred and state.tier is not StateTier.DEFERRED:
            raise ModuleError(f"the agent state {state.name} has deferred rules but is not a deferred state")
        if state.tier is StateTier.DEFERRED and state.rules:
            raise ModuleError(f"the deferred state {state.name} gates rules: a deferred state holds only deferred rules")
        refusing = next((rule for rule in state.deferred if getattr(rule, "single_action_refusal", "")), None)
        if refusing is not None:
            raise ModuleError(f"the deferred rule {refusing.name} declares a refusal, and a rule that runs after the answer cannot refuse")

    # a substate lives inside one parent only: named by a second parent, or listed as a state of its own too, it is refused
    @staticmethod
    def check_substates(declared: Sequence[tuple[str, type[AgentState], str]]) -> None:
        for _, state, parent in declared:
            if not parent:
                continue
            parents = {second_parent for _, second, second_parent in declared if second is state}
            if len(parents) > 1 and "" in parents:
                raise ModuleError(f"the substate {state.name} of {parent} is also listed as an agent state of its own")
            if len(parents) > 1:
                raise ModuleError(f"the substate {state.name} is named by two parents: {', '.join(sorted(parents))}")

    def with_substates(self, owner: str, state: type[AgentState], parent: str) -> list[tuple[str, type[AgentState], str]]:
        if not getattr(state, "name", ""):
            raise ModuleError(f"the agent state {state.__qualname__} of {owner} has no name")
        return [(owner, state, parent), *(entry for substate in state.substates for entry in self.with_substates(owner, substate, state.name))]

    def state_tree(self, states: Sequence[type[AgentState]]) -> list[type[AgentState]]:
        return [matched for state in states for matched in (state, *self.state_tree(state.substates))]

    @staticmethod
    def check_states(entries: Sequence[AgentStateEntry], module_rules: set[str]) -> None:
        names = [entry.name for entry in entries]
        twice = next((name for name in names if names.count(name) > 1), None)
        if twice is not None:
            raise ModuleError(f"two agent states are named {twice}")
        gated = [rule for entry in entries for rule in entry.rules]
        gated_twice = next((rule for rule in gated if gated.count(rule) > 1), None)
        if gated_twice is not None:
            raise ModuleError(f"the rule {gated_twice} is gated by two agent states")
        both = next((rule for rule in gated if rule in module_rules), None)
        if both is not None:
            raise ModuleError(f"the rule {both} is both in an agent state and among a module's driver rules")

    def rules(self, modules: Sequence[type[Module]]) -> tuple[DriverRuleEntry, ...]:
        declared: list[DriverRuleEntry] = []
        for module in modules:
            for driver in module.drivers:
                declared += [self.entry(rule, driver.name, exempt=rule.exempt) for rule in driver.rules]
                declared += [self.entry(rule, module.name) for state in self.state_tree(driver.agent_states) for rule in state.rules]
            declared += [self.entry(rule, module.name) for state in self.state_tree(module.agent_states) for rule in state.rules]
            for overlay in module.overlays:
                declared += [self.entry(rule, overlay.name) for rule in overlay.rules]
            declared += [self.entry(rule, module.name, essential=rule.essential and module.name == DRIVERS_MODULE) for rule in module.driver_rules]
        return tuple(replace(entry, position=position) for position, entry in enumerate(sorted(declared, key=lambda entry: entry.priority), 1))

    def entry(self, rule: type[DriverRule], owner: str, exempt: bool = False, essential: bool = False) -> DriverRuleEntry:
        return DriverRuleEntry(rule.name, DottedPath.class_path(rule), rule.hook, 0, owner, tuple(rule.drivers), tuple(rule.roles), exempt, essential, rule.history,
                               rule.essential, rule.role_group, rule.priority)
