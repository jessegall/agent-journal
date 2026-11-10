from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from core.modules.agents.commands.end_agent.end_agent import EndAgent
from suites.coding.modules.workers.listeners.removed_worktree_agent_listener import RemovedWorktreeAgentListener
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState

WORKER_ID, HELPER_ID = 7, 9
ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)


class RecordingBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def dispatch(self, command, context) -> None:
        self.commands.append(command)


def commands_after(state: WorktreeState, ended_at: datetime | None = None, helper_ids: tuple[int, ...] = ()) -> list[object]:
    bus = RecordingBus()
    rows = SimpleNamespace(required=lambda model, row_id: SimpleNamespace(id=row_id, ended_at=ended_at, retired_at=None))
    agents = SimpleNamespace(running=lambda role, parent_id: [SimpleNamespace(id=helper_id) for helper_id in helper_ids])
    RemovedWorktreeAgentListener(rows, bus, agents).handle(SimpleNamespace(row=SimpleNamespace(state=state, session_agent_id=WORKER_ID)), SimpleNamespace())
    return bus.commands


def test_a_removed_worktree_ends_the_session_of_its_worker_and_retires_nobody():
    assert commands_after(WorktreeState.REMOVED) == [EndAgent(WORKER_ID)]


def test_the_helpers_of_the_worker_are_stopped_before_its_session_ends():
    assert commands_after(WorktreeState.REMOVED, helper_ids=(HELPER_ID,)) == [EndAgent(HELPER_ID), EndAgent(WORKER_ID)]


def test_a_worker_whose_session_already_ended_is_left_as_it_is():
    assert commands_after(WorktreeState.REMOVED, ended_at=ENDED_AT) == []


@pytest.mark.parametrize("state", [state for state in WorktreeState if state is not WorktreeState.REMOVED])
def test_a_worktree_that_is_not_removed_ends_nothing(state):
    assert commands_after(state, helper_ids=(HELPER_ID,)) == []
