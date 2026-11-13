import threading

from server.enums.queue_priority import QueuePriority
from server.hook.queue_round_yield import QueueRoundYield
from server.hook.server_queue import ServerQueue

WAIT_SECONDS = 5.0


def test_a_round_with_no_hook_running_or_waiting_goes_on_at_once():
    QueueRoundYield(ServerQueue()).pause()


def test_a_round_waits_while_a_hook_runs_and_goes_on_when_it_ends():
    queue, pauses = ServerQueue(), []
    round_yield = QueueRoundYield(queue, WAIT_SECONDS)
    entered = threading.Event()

    def pause_round() -> None:
        entered.set()
        round_yield.pause()
        pauses.append(True)

    with queue.hook_turn(QueuePriority.MAIN_AGENT_HOOK, WAIT_SECONDS):
        thread = threading.Thread(target=pause_round)
        thread.start()
        assert entered.wait(WAIT_SECONDS)
        assert thread.is_alive()
    thread.join(WAIT_SECONDS)
    assert not thread.is_alive() and len(pauses) == 1


def test_a_round_gives_up_waiting_at_its_limit_so_busy_hooks_never_stop_it():
    queue = ServerQueue()
    with queue.hook_turn(QueuePriority.MAIN_AGENT_HOOK, WAIT_SECONDS):
        QueueRoundYield(queue, 0.2).pause()
