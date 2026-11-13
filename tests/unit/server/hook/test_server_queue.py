import threading

import pytest

from server.errors.hook_database_busy_error import HookDatabaseBusyError
from engine.enums.window_priority import WindowPriority
from server.enums.queue_priority import QueuePriority
from server.hook.server_queue import ServerQueue
from server.hook.queue_request import QueueRequest
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import CurrentExecution

WAIT_SECONDS = 5.0


def hook_thread(queue: ServerQueue, priority: QueuePriority, name: str, order: list[str]) -> threading.Thread:
    def run() -> None:
        with queue.hook_turn(priority, WAIT_SECONDS):
            order.append(name)
    thread = threading.Thread(target=run)
    thread.start()
    return thread


def poll_waiting_hooks(queue: ServerQueue, count: int) -> None:
    with queue.changed:
        assert queue.changed.wait_for(lambda: len(queue.waiting_hooks) == count, WAIT_SECONDS)


def test_the_main_agents_hook_goes_before_a_workers_that_came_first():
    queue, order = ServerQueue(), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        worker = hook_thread(queue, QueuePriority.AGENT_HOOK, "worker", order)
        poll_waiting_hooks(queue, 1)
        main = hook_thread(queue, QueuePriority.MAIN_AGENT_HOOK, "main", order)
        poll_waiting_hooks(queue, 2)
    worker.join(), main.join()
    assert order == ["main", "worker"]


def test_hooks_of_one_priority_run_in_the_order_they_came():
    queue, order = ServerQueue(), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        first = hook_thread(queue, QueuePriority.AGENT_HOOK, "first", order)
        poll_waiting_hooks(queue, 1)
        second = hook_thread(queue, QueuePriority.AGENT_HOOK, "second", order)
        poll_waiting_hooks(queue, 2)
    first.join(), second.join()
    assert order == ["first", "second"]


def test_a_hook_that_waits_past_its_limit_is_told_and_leaves_the_queue():
    queue = ServerQueue()
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        with pytest.raises(HookDatabaseBusyError, match="another hook held the journal"):
            with queue.hook_turn(QueuePriority.MAIN_AGENT_HOOK, 0.01):
                pass
    assert queue.waiting_hooks == []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, 0.01):
        assert queue.running_hooks == 1
    assert queue.running_hooks == 0


def test_a_failing_hook_gives_up_its_turn():
    queue = ServerQueue()
    with pytest.raises(ValueError):
        with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
            raise ValueError
    assert queue.running_hooks == 0


def test_a_viewer_request_waits_for_a_running_hook():
    queue, order = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS), []
    entered = threading.Event()

    def viewer_request() -> None:
        entered.set()
        queue.let_hooks_finish()
        order.append("viewer")
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        thread = threading.Thread(target=viewer_request)
        thread.start()
        assert entered.wait(WAIT_SECONDS)
        order.append("hook")
    thread.join()
    assert order == ["hook", "viewer"]


def test_a_viewer_request_goes_on_after_its_wait_limit():
    queue = ServerQueue(viewer_wait_limit_seconds=0.01)
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        queue.let_hooks_finish()
        assert queue.running_hooks == 1


def test_a_viewer_request_does_not_wait_when_no_hook_runs():
    queue = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS)
    queue.let_hooks_finish()
    assert queue.running_hooks == 0


def start_hook_thread(queue: ServerQueue, owner: str, entered: threading.Event, release: threading.Event) -> threading.Thread:
    def run() -> None:
        with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS, owner):
            entered.set()
            release.wait(WAIT_SECONDS)
    thread = threading.Thread(target=run)
    thread.start()
    return thread


def test_hooks_of_two_agents_run_at_the_same_time():
    queue = ServerQueue(running_hooks_count=2)
    first_entry, second_entry, release = threading.Event(), threading.Event(), threading.Event()
    threads = [start_hook_thread(queue, "agent-1", first_entry, release), start_hook_thread(queue, "agent-2", second_entry, release)]
    assert first_entry.wait(WAIT_SECONDS) and second_entry.wait(WAIT_SECONDS)
    release.set()
    [thread.join() for thread in threads]


def test_two_hooks_of_one_agent_never_run_together():
    queue = ServerQueue(running_hooks_count=2)
    first_entry, second_entry, release = threading.Event(), threading.Event(), threading.Event()
    first = start_hook_thread(queue, "agent-1", first_entry, release)
    assert first_entry.wait(WAIT_SECONDS)
    second = start_hook_thread(queue, "agent-1", second_entry, threading.Event())
    poll_waiting_hooks(queue, 1)
    assert not second_entry.is_set()
    release.set()
    assert second_entry.wait(WAIT_SECONDS)
    first.join(), second.join()


def test_a_waiting_hook_of_a_busy_agent_does_not_hold_up_another_agent():
    queue = ServerQueue(running_hooks_count=2)
    first_entry, block_place, second_agent_entered, release = threading.Event(), threading.Event(), threading.Event(), threading.Event()
    first = start_hook_thread(queue, "agent-1", first_entry, release)
    assert first_entry.wait(WAIT_SECONDS)
    blocked = start_hook_thread(queue, "agent-1", block_place, threading.Event())
    poll_waiting_hooks(queue, 1)
    second_agent_thread = start_hook_thread(queue, "agent-2", second_agent_entered, threading.Event())
    assert second_agent_entered.wait(WAIT_SECONDS)
    release.set()
    first.join(), blocked.join(), second_agent_thread.join()


def test_no_more_hooks_run_than_the_count():
    queue = ServerQueue(running_hooks_count=1)
    first_entry, second_entry, release = threading.Event(), threading.Event(), threading.Event()
    first = start_hook_thread(queue, "agent-1", first_entry, release)
    assert first_entry.wait(WAIT_SECONDS)
    second = start_hook_thread(queue, "agent-2", second_entry, threading.Event())
    poll_waiting_hooks(queue, 1)
    assert not second_entry.is_set()
    release.set()
    first.join(), second.join()


def viewer_thread(queue: ServerQueue, window: str, priority: WindowPriority, order: list[str]) -> threading.Thread:
    def run() -> None:
        with queue.viewer_turn("task list", window, priority):
            order.append(window)
    thread = threading.Thread(target=run)
    thread.start()
    return thread


def poll_waiting_viewers(queue: ServerQueue, count: int) -> None:
    with queue.changed:
        assert queue.changed.wait_for(lambda: len(queue.waiting_viewers) == count, WAIT_SECONDS)


def test_a_first_window_does_not_wait_for_a_running_hook():
    queue, order = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        viewer_thread(queue, "messages.chat", WindowPriority.FIRST, order).join(WAIT_SECONDS)
        assert order == ["messages.chat"]


def test_a_normal_window_waits_behind_a_running_hook():
    queue, order = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        thread = viewer_thread(queue, "tasks.tasks", WindowPriority.NORMAL, order)
        poll_waiting_viewers(queue, 1)
        assert order == []
    thread.join(WAIT_SECONDS)
    assert order == ["tasks.tasks"]


def test_among_equal_windows_the_one_that_sent_fewer_goes_first():
    queue, order = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS), []
    viewer_thread(queue, "agents.agents", WindowPriority.NORMAL, []).join(WAIT_SECONDS)
    viewer_thread(queue, "agents.agents", WindowPriority.NORMAL, []).join(WAIT_SECONDS)
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        busy = viewer_thread(queue, "agents.agents", WindowPriority.NORMAL, order)
        poll_waiting_viewers(queue, 1)
        plan_thread = viewer_thread(queue, "plans.plans", WindowPriority.NORMAL, order)
        poll_waiting_viewers(queue, 2)
    busy.join(WAIT_SECONDS), plan_thread.join(WAIT_SECONDS)
    assert order == ["plans.plans", "agents.agents"]


def test_a_normal_window_goes_through_after_its_wait_limit():
    queue, order = ServerQueue(viewer_wait_limit_seconds=0.01), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        viewer_thread(queue, "tasks.tasks", WindowPriority.NORMAL, order).join(WAIT_SECONDS)
        assert order == ["tasks.tasks"]


def test_no_more_viewer_requests_run_than_the_limit_unless_their_wait_is_over():
    queue, order = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS, running_viewers_count=1), []
    with queue.viewer_turn("task list", "tasks.tasks", WindowPriority.NORMAL):
        thread = viewer_thread(queue, "plans.plans", WindowPriority.NORMAL, order)
        poll_waiting_viewers(queue, 1)
        assert order == []
    thread.join(WAIT_SECONDS)
    assert order == ["plans.plans"]


def test_a_waiting_viewer_request_names_its_priority():
    queue = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS)
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        thread = viewer_thread(queue, "tasks.tasks", WindowPriority.NORMAL, [])
        poll_waiting_viewers(queue, 1)
        assert [entry.priority for entry in queue.read().waiting] == ["normal"]
    thread.join(WAIT_SECONDS)


def test_a_hook_writes_with_its_agents_priority():
    with ServerQueue().hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        assert CurrentExecution.read().priority is ExecutionPriority.RESERVED


def test_a_command_writes_with_its_askers_priority():
    with ServerQueue().cli_turn(QueueRequest.started("CLI", "task list"), ExecutionPriority.IMMEDIATE):
        assert CurrentExecution.read().priority is ExecutionPriority.IMMEDIATE


def test_a_viewer_request_writes_with_its_windows_priority():
    with ServerQueue().viewer_turn("/viewer/tasks", priority=WindowPriority.FIRST):
        assert CurrentExecution.read().priority is WindowPriority.FIRST.execution_priority


def test_a_tick_round_outside_any_request_writes_as_background():
    assert CurrentExecution.read().priority is ExecutionPriority.BACKGROUND
