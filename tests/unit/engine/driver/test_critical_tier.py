from collections.abc import Sequence
from dataclasses import replace

from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.driver_rules import DriverRules
from engine.driver.essential_allowances import EssentialAllowances
from engine.driver.hook_event import HookEvent
from engine.driver.layers import Layers
from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.rule_timings import RuleTimings
from engine.driver.state_boards import StateBoards
from engine.dotted_path.dotted_path import DottedPath
from engine.enums.state_tier import StateTier
from engine.journal.journal_home import JournalHome
from engine.log.error_log import ErrorLog
from engine.log.exception_sink import ExceptionSink
from engine.log.system_log_writer import SystemLogWriter
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.driver_rule_entry import DriverRuleEntry
from engine.registry.overlay_entry import OverlayEntry
from engine.time.clock import Clock
from tests.unit.engine.driver.test_walk import DRIVER, AddsLine, Allows, OldWait, RegainedHistory, Refuses, Switches, at, rule
from tests.unit.engine.samples.sample_container import empty_registry
from tests.unit.engine.samples.scope_samples import empty_database_scopes


class OpenCritical(AgentState):
    name = "samples.critical"
    tier = StateTier.CRITICAL

    def open_rows(self, hook):
        return [OpenRow("samples", 1, at(1))]


class SecondCritical(OpenCritical):
    name = "samples.second-critical"


class ClosedCritical(OpenCritical):
    name = "samples.closed-critical"

    def open_rows(self, hook):
        return ()


def critical(state: type[AgentState], position: int, rules: Sequence[str]) -> AgentStateEntry:
    return AgentStateEntry(state.name, DottedPath.class_path(state), "samples", position, int(StateTier.CRITICAL), tuple(["*"]), "", tuple(rules))


def answered(tmp_path, rules: Sequence[DriverRuleEntry], states: Sequence[AgentStateEntry], overlays: Sequence[type[Overlay]] = ()):
    entries = tuple(OverlayEntry(f"samples.{overlay.__name__}", DottedPath.class_path(overlay), position, ["*"]) for position, overlay in enumerate(overlays, 1))
    registry = replace(empty_registry().with_overlays(entries).with_rules(tuple(rules)), agent_states=tuple(states))
    errors, system_log = ErrorLog(SystemLogWriter(JournalHome(tmp_path), Clock()), ExceptionSink()), SystemLogWriter(JournalHome(tmp_path), Clock())
    walker = DriverRules(registry, Container(), Switches(), Layers(registry, Container()), RegainedHistory(), errors, EssentialAllowances(), empty_database_scopes(),
                         RefusalSkips(), system_log, RuleTimings(), StateBoards(registry, Container(), errors, system_log))
    event = HookEvent(1, "claude", "stop", "s1", "f1", 1, "agent", "main", None, None, {})
    return walker.ask(AgentHook(event, 3, 1, "main", DRIVER, at(30)))


def outcomes(answers) -> list[tuple[str, str, str]]:
    return [(record.name, record.layer, record.outcome) for record in answers.rules]


def test_a_critical_rule_is_asked_right_after_the_essential_rules_and_before_any_stack_layer(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("c.critical", AddsLine, 3, "samples"),
             rule("drivers.essential", Allows, 4, "drivers", essential=True)]
    answers = answered(tmp_path, rules, [critical(OpenCritical, 1, ["c.critical"])], [OldWait])
    assert outcomes(answers)[:3] == [("drivers.essential", "", "allowed"), ("c.critical", "samples.critical", "lines"), ("o.old", "wait:1", "lines")]


def test_a_critical_refusal_ends_the_walk(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("c.critical", Refuses, 2, "samples")]
    assert outcomes(answered(tmp_path, rules, [critical(OpenCritical, 1, ["c.critical"])])) == [("c.critical", "samples.critical", "refused")]


def test_an_exclusive_stack_layer_silences_the_rules_beneath_it_but_never_a_critical_rule(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("c.critical", AddsLine, 3, "samples")]
    assert outcomes(answered(tmp_path, rules, [critical(OpenCritical, 1, ["c.critical"])], [OldWait])) == [
        ("c.critical", "samples.critical", "lines"), ("o.old", "wait:1", "lines"), ("d.driver", "", "silenced")]


def test_two_critical_states_keep_their_registration_order(tmp_path):
    rules = [rule("c.second", AddsLine, 1, "samples"), rule("c.first", AddsLine, 2, "samples")]
    states = [critical(SecondCritical, 1, ["c.second"]), critical(OpenCritical, 2, ["c.first"])]
    assert outcomes(answered(tmp_path, rules, states)) == [("c.second", "samples.second-critical", "lines"), ("c.first", "samples.critical", "lines")]


def test_a_closed_critical_state_asks_nothing_and_a_main_stop_lists_its_stop_rules_as_allowed(tmp_path):
    answers = answered(tmp_path, [rule("c.closed", Refuses, 1, "samples")], [critical(ClosedCritical, 1, ["c.closed"])])
    assert outcomes(answers) == []
    assert [(check.rule, check.outcome, check.reason) for check in answers.stop_checks] == [("c.closed", "allowed", "samples.closed-critical is not open")]
