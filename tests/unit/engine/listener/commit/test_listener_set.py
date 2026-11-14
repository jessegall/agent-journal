import pytest

from engine.container.container import Container
from engine.dotted_path.dotted_path import DottedPath
from engine.enums.listener_timing import ListenerTiming
from engine.event.event_pattern import EventPattern
from engine.listener.commit.listener_set import ListenerSet
from engine.listener.errors.listener_rebuilt_error import ListenerRebuiltError
from engine.registry.listener_entry import ListenerEntry
from engine.registry.registry import Registry

BUILT: list[str] = []


class TaskCounter:
    def __init__(self) -> None:
        BUILT.append("task counter")


class PatternCount:
    def __init__(self, text: str) -> None:
        self.text, self.calls = text, 0

    def matches(self, event: str) -> bool:
        self.calls += 1
        return event.startswith("task.")


def registry(fingerprint: str = "abc") -> Registry:
    return Registry(fingerprint, {}, {}, {}, (), ())


def entry(event: EventPattern = EventPattern("task.*")) -> ListenerEntry:
    return ListenerEntry("tasks.counter", event, list(ListenerTiming)[0], DottedPath.class_path(TaskCounter), 1)


def test_a_set_builds_its_instances_once():
    BUILT.clear()
    listeners = ListenerSet("listener thread", registry(), Container(), [entry()])
    listeners.matches("task.create")
    listeners.instance(entry())
    assert BUILT == ["task counter"]


def test_a_second_build_for_the_same_thread_and_fingerprint_raises_naming_both():
    ListenerSet("listener thread", registry(), Container(), [entry()])
    with pytest.raises(ListenerRebuiltError) as raised:
        ListenerSet("listener thread", registry(), Container(), [entry()])
    assert (raised.value.thread_name, raised.value.fingerprint) == ("listener thread", "abc") and "listener thread" in str(raised.value) and "abc" in str(raised.value)


def test_a_new_fingerprint_builds_a_new_set():
    ListenerSet("listener thread", registry("abc"), Container(), [entry()])
    assert ListenerSet("listener thread", registry("def"), Container(), [entry()]).key == ("listener thread", "def")


def test_a_third_build_for_a_fingerprint_raises():
    ListenerSet("listener thread", registry(), Container(), [entry()]).close()
    ListenerSet("listener thread", registry(), Container(), [entry()])
    with pytest.raises(ListenerRebuiltError):
        ListenerSet("listener thread", registry(), Container(), [entry()])


def test_a_closed_set_may_be_built_again():
    ListenerSet("listener thread", registry(), Container(), [entry()]).close()
    assert ListenerSet("listener thread", registry(), Container(), [entry()]).key == ("listener thread", "abc")


def test_matches_is_cached_per_event_name():
    pattern = PatternCount("task.*")
    listeners = ListenerSet("listener thread", registry(), Container(), [entry(pattern)])
    answers = [listeners.matches("task.create"), listeners.matches("task.create"), listeners.matches("plan.create")]
    assert answers == [True, True, False] and pattern.calls == 2


def test_instance_of_returns_the_built_instance():
    container = Container()
    listeners = ListenerSet("listener thread", registry(), container, [entry()])
    assert listeners.instance(entry()) is container.get(TaskCounter)
