from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.support.wake_delivery import WakeDelivery
from core.modules.drivers.support.wake_waiters import WakeWaiters
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp

ACTOR = Actor(1, ActorType.USER)
LINE = SimpleNamespace(id=7, session_agent_id=3, nudge=SimpleNamespace(text="new message 12: read it"))


class RecordedBus:
    """Keeps the commands run, and refuses a claim of a line someone already claimed."""

    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command, actor, **fields):
        if isinstance(command, ClaimAgentLine) and any(isinstance(ran, ClaimAgentLine) and ran.row_id == command.row_id for ran in self.commands):
            raise Refusal("the line is taken", "")
        self.commands.append(command)


class AgentTurn:
    """The hook calls of one agent: whether it sits between turns and whether it compacts."""

    def __init__(self, between_turns: bool = True, compacting: bool = False) -> None:
        self.between_turns, self.compacting = between_turns, compacting

    def has_ended_turn(self, agent_id: int) -> bool:
        return self.between_turns

    def is_compacting(self, agent_id: int, checked_at: Timestamp) -> bool:
        return self.compacting


class ManualClock:
    def __init__(self) -> None:
        self.now = datetime(2026, 11, 15, 9, tzinfo=timezone.utc)

    def timestamp(self) -> Timestamp:
        return Timestamp(self.now)


def delivery(turn: AgentTurn | None = None) -> tuple[WakeDelivery, WakeWaiters, RecordedBus, ManualClock]:
    waiters, bus, clock = WakeWaiters(), RecordedBus(), ManualClock()
    return WakeDelivery(bus, turn or AgentTurn(), waiters, clock), waiters, bus, clock  # type: ignore[arg-type]


def kinds(bus: RecordedBus) -> list[type]:
    return [type(command) for command in bus.commands]


def test_a_waiting_line_is_claimed_and_offered():
    wake, waiters, bus, _ = delivery()
    waiter = waiters.register(3, "token")
    assert wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert kinds(bus) == [ClaimAgentLine] and waiter.text == "[journal] new message 12: read it"


def test_a_confirmed_line_is_entered():
    wake, waiters, bus, _ = delivery()
    waiters.register(3, "token")
    wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert not wake.confirm(7, "another token", ACTOR)
    assert wake.confirm(7, "token", ACTOR)
    assert kinds(bus) == [ClaimAgentLine, EnterAgentLine]


def test_an_unconfirmed_line_is_released_after_20_seconds():
    wake, waiters, bus, clock = delivery()
    waiters.register(3, "token")
    wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    clock.now += timedelta(seconds=19)
    wake.release_unconfirmed(ACTOR)
    assert kinds(bus) == [ClaimAgentLine]
    clock.now += timedelta(seconds=2)
    wake.release_unconfirmed(ACTOR)
    assert kinds(bus) == [ClaimAgentLine, ReleaseAgentLine] and not wake.confirm(7, "token", ACTOR)


def test_a_claimed_line_is_not_given_twice():
    wake, waiters, bus, _ = delivery()
    waiters.register(3, "token")
    assert wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    waiters.register(3, "second token")
    assert not wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert kinds(bus) == [ClaimAgentLine]


def test_nothing_is_offered_while_the_agent_compacts():
    wake, waiters, bus, _ = delivery(AgentTurn(compacting=True))
    waiter = waiters.register(3, "token")
    assert not wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert bus.commands == [] and waiter.is_live


def test_nothing_is_offered_in_a_turn():
    wake, waiters, bus, _ = delivery(AgentTurn(between_turns=False))
    waiter = waiters.register(3, "token")
    assert not wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert bus.commands == [] and waiter.is_live


def test_a_line_no_waiter_takes_is_not_claimed():
    wake, _, bus, _ = delivery()
    assert not wake.deliver(LINE, ACTOR)  # type: ignore[arg-type]
    assert bus.commands == []
