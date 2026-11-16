from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping
from engine.time.timestamp import Timestamp

NOW = Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))


def line():
    return SimpleNamespace(id=7, session_agent_id=3, wakes_agent=True, source="sample.wake", text="wake up", repeats_without_hook=False,
                           state=AgentLineState.WAITING, agent_message=SimpleNamespace(text="wake up"))


class EnteredLines:
    """The agent's entered lines: whether one with the same text came after its newest hook."""

    def __init__(self, entered: bool) -> None:
        self.entered = entered

    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def matching(self, condition):
        return self

    def exists(self) -> bool:
        return self.entered


class RecordedTyping:
    def __init__(self) -> None:
        self.typed: list[int] = []

    def enter_line(self, row, actor) -> bool:
        self.typed.append(row.id)
        return True


class RecordedBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command, actor, **fields):
        self.commands.append(command)


class AgentTurn:
    def __init__(self, is_idle: bool = True) -> None:
        self.is_idle = is_idle

    def has_ended_turn(self, agent_id: int) -> bool:
        return self.is_idle

    def is_prompt_open(self, agent_id: int) -> bool:
        return self.is_idle

    def is_compacting(self, agent_id: int, checked_at) -> bool:
        return False

    def newest_agent_hook(self, agent_id: int):
        return None


class FixedClock:
    def timestamp(self) -> Timestamp:
        return NOW


def typing_of(entered: bool = False, is_idle: bool = True):
    bus, typing, turn = RecordedBus(), RecordedTyping(), AgentTurn(is_idle)
    return WaitingLineTyping(EnteredLines(entered), typing, bus, turn, None), typing, bus  # type: ignore[arg-type]


def test_a_line_for_a_stopped_agent_is_typed_into_its_terminal():
    lines, typing, bus = typing_of()
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [7] and bus.commands == []


def test_a_line_waits_while_the_agent_is_in_a_turn():
    lines, typing, bus = typing_of(is_idle=False)
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [] and bus.commands == []


def test_a_repeat_of_an_entered_line_is_entered_and_not_typed_again():
    lines, typing, bus = typing_of(entered=True)
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [] and [type(command) for command in bus.commands] == [EnterAgentLine]
