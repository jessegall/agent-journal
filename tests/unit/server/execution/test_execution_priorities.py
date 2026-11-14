from datetime import datetime, timezone

from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.enums.window_priority import WindowPriority
from engine.execution.execution_starter import ExecutionStarter
from engine.time.timestamp import Timestamp
from server.execution.execution_priorities import ExecutionPriorities

ENTERED = Timestamp(datetime(2026, 11, 13, 12, tzinfo=timezone.utc))
SESSIONS = {"main-session": ExecutionStarter(StarterType.MAIN_AGENT), "worker-session": ExecutionStarter(StarterType.HELPER, agent_role="worker")}


class SampleStarters:
    """The server's record of who each session belongs to; an unknown session counts as the main agent."""

    def starter(self, session: str) -> ExecutionStarter:
        return SESSIONS.get(session, ExecutionStarter(StarterType.MAIN_AGENT)) if session else ExecutionStarter(StarterType.PERSON)


PRIORITIES = ExecutionPriorities(SampleStarters())  # type: ignore[arg-type]


def test_main_hook_is_immediate():
    assert PRIORITIES.hook_ticket("main-session", "PreToolUse", ENTERED).priority is ExecutionPriority.IMMEDIATE


def test_worker_hook_is_reserved():
    assert PRIORITIES.hook_ticket("worker-session", "PreToolUse", ENTERED).priority is ExecutionPriority.RESERVED


def test_first_hook_of_unknown_session_is_main():
    assert PRIORITIES.hook_ticket("new-session", "SessionStart", ENTERED).priority is ExecutionPriority.IMMEDIATE


def test_a_command_from_a_worker_waits_as_reserved():
    assert PRIORITIES.command_ticket("worker-session", "task list", ENTERED).priority is ExecutionPriority.RESERVED


def test_a_command_from_a_persons_shell_goes_first():
    assert PRIORITIES.command_ticket("", "task list", ENTERED).priority is ExecutionPriority.IMMEDIATE


def test_first_window_immediate_normal_window_normal():
    first, normal = PRIORITIES.viewer_ticket("/tasks", WindowPriority.FIRST, ENTERED), PRIORITIES.viewer_ticket("/tasks", WindowPriority.NORMAL, ENTERED)
    assert (first.priority, normal.priority) == (ExecutionPriority.IMMEDIATE, ExecutionPriority.NORMAL)
