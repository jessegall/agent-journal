from dataclasses import replace
from time import perf_counter

from engine.container.container import Container
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
from engine.enums.hook_event_name import HookEventName
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.rule_answer import RuleAnswer
from engine.driver.refusal_skip_hint import RefusalSkipHint
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
from engine.driver.state_board import StateBoard
from engine.driver.state_boards import StateBoards
from engine.enums.state_tier import StateTier
from engine.driver.agent_state import AgentState
from engine.driver.layer import Layer
from engine.registry.agent_state_entry import AgentStateEntry
from engine.time.timestamp import Timestamp
from engine.scope.scopes import Scopes


SLOW_RULE_SECONDS = 0.1


class DriverRules:
    """Asks the rules a hook's driver hears: standing rules first, then each layer newest first, then the
    driver's own. An exclusive layer silences the ordinary rules beneath it, a refusal ends the walk, and a
    rule that raises is recorded and passed by."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, layers: Layers, history: HookHistory, errors: ErrorLog,
                 allowances: EssentialAllowances, scopes: Scopes, skips: RefusalSkips, system_log: SystemLogWriter, timings: RuleTimings, boards: StateBoards) -> None:
        self.system_log, self.timings, self.boards = system_log, timings, boards
        self.registry, self.container, self.switches, self.layers, self.history, self.errors = registry, container, switches, layers, history, errors
        self.allowances, self.scopes, self.skips = allowances, scopes, skips

    def ask(self, hook: AgentHook) -> RuleAnswers:
        suite = self.registry.suite(hook.suite)
        active = [layer for layer in self.layers.active(hook.agent_id, hook.driver) if suite is None or suite.is_overlay_included(layer.overlay.name)]
        patterned = self.registry.driver_rules(hook.driver, hook.role, hook.hook_name)
        allowed = [entry for entry in patterned if entry.claims_essential and self.allowances.allowed(entry.name)]
        board = self.boards.for_hook(hook)
        critical = self.registry.tier_states(hook.driver, int(StateTier.CRITICAL))
        stacked = board.stack(hook.driver)
        tier_rules = {rule for state in [*critical, *(layer.overlay for layer in stacked)] for rule in state.rules}
        added = [entry for entry in patterned if entry not in allowed and entry.name not in tier_rules and (suite is None or suite.is_rule_included(entry.owner, entry.drivers, hook.driver))]
        layers = self.newest_first([*active, *stacked])
        walk = Walk([layer.row.ref for layer in layers])
        calls: list[RuleCall] = []
        if hook.is_main_stop:
            calls = [RuleCall(entry, hook) for entry in [*self.registry.essential_rules(hook.driver, hook.hook_name), *allowed]]
            calls.extend(RuleCall(entry, replace(hook, layer=layer.row)) for layer in active for entry in self.registry.overlay_rules(layer.overlay.name, hook.hook_name))
            calls.extend(RuleCall(entry, hook) for entry in added)
        for entry in [*self.registry.essential_rules(hook.driver, hook.hook_name), *allowed]:
            if self.is_active_rule(entry, hook) and walk.record(entry, "", self.outcome(entry, hook)):
                return self.complete_checks(walk, hook, calls)
        # a critical state's rules come right after the essential ones, and no exclusive layer silences them
        for state in critical:
            if not self.switches.enabled(state.name) or not board.is_open(state):
                continue
            for entry in self.registry.state_rules(state.name, hook.hook_name):
                if self.is_active_rule(entry, hook) and walk.record(entry, state.name, self.outcome(entry, hook)):
                    return self.complete_checks(walk, hook, calls, board)
        for layer in layers:
            layer_hook, ref = replace(hook, layer=layer.row), self.layer_ref(layer)
            for entry in self.layer_rules(layer, hook.hook_name):
                if not self.is_active_rule(entry, hook):
                    continue
                if walk.is_silenced:
                    walk.record_silenced(entry, ref)
                elif walk.record(entry, ref, self.outcome(entry, layer_hook)):
                    return self.complete_checks(walk, hook, calls, board)
            walk.leave_layer(layer, self.layer_class(layer))
        for entry in added:
            if not self.is_active_rule(entry, hook):
                continue
            if walk.silences(entry.path.checked_class(DriverRule)):
                walk.record_silenced(entry, "")
                continue
            gate = self.closed_gate(entry, board)
            if gate:
                walk.record_gated(entry, gate)
            elif walk.record(entry, "", self.outcome(entry, hook)):
                return self.complete_checks(walk, hook, calls, board)
        return self.complete_checks(walk, hook, calls, board)

    # the overlays and the open stack states in one stack, newest first, a substate directly above its parent
    @staticmethod
    def newest_first(layers: list[Layer]) -> list[Layer]:
        parents = {layer.overlay.name: layer for layer in layers if not isinstance(layer.overlay, AgentStateEntry) or not layer.overlay.parent}

        def placed(layer: Layer) -> tuple[Timestamp, int, int, int]:
            base = parents.get(layer.overlay.parent, layer) if isinstance(layer.overlay, AgentStateEntry) and layer.overlay.parent else layer
            return base.row.opened_at, base.overlay.position, base.row.row_id, int(base is not layer)
        return sorted(layers, key=placed, reverse=True)

    # a stack state is recorded under its own name, an overlay under its open row
    @staticmethod
    def layer_ref(layer: Layer) -> str:
        return layer.overlay.name if isinstance(layer.overlay, AgentStateEntry) else layer.row.ref

    def layer_rules(self, layer: Layer, hook_name: str) -> list[DriverRuleEntry]:
        if isinstance(layer.overlay, AgentStateEntry):
            return self.registry.state_rules(layer.overlay.name, hook_name)
        return self.registry.overlay_rules(layer.overlay.name, hook_name)

    @staticmethod
    def layer_class(layer: Layer) -> type[Overlay] | type[AgentState]:
        if isinstance(layer.overlay, AgentStateEntry):
            return layer.overlay.path.checked_class(AgentState)
        return layer.overlay.path.checked_class(Overlay)

    # the name of the agent state that gates the rule when that state is switched on and closed for this hook
    def closed_gate(self, entry: DriverRuleEntry, board: StateBoard) -> str:
        gate = self.registry.rule_gate(entry.name)
        if gate is None or not self.switches.enabled(gate.name) or board.is_open(gate):
            return ""
        return gate.name

    def complete_checks(self, walk: Walk, hook: AgentHook, calls: list[RuleCall], board: StateBoard | None = None) -> RuleAnswers:
        answers = walk.answers(board.state_records() if board is not None else ())
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
            if not self.is_active_rule(entry, call.hook):
                checks.append(StopCheck(entry.name, "disabled", "the rule is switched off or stands down for the new driver", False,
                                        layer if layer else None))
                continue
            gate = self.closed_gate(entry, board) if board is not None and not layer else ""
            if gate:
                checks.append(StopCheck(entry.name, "allowed", f"{gate} is not open", False))
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
        if board is not None:
            checks.extend(self.critical_checks(answers, hook, board))
        return replace(answers, stop_checks=tuple(checks))

    # the stop rules of each critical state: as recorded when the state was open, allowed when it was not
    def critical_checks(self, answers: RuleAnswers, hook: AgentHook, board: StateBoard) -> list[StopCheck]:
        checks: list[StopCheck] = []
        for state in self.registry.tier_states(hook.driver, int(StateTier.CRITICAL)):
            if self.switches.enabled(state.name) and board.is_open(state):
                checks.extend(record.stop_check for record in answers.rules if record.layer == state.name)
                continue
            checks.extend(StopCheck(entry.name, "allowed", f"{state.name} is not open", False) for entry in self.registry.state_rules(state.name, hook.hook_name))
        stacked = {layer.overlay.name for layer in board.stack(hook.driver)}
        checks.extend(record.stop_check for record in answers.rules if record.layer in stacked)
        return checks

    def skippable(self, answer: RuleAnswer, entry: DriverRuleEntry, hook: AgentHook) -> RuleAnswer:
        if not answer.refusal or answer.is_safety_refusal:
            return answer
        skip = self.skips.waiting(hook.agent_id, entry.name)
        if skip is not None:
            return RuleAnswer.allowed().running(skip)
        if hook.hook_name != HookEventName.PRE_TOOL_USE or not self.skips.has_refused(hook.agent_id, entry.name):
            return answer
        return RefusalSkipHint.hinted(answer, entry.name)

    # a rule is asked when it is switched on and the new driver does not answer for it at this agent's hook
    def is_active_rule(self, entry: DriverRuleEntry, hook: AgentHook) -> bool:
        return self.switches.enabled(entry.name) and entry.name not in hook.machine_answered_rules

    def outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        started_at = perf_counter()
        outcome = self.rule_outcome(entry, hook)
        elapsed = perf_counter() - started_at
        self.timings.note(hook.agent_id, entry.name, elapsed)
        if elapsed >= SLOW_RULE_SECONDS:
            self.system_log.write(LogLevel.INFORMATION, f"rule {entry.name} took {elapsed * 1000:.0f} ms on a {hook.hook_name} hook")
        return replace(outcome, milliseconds=round(elapsed * 1000))

    def rule_outcome(self, entry: DriverRuleEntry, hook: AgentHook) -> RuleOutcome:
        try:
            rule = self.container.get(entry.path.checked_class(DriverRule))
            if rule.start_line_rule and hook.event.is_resume:
                return RuleOutcome.answered(RuleAnswer.allowed())
            control_return = rule.history and self.history.control_return(RuleHistoryKey(hook.agent_id, entry.name, hook.layer_ref))
            with self.scopes.read_scope(rule.disabled_scopes, hook.agent_id, hook.environment_id):
                answer = self.skippable(rule.answer(replace(hook, control_return=control_return)).role_variant(hook.role), entry, hook)
                if answer.refusal and rule.skip_window is not None and self.skips.is_skipped(hook.agent_id, rule.skip_name or entry.name, rule.skip_window, hook.timestamp):
                    answer = RuleAnswer.allowed(f"the agent skipped {entry.name}, which stays silent for it for a while")
        except Exception as error:
            self.errors.reported(["driver rule", entry.name], error, hook.environment_id)
            return RuleOutcome.raised(f"the journal's rule {entry.name} failed and was passed by: {type(error).__name__}")
        if answer.is_final_allowance and not (entry.is_standing or self.allowances.allowed(entry.name)):
            return RuleOutcome.raised(f"{entry.name} allowed the hook at once and ended the walk, which only an essential rule or an exempt rule may")
        return RuleOutcome.answered(answer)
