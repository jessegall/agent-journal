from collections.abc import Sequence

from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.dotted_path.dotted_path import DottedPath
from engine.enums.state_tier import StateTier
from engine.registry.agent_state_entry import AgentStateEntry
from tests.integration.engine.driver.test_critical_tier import answered, outcomes
from tests.integration.engine.driver.test_walk import DRIVER, AddsLine, NewRun, OldWait, at, rule


class LateStack(AgentState):
    name = "samples.late-stack"

    def open_rows(self, hook):
        return [OpenRow("samples", 7, at(25))]


class EarlyStack(AgentState):
    name = "samples.early-stack"

    def open_rows(self, hook):
        return [OpenRow("samples", 8, at(5))]


class ExclusiveStack(LateStack):
    name = "samples.exclusive-stack"
    exclusive = True


class SubStack(AgentState):
    name = "samples.sub-stack"

    def open_rows(self, hook):
        return [OpenRow("samples", 9, at(1))]


def stack(state: type[AgentState], position: int, rules: Sequence[str], parent: str = "") -> AgentStateEntry:
    return AgentStateEntry(state.name, DottedPath.class_path(state), "samples", position, int(StateTier.STACK), tuple(["*"]), parent, tuple(rules))


def test_an_open_stack_state_asks_its_rules_under_its_own_name_in_the_stack(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("s.late", AddsLine, 2, "samples")]
    assert outcomes(answered(tmp_path, rules, [stack(LateStack, 1, ["s.late"])])) == [("s.late", "samples.late-stack", "lines"), ("d.driver", "", "lines")]


def test_the_stack_walks_overlays_and_stack_states_newest_first(tmp_path):
    rules = [rule("o.old", AddsLine, 1, "samples.OldWait"), rule("o.new", AddsLine, 2, "samples.NewRun"), rule("s.late", AddsLine, 3, "samples"),
             rule("s.early", AddsLine, 4, "samples")]
    states = [stack(LateStack, 1, ["s.late"]), stack(EarlyStack, 2, ["s.early"])]
    assert [name for name, _, _ in outcomes(answered(tmp_path, rules, states, [NewRun]))] == ["s.late", "o.new", "s.early"]


def test_an_exclusive_stack_state_silences_the_in_place_rules_beneath_it(tmp_path):
    rules = [rule("d.driver", AddsLine, 1, DRIVER), rule("s.exclusive", AddsLine, 2, "samples")]
    assert outcomes(answered(tmp_path, rules, [stack(ExclusiveStack, 1, ["s.exclusive"])])) == [
        ("s.exclusive", "samples.exclusive-stack", "lines"), ("d.driver", "", "silenced")]


def test_a_substate_is_asked_directly_above_its_parent_whatever_its_time(tmp_path):
    rules = [rule("s.late", AddsLine, 1, "samples"), rule("s.sub", AddsLine, 2, "samples"), rule("o.old", AddsLine, 3, "samples.OldWait")]
    states = [stack(LateStack, 1, ["s.late"]), stack(SubStack, 2, ["s.sub"], parent="samples.late-stack")]
    assert [name for name, _, _ in outcomes(answered(tmp_path, rules, states, [OldWait]))] == ["s.sub", "s.late", "o.old"]
