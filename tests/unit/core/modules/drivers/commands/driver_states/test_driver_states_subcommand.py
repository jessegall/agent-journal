from types import SimpleNamespace

from engine.dotted_path.dotted_path import DottedPath
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.open_row import OpenRow
from engine.registry.agent_state_entry import AgentStateEntry
from engine.time.timestamp import Timestamp
from core.modules.drivers.commands.support.agent_state_listing import AgentStateListing

NOW = Timestamp.parsed("2026-11-14T08:00:00+00:00")
SINCE = Timestamp.parsed("2026-11-14T07:30:00+00:00")


class SampleState(AgentState):
    name = "samples.open"


def entry(name: str, tier: StateTier) -> AgentStateEntry:
    return AgentStateEntry(name, DottedPath.class_path(SampleState), "samples", 1, int(tier), ("*",))


class Board:
    def __init__(self, open_names: dict[str, list[OpenRow]]) -> None:
        self.open_names = open_names

    def open_rows(self, state_entry):
        return self.open_names.get(state_entry.name, [])


def listing(entries: dict[int, list[AgentStateEntry]], open_names: dict[str, list[OpenRow]]) -> AgentStateListing:
    registry = SimpleNamespace(tier_states=lambda driver, tier: entries.get(tier, []))
    boards = SimpleNamespace(for_hook=lambda hook: Board(open_names))
    actor = SimpleNamespace(agent_id=5, environment_id=1, role="main", driver="coding.main", suite="coding", access="writing")
    return AgentStateListing(registry, boards, SimpleNamespace(loaded=lambda agent: actor))


AGENT = SimpleNamespace(id=5, number=5, program="claude", session="s-1")


def test_a_tier_with_an_open_state_names_it_with_its_rows_and_since_when_and_an_empty_tier_says_none():
    open_block = entry("messages.unread-countdown", StateTier.STACK)
    states = listing({int(StateTier.STACK): [open_block], int(StateTier.IN_PLACE): [entry("skills.load-required", StateTier.IN_PLACE)]},
                     {"messages.unread-countdown": [OpenRow("agent_block", 812, SINCE)]}).states(AGENT, NOW)
    assert (states.stack, states.in_place, states.critical, states.deferred) == (f"messages.unread-countdown (agent_block:812 since {SINCE.text})", "(none)", "(none)", "(none)")


def test_the_defaults_tier_says_none_until_a_later_phase_registers_it_and_the_agent_is_named_with_its_driver():
    states = listing({}, {}).states(AGENT, NOW)
    assert (states.agent, states.driver, states.role, states.defaults) == ("agent 5", "coding.main", "main", "(none)")


def test_open_states_lists_each_open_state_with_its_tier_rows_and_since_in_the_order_of_the_tiers():
    entries = {int(StateTier.STACK): [entry("messages.unread-countdown", StateTier.STACK)], int(StateTier.IN_PLACE): [entry("skills.load-required", StateTier.IN_PLACE)]}
    open_states = listing(entries, {"skills.load-required": [OpenRow("agent_skill", 3, SINCE)], "messages.unread-countdown": [OpenRow("agent_block", 812, SINCE)]}).open_states(AGENT, NOW)
    assert [(state.tier, state.name, state.rows, state.since) for state in open_states] == [("stack", "messages.unread-countdown", ("agent_block:812",), SINCE.text), ("in place", "skills.load-required", ("agent_skill:3",), SINCE.text)]
