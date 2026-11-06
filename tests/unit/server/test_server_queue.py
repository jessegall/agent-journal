import threading
import time

import pytest

from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority
from server.hook.server_queue import ServerQueue

WAIT_SECONDS = 5.0


def hook_thread(queue: ServerQueue, priority: QueuePriority, name: str, order: list[str]) -> threading.Thread:
    def run() -> None:
        with queue.hook_turn(priority, WAIT_SECONDS):
            order.append(name)
    thread = threading.Thread(target=run)
    thread.start()
    return thread


def wait_for_waiting_hooks(queue: ServerQueue, count: int) -> None:
    deadline = time.monotonic() + WAIT_SECONDS
    while len(queue.waiting_hooks) < count and time.monotonic() < deadline:
        time.sleep(0.005)
    assert len(queue.waiting_hooks) == count


def test_the_main_agents_hook_goes_before_a_workers_that_came_first():
    queue, order = ServerQueue(), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        worker = hook_thread(queue, QueuePriority.AGENT_HOOK, "worker", order)
        wait_for_waiting_hooks(queue, 1)
        main = hook_thread(queue, QueuePriority.MAIN_AGENT_HOOK, "main", order)
        wait_for_waiting_hooks(queue, 2)
    worker.join(), main.join()
    assert order == ["main", "worker"]


def test_hooks_of_one_priority_run_in_the_order_they_came():
    queue, order = ServerQueue(), []
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        first = hook_thread(queue, QueuePriority.AGENT_HOOK, "first", order)
        wait_for_waiting_hooks(queue, 1)
        second = hook_thread(queue, QueuePriority.AGENT_HOOK, "second", order)
        wait_for_waiting_hooks(queue, 2)
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

    def viewer_request() -> None:
        queue.wait_for_hooks()
        order.append("viewer")
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        thread = threading.Thread(target=viewer_request)
        thread.start()
        time.sleep(0.02)
        order.append("hook")
    thread.join()
    assert order == ["hook", "viewer"]


def test_a_viewer_request_goes_on_after_its_wait_limit():
    queue = ServerQueue(viewer_wait_limit_seconds=0.01)
    with queue.hook_turn(QueuePriority.AGENT_HOOK, WAIT_SECONDS):
        queue.wait_for_hooks()
        assert queue.running_hooks == 1


def test_a_viewer_request_does_not_wait_when_no_hook_runs():
    queue = ServerQueue(viewer_wait_limit_seconds=WAIT_SECONDS)
    started_at = time.monotonic()
    queue.wait_for_hooks()
    assert time.monotonic() - started_at < 1
