from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.driver.states.hook_triggered_state import HookTriggeredState
from engine.time.timestamp import Timestamp

OPENED = Timestamp.parsed("2026-11-14T07:00:00+00:00")


class PlanStartState(HookTriggeredState):
    commands = ["plan start"]


def hook_running(*commands: str) -> SimpleNamespace:
    """A hook whose shell line runs these journal commands; it answers only what the state asks of it."""

    def running(*labelled: str) -> tuple[str, ...]:
        return tuple(command for command in commands if any(command.startswith(name) for name in labelled))

    return SimpleNamespace(agent_id=7, timestamp=OPENED, event=SimpleNamespace(tool=SimpleNamespace(shell=SimpleNamespace(parts_running_journal_command=running))))


def test_the_state_opens_when_the_shell_line_runs_a_command_it_names_and_reads_nothing():
    assert PlanStartState().open_rows(hook_running("plan start 1")) == [OpenRow("hook", 0, OPENED)]


def test_the_state_stays_closed_for_another_command_and_for_a_hook_with_no_shell_line():
    assert PlanStartState().open_rows(hook_running("plan show 1")) == []
    assert PlanStartState().open_rows(SimpleNamespace(agent_id=7, timestamp=OPENED, event=SimpleNamespace(tool=None))) == []
