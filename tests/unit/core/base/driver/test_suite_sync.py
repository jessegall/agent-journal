from collections.abc import Sequence

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.suite import Suite
from core.base.module.driver_entries import DriverEntries
from core.base.module.module import Module
from core.base.module.suite_check import SuiteCheck


class StopThrough(DriverRule):
    """Lets every stop through."""

    name = "coding.carry-on"
    hook = HookEventName.STOP

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()


class NoGit(DriverRule):
    """Lets every tool use through in this sample."""

    name = "coding.no-git"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()


class AnyMain(DriverRule):
    """A rule a module adds for every main driver."""

    name = "safety.any-main"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = ["main"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()


class Coding(Suite):
    """Building software."""

    name = "coding"
    defaults = {"main": "coding.builder", "worker": "coding.worker"}


class BuilderDriver(Driver):
    """Drives the main agent of the coding suite."""

    name = "coding.builder"
    suite = "coding"
    role = "main"
    permanent_rules = [NoGit]
    rules = [StopThrough]


class Wait(Overlay):
    """A wait of the agent."""

    name = "waits.wait"
    rules = [StopThrough]

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return []


def module(name: str, dependencies: Sequence[str] = (), **lists: object) -> type[Module]:
    return type(name.capitalize(), tuple([Module]), {"name": name, "requires_core": ">=5,<6", "dependencies": dependencies, **lists})


def problems(*modules: type[Module]) -> list[str]:
    return list(SuiteCheck().problems(modules, DriverEntries().rules(modules)))


def test_a_suite_with_its_drivers_passes_and_a_default_may_name_a_driver_not_installed_yet():
    assert problems(module("coding", suites=[Coding], drivers=[BuilderDriver])) == []


def test_a_suite_two_modules_ship_is_refused():
    assert problems(module("coding", suites=[Coding]), module("other", suites=[Coding])) == ["two suites named coding"]


def test_a_suite_requiring_a_suite_no_module_ships_is_refused_with_the_line_to_install_it():
    agency = type("Agency", tuple([Suite]), {"name": "agency", "requires": ["marketing"]})
    assert problems(module("agency", suites=[agency])) == ["suite agency requires suite marketing: install the module that ships it first"]


def test_suites_that_require_each_other_are_refused():
    first = type("First", tuple([Suite]), {"name": "first", "requires": ["second"]})
    second = type("Second", tuple([Suite]), {"name": "second", "requires": ["first"]})
    assert problems(module("loop", suites=[first, second])) == ["suite first requires itself through first -> second -> first",
                                                                 "suite second requires itself through second -> first -> second"]


def test_a_driver_of_a_suite_whose_module_it_does_not_depend_on_is_refused():
    assert problems(module("coding", suites=[Coding]), module("extra", drivers=[BuilderDriver])) == [
        "driver coding.builder names suite coding of module coding, which module extra does not depend on"]


def test_a_driver_of_a_suite_its_module_depends_on_passes():
    assert problems(module("coding", suites=[Coding]), module("extra", ["coding"], drivers=[BuilderDriver])) == []


def test_a_default_naming_a_driver_of_another_role_or_an_unrequired_suite_is_refused():
    mixed = type("Mixed", tuple([Suite]), {"name": "mixed", "defaults": {"worker": "mixed.builder", "main": "coding.builder"}})
    builder = type("MixedBuilder", tuple([Driver]), {"name": "mixed.builder", "suite": "mixed", "role": "main"})
    assert problems(module("mixed", suites=[mixed], drivers=[builder])) == ["suite mixed gives role worker driver mixed.builder, which drives role main",
                                                                           "suite mixed gives role main driver coding.builder, of a suite it does not require"]


def test_a_rule_a_driver_lists_may_not_name_patterns_and_a_rule_a_module_adds_must():
    listed = type("Listed", tuple([Driver]), {"name": "coding.listed", "suite": "coding", "role": "main", "rules": [AnyMain]})
    loose = type("Loose", tuple([DriverRule]), {"name": "safety.loose", "hook": "stop"})
    assert problems(module("coding", suites=[Coding], drivers=[listed], driver_rules=[loose])) == [
        "rule safety.any-main is listed by coding.listed and also names driver patterns", "rule safety.loose names no driver pattern, so no driver hears it"]


def test_the_entries_keep_sync_order_limits_and_rules_then_overlay_rules_then_added_rules():
    entries = DriverEntries().rules([module("coding", suites=[Coding], drivers=[BuilderDriver], overlays=[Wait], driver_rules=[AnyMain])])
    assert [(entry.name, entry.owner, entry.permanent, entry.position) for entry in entries] == [
        ("coding.no-git", "coding.builder", True, 1), ("coding.carry-on", "coding.builder", False, 2), ("coding.carry-on", "waits.wait", False, 3),
        ("safety.any-main", "coding", False, 4)]


def test_a_rule_whose_hook_no_agent_program_sends_is_refused():
    misspelled = type("Misspelled", tuple([DriverRule]), {"name": "safety.misspelled", "hook": "stopp", "drivers": ["*"]})
    assert problems(module("safety", driver_rules=[misspelled])) == ["rule safety.misspelled covers hook stopp, which no agent program sends"]
