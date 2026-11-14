from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.dotted_path.dotted_path import DottedPath
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.driver.states.countdown_state import CountdownState
from engine.registry.agent_state_entry import AgentStateEntry
from core.modules.drivers.support.agent_state_listing import AgentStateListing


class GatingState(AgentState):
    name = "samples.gating"
    role_group = RoleGroup.PROMPT


class CountingState(CountdownState):
    name = "samples.counting"


def entry(state: type[AgentState], tier: StateTier, position: int, rules: tuple[str, ...] = (), parent: str = "") -> AgentStateEntry:
    return AgentStateEntry(state.name, DottedPath.class_path(state), "samples", position, int(tier), ("coding.main",), parent, rules)


def listing(entries: list[AgentStateEntry]) -> AgentStateListing:
    registry = SimpleNamespace(agent_states=tuple(entries), rules=[SimpleNamespace(name="samples.rule", hook="pre_tool_use")])
    return AgentStateListing(registry, SimpleNamespace(), SimpleNamespace())


def test_each_state_type_names_its_module_shape_tier_drivers_role_gated_rules_with_their_hooks():
    rows = listing([entry(GatingState, StateTier.IN_PLACE, 1, ("samples.rule",)), entry(CountingState, StateTier.STACK, 2)]).types()
    assert [(row.name, row.owner, row.shape, row.tier, row.drivers, row.rules) for row in rows] == [
        ("samples.gating", "samples", "AgentState", "in place", "coding.main", "samples.rule on pre_tool_use"),
        ("samples.counting", "samples", "CountdownState", "stack", "coding.main", "(none)")]
    assert rows[0].roles == "prompt"


def test_deferred_rules_and_substates_say_none_until_a_state_has_them_and_a_substate_is_listed_under_its_parent():
    rows = listing([entry(GatingState, StateTier.STACK, 1), entry(CountingState, StateTier.STACK, 2, parent="samples.gating")]).types()
    assert (rows[0].deferred, rows[0].substates, rows[1].substates) == ("(none)", "samples.counting", "(none)")
