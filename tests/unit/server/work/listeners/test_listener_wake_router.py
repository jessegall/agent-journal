from engine.event.written_events import WrittenEvents
from server.work.listeners.listener_wake_router import ListenerWakeRouter


class SampleThread:
    """A listener thread that counts its wakes."""

    def __init__(self) -> None:
        self.wakes = 0

    def wake(self) -> None:
        self.wakes += 1


class SampleSet:
    """The event names a thread's listeners hear."""

    def __init__(self, *heard: str) -> None:
        self.heard = set(heard)

    def matches(self, name: str) -> bool:
        return name in self.heard


def routed(written_names: list[str], *pairs) -> None:
    written = WrittenEvents()
    for name in written_names:
        written.add(name)
    ListenerWakeRouter(written, [(thread, lambda listener_set=listener_set: listener_set) for thread, listener_set in pairs]).wake()  # type: ignore[misc]


def test_a_written_name_wakes_only_the_threads_whose_set_matches():
    hearing, deaf = SampleThread(), SampleThread()
    routed(["core.tasks.task.created"], (hearing, SampleSet("core.tasks.task.created")), (deaf, SampleSet("core.plans.plan.created")))
    assert (hearing.wakes, deaf.wakes) == (1, 0)


def test_no_written_names_wakes_nothing():
    thread = SampleThread()
    routed([], (thread, SampleSet("core.tasks.task.created")))
    assert thread.wakes == 0


def test_two_names_wake_each_matching_thread_once():
    thread = SampleThread()
    routed(["core.tasks.task.created", "core.tasks.task.updated"], (thread, SampleSet("core.tasks.task.created", "core.tasks.task.updated")))
    assert thread.wakes == 1


def test_a_thread_without_a_set_yet_is_woken():
    thread = SampleThread()
    routed(["core.tasks.task.created"], (thread, None))
    assert thread.wakes == 1
