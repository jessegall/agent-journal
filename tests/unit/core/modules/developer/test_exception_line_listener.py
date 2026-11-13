from types import SimpleNamespace

from core.modules.developer.listeners.exception_line_listener import MOST_TOLD_MESSAGES, ExceptionLineListener


class StubSettings:
    def flag(self, key: str) -> bool:
        return True


class StubAgents:
    def main_agent(self) -> SimpleNamespace:
        return SimpleNamespace(id=1, environment_id=1)


class StubBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command: object, actor: object, **arguments: object) -> None:
        self.commands.append(command)


def raised(listener: ExceptionLineListener, message: str) -> None:
    listener.handle(SimpleNamespace(row=SimpleNamespace(id=1, source="listener", message=message)), SimpleNamespace(id=1))


def test_the_messages_told_are_bounded_and_the_oldest_is_told_again():
    bus = StubBus()
    listener = ExceptionLineListener(StubSettings(), StubAgents(), bus)
    for number in range(MOST_TOLD_MESSAGES + 1):
        raised(listener, f"failure {number}")
    assert len(listener.told_messages) == MOST_TOLD_MESSAGES
    raised(listener, f"failure {MOST_TOLD_MESSAGES}")
    raised(listener, "failure 0")
    assert len(bus.commands) == MOST_TOLD_MESSAGES + 2
