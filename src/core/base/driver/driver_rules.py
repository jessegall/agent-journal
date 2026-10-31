from dataclasses import replace

from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.essential_allowances import EssentialAllowances
from core.base.driver.layer import Layer
from core.base.driver.hook_history import HookHistory
from core.base.driver.layers import Layers
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_outcome import RuleOutcome
from core.base.driver.walk import Walk
from core.base.error_log import ErrorLog
from core.base.guard.guard_switches import GuardSwitches
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.registry import Registry
from core.base.registry.suite_entry import SuiteEntry


class DriverRules:
    """Asks the rules a hook's driver hears: standing rules first, then each layer newest first, then the driver's
    own. An exclusive layer silences the ordinary rules beneath it, a refusal ends the walk, and a rule that
    raises is recorded and passed by."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, layers: Layers, history: HookHistory, errors: ErrorLog,
                 allowances: EssentialAllowances) -> None:
        self.registry, self.container, self.switches, self.layers, self.history, self.errors = registry, container, switches, layers, history, errors
        self.allowances = allowances

    def ask(self, hook: AgentHook) -> RuleAnswers:
        suite = self.registry.suite(hook.suite)
        active = [layer for layer in self.layers.active(hook.agent_id, hook.driver) if self.is_heard_layer(layer, suite)]
        patterned = self.registry.driver_rules(hook.driver, hook.role, hook.hook_name)
        allowed = [entry for entry in patterned if entry.claims_essential and self.allowances.allowed(entry.name)]
        added = [entry for entry in patterned if entry not in allowed and self.is_heard_rule(entry, hook.driver, suite)]
        walk = Walk([layer.row.ref for layer in active])
        for entry in [*self.registry.essential_rules(hook.driver, hook.hook_name), *allowed]:
            if self.switches.enabled(entry.name) and walk.record(entry, "", self.outcome(entry, hook)):
                return walk.answers()
        for layer in active:
            layer_hook = replace(hook, layer=layer.row)
            for entry in self.registry.overlay_rules(layer.overlay.name, hook.hook_name):
                if not self.switches.enabled(entry.name):
                    continue
                if walk.is_silenced:
                    walk.record_silenced(entry, layer.row.ref)
                elif walk.record(entry, layer.row.ref, self.outcome(entry, layer_hook)):
                    return walk.answers()
            walk.leave_layer(layer, layer.overlay.path.checked_class(Overlay))
        for entry in added:
            if not self.switches.enabled(entry.name):
                continue
            if walk.is_silenced:
                walk.record_silenced(entry, "")
            elif walk.record(entry, "", self.outcome(entry, hook)):
                return walk.answers()
        return walk.answers()

    def is_heard_layer(self, layer: Layer, suite: SuiteEntry | None) -> bool:
        return suite is None or not suite.complete_control or layer.overlay.name in suite.included_overlays

    def is_heard_rule(self, entry: DriverRuleEntry, driver: str, suite: SuiteEntry | None) -> bool:
        if suite is None or not suite.complete_control or entry.owner == driver:
            return True
        return any(pattern.partition(".")[0] in (suite.name, *suite.requires) for pattern in entry.drivers)

    def outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        try:
            rule = self.container.get(entry.path.checked_class(DriverRule))
            regained = rule.history and self.history.regained_control(hook.agent_id, entry.name, hook.layer_ref)
            answer = rule.answer(replace(hook, regained_control=regained))
        except Exception as error:
            self.errors.reported(["driver rule", entry.name], error)
            return RuleOutcome.raised(f"the journal's rule {entry.name} failed and was passed by: {type(error).__name__}")
        if answer.is_final_allowance and not (entry.is_standing or self.allowances.allowed(entry.name)):
            return RuleOutcome.raised(f"{entry.name} allowed the hook at once and ended the walk, which only an essential rule or a limit may")
        return RuleOutcome.answered(answer)
