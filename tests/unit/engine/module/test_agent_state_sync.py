import json

import pytest

from engine.dotted_path.dotted_path import DottedPath
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.module.driver_entries import DriverEntries
from engine.module.errors.module_error import ModuleError
from engine.module.module import Module
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.registry import Registry


class FirstRule(DriverRule):
    name = "samples.first"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook):
        return RuleAnswer.allowed()


class SecondRule(FirstRule):
    name = "samples.second"


class LoadingState(AgentState):
    name = "samples.loading"
    rules = [FirstRule]


class OtherLoadingState(AgentState):
    name = "samples.loading"


class NamelessState(AgentState):
    rules = []


class AlsoFirstState(AgentState):
    name = "samples.also-first"
    rules = [FirstRule]


def module(**lists) -> type[Module]:
    return type("Samples", tuple([Module]), {"name": "samples", "requires_core": ">=5,<6", "dependencies": [], **lists})


def refusal(**lists) -> str:
    with pytest.raises(ModuleError) as refused:
        DriverEntries().agent_states([module(**lists)])
    return str(refused.value)


def test_a_state_without_a_name_is_refused():
    assert "has no name" in refusal(agent_states=[NamelessState])


def test_two_states_with_one_name_are_refused():
    assert refusal(agent_states=[LoadingState, OtherLoadingState]) == "two agent states are named samples.loading"


def test_a_rule_gated_by_two_states_is_refused():
    assert refusal(agent_states=[LoadingState, AlsoFirstState]) == "the rule samples.first is gated by two agent states"


def test_a_rule_both_gated_and_a_driver_rule_is_refused():
    assert refusal(agent_states=[LoadingState], driver_rules=[FirstRule]) == "the rule samples.first is both in an agent state and among a module's driver rules"


def test_moving_a_rule_into_a_state_keeps_its_rule_entry_and_position():
    as_rules = DriverEntries().rules([module(driver_rules=[FirstRule, SecondRule])])
    as_state = DriverEntries().rules([module(driver_rules=[SecondRule], agent_states=[LoadingState])])
    assert sorted((entry.name, entry.position, entry.owner) for entry in as_rules) == sorted((entry.name, entry.position, entry.owner) for entry in as_state)


def test_the_registry_keeps_its_agent_states_and_finds_a_rules_gate():
    entry = AgentStateEntry("samples.loading", DottedPath("tests.samples.LoadingState"), "samples", 1, int(StateTier.STACK), ("*",), "", ("samples.first",), ())
    registry = Registry("states", {}, {}, {}, (), (), agent_states=tuple([entry]))
    restored = Registry.parsed("states", registry.entries_text())
    assert restored.agent_states == (entry,)
    assert restored.rule_gate("samples.first") == entry and restored.rule_gate("samples.second") is None
    assert json.loads(registry.entries_text())["agent_states"][0]["rules"] == ["samples.first"]
