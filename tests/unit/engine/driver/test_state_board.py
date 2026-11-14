from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.dotted_path.dotted_path import DottedPath
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.driver.open_row import OpenRow
from engine.driver.state_board import FAILED_OPENER_TABLE, StateBoard
from engine.driver.state_record import StateRecord
from engine.driver.states.agent_row_state import AgentRowState
from engine.registry.agent_state_entry import AgentStateEntry
from engine.time.timestamp import Timestamp

EARLY = Timestamp.parsed("2026-11-14T06:00:00+00:00")
LATE = Timestamp.parsed("2026-11-14T07:00:00+00:00")
OPENS = []


class CountedState(AgentState):
    name = "samples.counted"

    def open_rows(self, hook):
        OPENS.append(type(self).__qualname__)
        return [OpenRow("samples", 1, EARLY)]


class SameOpenerState(CountedState):
    name = "samples.same-opener"

    def opener_key(self) -> str:
        return "CountedState"


class LateState(AgentState):
    name = "samples.late"

    def open_rows(self, hook):
        return [OpenRow("samples", 2, LATE)]


class ClosedState(AgentState):
    name = "samples.closed"

    def open_rows(self, hook):
        return []


class RaisingState(AgentState):
    name = "samples.raising"

    def open_rows(self, hook):
        raise RuntimeError("opener broke")


class FlaggedState(LateState):
    name = "samples.flagged"
    delays_lines = True


class MainOnlyState(CountedState):
    name = "samples.main-only"
    role_group = RoleGroup.PROMPT


def entry(state: type[AgentState], position: int = 1, drivers: tuple[str, ...] = ("*",)) -> AgentStateEntry:
    return AgentStateEntry(state.name, DottedPath.class_path(state), "samples", position, int(StateTier.STACK), drivers)


class Log:
    def __init__(self) -> None:
        self.lines = []

    def write(self, level, text):
        self.lines.append(text)


class Container:
    def get(self, state_class):
        return state_class()


class Ticks:
    def __init__(self, *values: float) -> None:
        self.values = list(values)

    def __call__(self) -> float:
        return self.values.pop(0)


def board(entries=(), role="main", elapsed=None, errors=None, log=None, hook_name="pre_tool_use", rules_by_state=None) -> StateBoard:
    registry = SimpleNamespace(agent_state=lambda name: None, suite=lambda name: None, helper_type_book=lambda: HelperTypeBook(),
                               tier_states=lambda driver, tier: [state for state in entries if state.covers(driver)],
                               state_rules=lambda name, hook: (rules_by_state or {}).get(name, {}).get(hook, []) if rules_by_state is not None else ["heard"])
    hook = SimpleNamespace(driver="builder", role=role, suite="", hook_name=hook_name, environment_id=5, timestamp=LATE, agent_id=7)
    errors = errors or SimpleNamespace(reported=lambda argv, error, environment_id=None: None)
    return StateBoard(registry, Container(), errors, log or Log(), hook, elapsed or Ticks(*([0.0] * 20)))


def test_an_opener_runs_only_when_asked():
    OPENS.clear()
    made = board([entry(CountedState)])
    assert OPENS == []
    assert made.is_open(entry(CountedState))
    assert OPENS == ["CountedState"]


def test_two_states_with_one_opener_run_it_once():
    OPENS.clear()
    made = board()
    made.is_open(entry(CountedState))
    made.is_open(entry(SameOpenerState))
    assert OPENS == ["CountedState"]


def test_a_raising_opener_leaves_the_state_open_and_reports_once():
    reported = []
    made = board(errors=SimpleNamespace(reported=lambda argv, error, environment_id=None: reported.append(argv)))
    assert made.open_rows(entry(RaisingState))[0].table == FAILED_OPENER_TABLE
    made.open_rows(entry(RaisingState))
    assert reported == [["agent state", "samples.raising"]]


def test_a_state_of_another_driver_never_runs():
    OPENS.clear()
    assert not board().is_open(entry(CountedState, drivers=("reviewer",)))
    assert OPENS == []


def test_a_state_for_prompt_roles_is_closed_for_a_worker():
    assert not board(role="worker").is_open(entry(MainOnlyState))


def test_a_slow_opener_is_logged_at_the_threshold():
    log = Log()
    board(elapsed=Ticks(0.0, 0.1), log=log).is_open(entry(CountedState))
    assert log.lines == ["state samples.counted took 100 ms on a pre_tool_use hook"]


def test_the_stack_is_newest_first():
    entries = [entry(CountedState, 1), entry(LateState, 2)]
    assert [layer.overlay.name for layer in board(entries).stack("builder")] == ["samples.late", "samples.counted"]


def test_the_board_records_each_state_it_worked_out_with_its_tier_outcome_and_opener_time():
    open_entry, closed_entry = entry(LateState), entry(ClosedState)
    checked = board(elapsed=Ticks(0.0, 0.004, 0.010, 0.010))
    checked.is_open(open_entry)
    checked.is_open(closed_entry)
    assert checked.state_records() == (StateRecord("samples.late", "stack", "open", 4), StateRecord("samples.closed", "stack", "closed", 0))


def test_a_failed_opener_is_recorded_as_failed():
    checked = board(errors=SimpleNamespace(reported=lambda *arguments: None))
    checked.is_open(entry(RaisingState))
    assert checked.state_records()[0].outcome == FAILED_OPENER_TABLE


def test_a_flag_free_stack_state_runs_only_on_a_hook_its_rules_hear():
    OPENS.clear()
    stop_only = {"samples.counted": {"stop": ["samples.stop-rule"]}}
    assert board([entry(CountedState)], rules_by_state=stop_only).stack("builder") == []
    assert OPENS == []
    assert [layer.overlay.name for layer in board([entry(CountedState)], hook_name="stop", rules_by_state=stop_only).stack("builder")] == ["samples.counted"]


def test_a_flagged_stack_state_runs_on_every_hook_and_the_order_of_the_layers_run_stays():
    entries = [entry(CountedState, 1), entry(FlaggedState, 2), entry(LateState, 3)]
    received = {"samples.counted": {"pre_tool_use": ["samples.tool-rule"]}, "samples.late": {"stop": ["samples.stop-rule"]}}
    assert [layer.overlay.name for layer in board(entries, rules_by_state=received).stack("builder")] == ["samples.flagged", "samples.counted"]


class LateParent(LateState):
    name = "samples.parent"


class ClosedParent(AgentState):
    name = "samples.closed-parent"

    def open_rows(self, hook):
        return []


class MiddleState(AgentState):
    name = "samples.middle"

    def open_rows(self, hook):
        return [OpenRow("samples", 3, Timestamp.parsed("2026-11-14T06:30:00+00:00"))]


class OldSubstate(AgentState):
    name = "samples.substate"

    def open_rows(self, hook):
        OPENS.append("OldSubstate")
        return [OpenRow("samples", 4, EARLY)]


def substate(state: type[AgentState], parent: str, position: int) -> AgentStateEntry:
    return AgentStateEntry(state.name, DottedPath.class_path(state), "samples", position, int(StateTier.STACK), ("*",), parent)


def test_a_substate_layer_sits_directly_above_its_parent_whatever_their_times():
    parent, child, middle = entry(LateParent, 1), substate(OldSubstate, "samples.parent", 2), entry(MiddleState, 3)
    made = board([parent, child, middle])
    made.registry.agent_state = {state.name: state for state in (parent, child, middle)}.get
    assert [layer.overlay.name for layer in made.stack("builder")] == ["samples.substate", "samples.parent", "samples.middle"]


def test_a_closed_parent_never_runs_its_substates_opener():
    OPENS.clear()
    parent, child = entry(ClosedParent, 1), substate(OldSubstate, "samples.closed-parent", 2)
    made = board([parent, child])
    made.registry.agent_state = {parent.name: parent, child.name: child}.get
    assert not made.is_open(child)
    assert made.stack("builder") == []
    assert "OldSubstate" not in OPENS


class WorkerDefault(AgentRowState):
    name = "samples.worker-default"


def test_a_default_state_is_open_on_the_agents_row_while_the_agent_carries_it_and_closed_once_removed():
    carried = board([entry(WorkerDefault)])
    carried.hook.anchor, carried.hook.defaults = OpenRow("agent", 7, EARLY), ("samples.worker-default",)
    assert carried.open_rows(entry(WorkerDefault)) == (OpenRow("agent", 7, EARLY),)
    removed = board([entry(WorkerDefault)])
    removed.hook.anchor, removed.hook.defaults = OpenRow("agent", 7, EARLY), ()
    assert not removed.is_open(entry(WorkerDefault))
