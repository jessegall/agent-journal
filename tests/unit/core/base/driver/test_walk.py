from core.base.fault_sink import FaultSink
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import pytest

from core.base.command.command import Command
from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.driver_rules import DriverRules
from core.base.driver.essential_allowances import EssentialAllowances
from core.base.driver.hook_event import HookEvent
from core.base.driver.layers import Layers
from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answer import RuleAnswer
from core.base.error_log import ErrorLog
from core.base.guard.guard_switches import GuardSwitches
from core.base.journal_home import JournalHome
from core.base.registry.dotted_path import DottedPath
from core.base.registry.wrong_base_error import WrongBaseError
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.overlay_entry import OverlayEntry
from core.base.timestamp import Timestamp
from tests.unit.core.base.sample_container import empty_registry

START = datetime(2026, 10, 31, 9, tzinfo=timezone.utc)
DRIVER = "coding.builder"


def at(minutes: int) -> Timestamp:
    return Timestamp(START + timedelta(minutes=minutes))


class Allows(DriverRule):
    """Lets the hook through and says nothing."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()


class AddsLine(DriverRule):
    """AddsLine the agent which layer it was asked for."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_lines(f"asked for {hook.layer_ref or 'the driver'}")


class Refuses(DriverRule):
    """Refuses the hook."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.refused("no")


class AllowsNow(DriverRule):
    """Lets the hook through at once, ending the walk."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.final_allowance("go on")


class Raises(DriverRule):
    """Fails on every hook."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise RuntimeError("the rule failed")


@dataclass(frozen=True)
class SampleEnd(Command[None]):
    """A sample command that ends a layer's row."""

    row_id: int


class EndsItsLayer(DriverRule):
    """Ends the layer it is asked for."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().ending_layer(SampleEnd(1))


class ControlReturnLine(DriverRule):
    """AddsLine the agent when it has control again."""

    history = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_lines("control regained") if hook.control_return else RuleAnswer.allowed()


class OldWait(Overlay):
    """An exclusive wait opened first."""

    exclusive = True

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("wait", 1, at(10))]


class NewRun(Overlay):
    """A sequence run opened after the wait."""

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("sequence_run", 2, at(20))]


class Switches(GuardSwitches):
    """Every rule switched on but the ones named."""

    def __init__(self, off: Sequence[str] = ()) -> None:
        self.off = off

    def enabled(self, guard_name: str) -> bool:
        return guard_name not in self.off


class RegainedHistory:
    """A history in which every history rule has regained control."""

    def control_return(self, key: RuleHistoryKey) -> bool:
        return True


def rule(name: str, rule_class: type[DriverRule], position: int, owner: str, permanent: bool = False, essential: bool = False) -> DriverRuleEntry:
    return DriverRuleEntry(name, DottedPath.class_path(rule_class), "stop", position, owner, (), (), permanent, essential)


def outcomes(tmp_path, rules: Sequence[DriverRuleEntry], overlays: Sequence[type[Overlay]] = (), off: Sequence[str] = (), history=None) -> list[tuple[str, str, str]]:
    entries = tuple(OverlayEntry(f"samples.{overlay.__name__}", DottedPath.class_path(overlay), position, ["*"]) for position, overlay in enumerate(overlays, 1))
    registry = empty_registry().with_overlays(entries).with_rules(tuple(rules))
    walker = DriverRules(registry, Container(), Switches(off), Layers(registry, Container()), history or RegainedHistory(), ErrorLog(JournalHome(tmp_path), FaultSink()), EssentialAllowances())
    event = HookEvent(1, "claude", "stop", "s1", "f1", 1, "agent", "main", "", None, None, {})
    answers = walker.ask(AgentHook(event, 3, 1, "main", DRIVER, at(30)))
    return [(record.name, record.layer, record.outcome) for record in answers.rules]


def test_essential_rules_and_limits_come_first_then_layers_newest_first_then_the_driver_rules(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("o.new", AddsLine, 3, "samples.NewRun"),
             rule("d.limit", Allows, 4, DRIVER, permanent=True), rule("drivers.essential", Allows, 5, "drivers", essential=True)]
    assert outcomes(tmp_path, rules, [NewRun]) == [("d.limit", "", "allowed"), ("drivers.essential", "", "allowed"), ("o.new", "sequence_run:2", "lines"), ("d.driver", "", "lines")]


def test_an_exclusive_layer_passes_over_the_ordinary_rules_beneath_it_but_never_a_limit(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("d.limit", AddsLine, 3, DRIVER, permanent=True)]
    assert outcomes(tmp_path, rules, [OldWait]) == [("d.limit", "", "lines"), ("o.old", "wait:1", "lines"), ("d.driver", "", "silenced")]


def test_a_newer_layer_is_asked_before_an_older_exclusive_one_which_then_silences_the_driver(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("o.new", AddsLine, 3, "samples.NewRun")]
    assert outcomes(tmp_path, rules, [OldWait, NewRun]) == [("o.new", "sequence_run:2", "lines"), ("o.old", "wait:1", "lines"), ("d.driver", "", "silenced")]


def test_a_layer_whose_rule_ends_it_silences_nothing_beneath(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("o.old", EndsItsLayer, 2, "samples.OldWait")]
    assert outcomes(tmp_path, rules, [OldWait]) == [("o.old", "wait:1", "allowed"), ("d.driver", "", "lines")]


def test_the_first_refusal_ends_the_walk(tmp_path):
    rules = [rule("d.first", Refuses, 1, DRIVER), rule("d.second", AddsLine, 2, DRIVER)]
    assert outcomes(tmp_path, rules) == [("d.first", "", "refused")]


def test_a_rule_that_raises_is_recorded_and_the_walk_goes_on(tmp_path):
    rules = [rule("d.broken", Raises, 1, DRIVER), rule("d.second", AddsLine, 2, DRIVER)]
    assert outcomes(tmp_path, rules) == [("d.broken", "", "raised"), ("d.second", "", "lines")]
    assert "the rule failed" in JournalHome(tmp_path).error_log.read_text()


def test_an_ordinary_rule_that_lets_the_hook_through_at_once_is_recorded_as_raised_and_the_walk_goes_on(tmp_path):
    rules = [rule("d.hasty", AllowsNow, 1, DRIVER), rule("d.second", AddsLine, 2, DRIVER)]
    assert outcomes(tmp_path, rules) == [("d.hasty", "", "raised"), ("d.second", "", "lines")]


def test_a_limit_that_lets_the_hook_through_at_once_ends_the_walk(tmp_path):
    rules = [rule("d.limit", AllowsNow, 1, DRIVER, permanent=True), rule("d.second", AddsLine, 2, DRIVER)]
    assert outcomes(tmp_path, rules) == [("d.limit", "", "lines")]


def test_a_switched_off_rule_is_neither_asked_nor_passed_over(tmp_path):
    rules = [rule("d.off", AddsLine, 1, DRIVER), rule("o.old", AddsLine, 2, "samples.OldWait"), rule("d.also-off", AddsLine, 3, DRIVER)]
    assert outcomes(tmp_path, rules, [OldWait], off=["d.off", "d.also-off"]) == [("o.old", "wait:1", "lines")]


def test_a_history_rule_is_told_when_it_has_control_again(tmp_path):
    assert outcomes(tmp_path, [rule("d.back", ControlReturnLine, 1, DRIVER)]) == [("d.back", "", "lines")]


def test_a_registered_class_of_the_wrong_base_is_refused_by_the_one_loader():
    with pytest.raises(WrongBaseError):
        DottedPath.class_path(OldWait).checked_class(DriverRule)
