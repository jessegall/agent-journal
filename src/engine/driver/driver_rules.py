from dataclasses import replace
from time import perf_counter

from engine.container.container import Container
from engine.guard.guard_refusal import SKIP_ALLOWED_CASE
from engine.driver.rule_call import RuleCall
from engine.driver.rule_record import RuleRecord
from engine.driver.stop_check import StopCheck
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.essential_allowances import EssentialAllowances
from engine.driver.hook_history import HookHistory
from engine.driver.rule_history_key import RuleHistoryKey
from engine.driver.layers import Layers
from engine.driver.overlay import Overlay
from engine.driver.hook_event_name import HookEventName
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_outcome import RuleOutcome
from engine.driver.rule_timings import RuleTimings
from engine.driver.walk import Walk
from engine.log.error_log import ErrorLog
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.guard.guard_switches import GuardSwitches
from engine.registry.driver_rule_entry import DriverRuleEntry
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes


SLOW_RULE_SECONDS = 0.1


class DriverRules:
    """Asks the rules a hook's driver hears: standing rules first, then each layer newest first, then the
    driver's own. An exclusive layer silences the ordinary rules beneath it, a refusal ends the walk, and a
    rule that raises is recorded and passed by."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, layers: Layers, history: HookHistory, errors: ErrorLog,
                 allowances: EssentialAllowances, scopes: Scopes, skips: RefusalSkips, system_log: SystemLogWriter, timings: RuleTimings) -> None:
        self.system_log, self.timings = system_log, timings
        self.registry, self.container, self.switches, self.layers, self.history, self.errors = registry, container, switches, layers, history, errors
        self.allowances, self.scopes, self.skips = allowances, scopes, skips

    def ask(self, hook: AgentHook) -> RuleAnswers:
        suite = self.registry.suite(hook.suite)
        active = [layer for layer in self.layers.active(hook.agent_id, hook.driver) if suite is None or suite.is_overlay_included(layer.overlay.name)]
        patterned = self.registry.driver_rules(hook.driver, hook.role, hook.hook_name, hook.suite)
        allowed = [entry for entry in patterned if entry.claims_essential and self.allowances.allowed(entry.name)]
        added = [entry for entry in patterned if entry not in allowed and (suite is None or suite.is_rule_included(entry.owner, entry.drivers, hook.driver))]
        walk = Walk([layer.row.ref for layer in active])
        calls: list[RuleCall] = []
        if hook.is_main_stop:
            calls = [RuleCall(entry, hook) for entry in [*self.registry.essential_rules(hook.driver, hook.hook_name), *allowed]]
            calls.extend(RuleCall(entry, replace(hook, layer=layer.row)) for layer in active for entry in self.registry.overlay_rules(layer.overlay.name, hook.hook_name))
            calls.extend(RuleCall(entry, hook) for entry in added)
        for entry in [*self.registry.essential_rules(hook.driver, hook.hook_name), *allowed]:
            if self.switches.enabled(entry.name) and walk.record(entry, "", self.outcome(entry, hook)):
                return self.complete_checks(walk, hook, calls)
        for layer in active:
            layer_hook = replace(hook, layer=layer.row)
            for entry in self.registry.overlay_rules(layer.overlay.name, hook.hook_name):
                if not self.switches.enabled(entry.name):
                    continue
                if walk.is_silenced:
                    walk.record_silenced(entry, layer.row.ref)
                elif walk.record(entry, layer.row.ref, self.outcome(entry, layer_hook)):
                    return self.complete_checks(walk, hook, calls)
            walk.leave_layer(layer, layer.overlay.path.checked_class(Overlay))
        for entry in added:
            if not self.switches.enabled(entry.name):
                continue
            if walk.silences(entry.path.checked_class(DriverRule)):
                walk.record_silenced(entry, "")
            elif walk.record(entry, "", self.outcome(entry, hook)):
                return self.complete_checks(walk, hook, calls)
        return self.complete_checks(walk, hook, calls)

    def complete_checks(self, walk: Walk, hook: AgentHook, calls: list[RuleCall]) -> RuleAnswers:
        answers = walk.answers()
        if not hook.is_main_stop:
            return answers
        recorded = {(record.name, record.layer): record for record in answers.rules}
        checks: list[StopCheck] = []
        for call in calls:
            entry, layer = call.entry, call.hook.layer_ref
            record = recorded.get((entry.name, layer))
            if record is not None:
                checks.append(record.stop_check)
                continue
            if not self.switches.enabled(entry.name):
                checks.append(StopCheck(entry.name, "disabled", "the rule is switched off", False,
                                        layer if layer else None))
                continue
            outcome = self.outcome(entry, call.hook)
            checks.append(RuleRecord(entry.name, layer, outcome.outcome, outcome.answer, applied=False, reason=outcome.line).stop_check)
        active_names = {call.entry.owner for call in calls if call.hook.layer is not None}
        suite = self.registry.suite(hook.suite)
        for overlay in self.registry.driver_overlays(hook.driver):
            if overlay.name in active_names or (suite is not None and not suite.is_overlay_included(overlay.name)):
                continue
            checks.extend(StopCheck(entry.name, "allowed", f"no active {overlay.name} layer", False)
                          for entry in self.registry.overlay_rules(overlay.name, hook.hook_name) if entry.hook == HookEventName.STOP)
        return replace(answers, stop_checks=tuple(checks))

    def skippable(self, answer: RuleAnswer, entry: DriverRuleEntry, hook: AgentHook) -> RuleAnswer:
        if not answer.refusal or answer.is_safety_refusal:
            return answer
        skip = self.skips.waiting(hook.agent_id, entry.name)
        if skip is not None:
            return RuleAnswer.allowed().running(skip)
        if hook.hook_name != HookEventName.PRE_TOOL_USE or not self.skips.has_refused(hook.agent_id, entry.name):
            return answer
        return replace(answer, refusal=f"{answer.refusal} ({SKIP_ALLOWED_CASE}: journal refusal skip {entry.name} --reason '<why it is wrong here>')")

    def outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        started_at = perf_counter()
        outcome = self.rule_outcome(entry, hook)
        elapsed = perf_counter() - started_at
        self.timings.note(hook.agent_id, entry.name, elapsed)
        if elapsed >= SLOW_RULE_SECONDS:
            self.system_log.write(LogLevel.INFORMATION, f"rule {entry.name} took {elapsed * 1000:.0f} ms on a {hook.hook_name} hook")
        return outcome

    def rule_outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        try:
            rule = self.container.get(entry.path.checked_class(DriverRule))
            if rule.start_line_rule and hook.event.is_resume:
                return RuleOutcome.answered(RuleAnswer.allowed())
            control_return = rule.history and self.history.control_return(RuleHistoryKey(hook.agent_id, entry.name, hook.layer_ref))
            with self.scopes.read_scope(rule.disabled_scopes, hook.agent_id, hook.environment_id):
                answer = self.skippable(rule.answer(replace(hook, control_return=control_return)), entry, hook)
        except Exception as error:
            self.errors.reported(["driver rule", entry.name], error, hook.environment_id)
            return RuleOutcome.raised(f"the journal's rule {entry.name} failed and was passed by: {type(error).__name__}")
        if answer.is_final_allowance and not (entry.is_standing or self.allowances.allowed(entry.name)):
            return RuleOutcome.raised(f"{entry.name} allowed the hook at once and ended the walk, which only an essential rule or an exempt rule may")
        return RuleOutcome.answered(answer)
