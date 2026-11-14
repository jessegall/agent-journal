from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from engine.time.timestamp import Timestamp

OPENED = Timestamp.parsed("2026-11-14T07:00:00+00:00")


class SampleState(AgentState):
    name = "samples.state"


class SampleOverlay(Overlay):
    name = "samples.overlay"

    def open_agent_rows(self, agent_id: int):
        return [OpenRow("samples", agent_id, OPENED)]


def test_a_state_takes_the_stack_tier_every_driver_and_any_role_by_default():
    assert (SampleState.tier, list(SampleState.drivers), SampleState.role_group) == (StateTier.STACK, ["*"], RoleGroup.ANY)
    assert (SampleState.rules, SampleState.deferred, SampleState.listeners, SampleState.substates) == ([], [], [], [])
    assert not any((SampleState.exclusive, SampleState.allows_wakes, SampleState.delays_lines, SampleState.delays_notices, SampleState.pauses_agent))


def test_the_opener_key_is_the_class_name():
    assert (SampleState().opener_key(), SampleOverlay().opener_key()) == ("SampleState", "SampleOverlay")


def test_an_overlay_reads_its_open_rows_by_the_hooks_agent():
    assert SampleOverlay().open_rows(SimpleNamespace(agent_id=7)) == [OpenRow("samples", 7, OPENED)]
