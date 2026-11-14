from engine.container.container import Container
from engine.container.round_state import RoundState
from engine.container.round_states import RoundStates


class EventBuffer(RoundState):
    def __init__(self) -> None:
        self.events: list[str] = []
        self.reset_count = 0

    def reset(self) -> None:
        self.events.clear()
        self.reset_count += 1


class Settings:
    pass


def test_services_lists_only_round_state_instances():
    container = Container()
    seen, settings = container.get(EventBuffer), container.get(Settings)
    assert list(container.get(RoundStates).services()) == [seen] and settings not in container.get(RoundStates).services()


def test_services_builds_nothing_new():
    container = Container()
    before = set(container.instances)
    container.get(RoundStates).services()
    assert set(container.instances) - before == {RoundStates}


def test_reset_is_called_on_each_listed_service_once():
    container = Container()
    seen = container.get(EventBuffer)
    container.bind(RoundState, seen)
    seen.events.append("task.start")
    container.get(RoundStates).reset()
    assert (seen.events, seen.reset_count) == ([], 1)
