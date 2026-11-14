from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.dotted_path.dotted_path import DottedPath
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.open_row import OpenRow
from engine.driver.state_board import FAILED_OPENER_TABLE, StateBoard
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


class RaisingState(AgentState):
    name = "samples.raising"

    def open_rows(self, hook):
        raise RuntimeError("opener broke")


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


def board(entries=(), role="main", elapsed=None, errors=None, log=None) -> StateBoard:
    registry = SimpleNamespace(agent_state=lambda name: None, suite=lambda name: None, helper_type_book=lambda: None,
                               tier_states=lambda driver, tier: [state for state in entries if state.covers(driver)])
    hook = SimpleNamespace(driver="builder", role=role, suite="", hook_name="pre_tool_use", environment_id=5, timestamp=LATE, agent_id=7)
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
