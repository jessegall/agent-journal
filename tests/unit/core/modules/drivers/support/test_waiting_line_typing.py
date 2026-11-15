from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping
from core.modules.drivers.support.wake_delivery import WakeDelivery
from core.modules.drivers.support.wake_waiters import WakeWaiters
from engine.enums.line_delivery import LineDelivery
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp

NOW = Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))


def line(delivery: LineDelivery = LineDelivery.WAKE_HOOK):
    return SimpleNamespace(id=7, session_agent_id=3, wakes_agent=True, source="sample.wake", text="wake up", delivery=delivery, repeats_without_hook=False,
                           state=AgentLineState.WAITING, nudge=SimpleNamespace(text="wake up"))


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
    def __init__(self, between_turns: bool = True) -> None:
        self.between_turns = between_turns

    def has_ended_turn(self, agent_id: int) -> bool:
        return self.between_turns

    def is_compacting(self, agent_id: int, checked_at) -> bool:
        return False

    def newest_agent_hook(self, agent_id: int):
        return None


class FixedClock:
    def timestamp(self) -> Timestamp:
        return NOW


def typing_of(tmp_path, entered: bool = False, between_turns: bool = True):
    home, bus, typing, turn = JournalHome(tmp_path), RecordedBus(), RecordedTyping(), AgentTurn(between_turns)
    wakes = WakeDelivery(bus, turn, home, FixedClock())  # type: ignore[arg-type]
    return WaitingLineTyping(EnteredLines(entered), typing, bus, turn, None, wakes), WakeWaiters.shared(home), typing, bus  # type: ignore[arg-type]


def test_a_wake_line_goes_to_the_live_waiter_and_is_not_typed(tmp_path):
    lines, waiters, typing, bus = typing_of(tmp_path)
    waiter = waiters.register(3, "t-1")
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [] and waiter.line_id == 7 and [type(command) for command in bus.commands] == [ClaimAgentLine]


def test_a_wake_line_with_no_waiter_is_typed_as_before(tmp_path):
    lines, _, typing, bus = typing_of(tmp_path)
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [7] and bus.commands == []


def test_a_terminal_typing_line_is_never_given_to_a_waiter(tmp_path):
    lines, waiters, typing, _ = typing_of(tmp_path)
    waiter = waiters.register(3, "t-1")
    lines.type(line(LineDelivery.TERMINAL_TYPING), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [7] and waiter.is_live


def test_a_wake_line_waits_while_the_agent_is_in_a_turn(tmp_path):
    lines, waiters, typing, bus = typing_of(tmp_path, between_turns=False)
    waiter = waiters.register(3, "t-1")
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [] and bus.commands == [] and waiter.is_live


def test_a_repeat_of_an_entered_wake_line_is_entered_without_a_second_wake(tmp_path):
    lines, waiters, typing, bus = typing_of(tmp_path, entered=True)
    waiter = waiters.register(3, "t-1")
    lines.type(line(), 1, NOW)  # type: ignore[arg-type]
    assert typing.typed == [] and waiter.is_live and [type(command) for command in bus.commands] == [EnterAgentLine]
