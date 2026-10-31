from dataclasses import replace

from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
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


class DriverRules:
    """Asks the rules a hook's driver hears: essential rules and limits, then the layers newest first, then the driver's
    own; an exclusive layer silences ordinary rules beneath it, a refusal ends the walk, and a rule that raises is
    recorded and passed by."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, layers: Layers, history: HookHistory, errors: ErrorLog) -> None:
        self.registry, self.container, self.switches, self.layers, self.history, self.errors = registry, container, switches, layers, history, errors

    def ask(self, hook: AgentHook) -> RuleAnswers:
        active = self.layers.active(hook.agent_id, hook.driver)
        walk = Walk([layer.row.ref for layer in active])
        for entry in self.registry.essential_rules(hook.driver, hook.role, hook.hook_name):
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
        for entry in self.registry.driver_rules(hook.driver, hook.role, hook.hook_name):
            if not self.switches.enabled(entry.name):
                continue
            if walk.is_silenced:
                walk.record_silenced(entry, "")
            elif walk.record(entry, "", self.outcome(entry, hook)):
                return walk.answers()
        return walk.answers()

    def outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        try:
            rule = self.container.get(entry.path.checked_class(DriverRule))
            regained = rule.history and self.history.regained_control(hook.agent_id, entry.name, hook.layer_ref)
            answer = rule.answer(replace(hook, regained_control=regained))
        except Exception as error:
            self.errors.reported(["driver rule", entry.name], error)
            return RuleOutcome.raised(f"the journal's rule {entry.name} failed and was passed by: {type(error).__name__}")
        if answer.is_let_through_now and not entry.is_asked_first:
            return RuleOutcome.raised(f"{entry.name} let the hook through and ended the walk, which only an essential rule or a limit may")
        return RuleOutcome.answered(answer)
