from core.modules.drivers.agent_messages.project_hook_wake_message import ProjectHookWakeMessage
from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.drivers.bindings.agent_wake_route import AgentWakeRoute
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.record_agent_agent_message.record_agent_message import RecordAgentMessage
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.wake_delivery import WakeDelivery
from engine.actor.actor import Actor
from engine.enums.line_delivery import LineDelivery
from engine.driver.wake_ask import WakeAsk
from engine.driver.wake_reply import GIVEN_STATUS, GONE_STATUS, NOTHING_STATUS
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp

WAKING = SimpleNamespace(id=7, session_agent_id=3, wakes_agent=True, delivery=LineDelivery.WAKE_HOOK, state=AgentLineState.WAITING, agent_message=SimpleNamespace(text="new message 12: read it"))


def agent(role: str = "main", launched: bool = False, session: str = "s-1", program: str = "claude"):
    return SimpleNamespace(id=3, program=program, session=session, is_main=role == "main", is_launched_helper=role != "main" and launched, ended_at=None,
                           environment_id=1)


class SessionAgents:
    def __init__(self, row) -> None:
        self.row = row

    def open_session(self, session: str):
        return self.row if self.row is not None and self.row.session == session else None

    def open_launch(self, launch: str):
        return None


class WakePrograms:
    def provider(self, program: str):
        return SimpleNamespace(wake_hook=object() if program == "claude" else None)


class Lockdowns:
    def __init__(self, active: bool = False) -> None:
        self.active = active

    def lockdown(self, program: str):
        return SimpleNamespace(is_active=self.active)


class WaitingLines:
    def __init__(self, lines) -> None:
        self.lines = lines

    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def every_row(self, reason: str):
        return list(self.lines)


class RecordedBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command, actor, **fields):
        self.commands.append(command)


class BetweenTurns:
    def has_ended_turn(self, agent_id: int) -> bool:
        return True

    def is_compacting(self, agent_id: int, checked_at) -> bool:
        return False


class FixedClock:
    def timestamp(self) -> Timestamp:
        return Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))


class DriverActors:
    def actor(self, key: str) -> Actor:
        return Actor(1, ActorType.USER)


def route(tmp_path, row=None, lines=(), locked: bool = False) -> tuple[AgentWakeRoute, RecordedBus]:
    home, bus = JournalHome(tmp_path), RecordedBus()
    delivery = WakeDelivery(bus, BetweenTurns(), home, FixedClock())  # type: ignore[arg-type]
    wake = AgentWakeRoute(SessionAgents(row if row is not None else agent()), WakePrograms(), Lockdowns(locked), delivery, WaitingLines(lines), home,  # type: ignore[arg-type]
                          DriverActors(), bus, Clock())  # type: ignore[arg-type]
    return wake, bus


def asked(wake: AgentWakeRoute, session: str = "s-1", token: str = "t-1", seconds: float = 0.05):
    first = wake.answer(WakeAsk("claude", session, "", token))
    return wake.waited(first, seconds) if first.is_waiting else first


def test_a_helper_gets_gone(tmp_path):
    wake, _ = route(tmp_path, agent(role="helper"))
    assert asked(wake).status == GONE_STATUS


def test_a_launched_helper_may_wait(tmp_path):
    wake, _ = route(tmp_path, agent(role="helper", launched=True))
    assert asked(wake).status == NOTHING_STATUS


def test_a_program_with_no_wake_hook_gets_gone(tmp_path):
    wake, _ = route(tmp_path, agent(program="codex"))
    assert asked(wake).status == GONE_STATUS


def test_a_replaced_session_gets_gone(tmp_path):
    wake, _ = route(tmp_path, agent(session="s-2"))
    assert asked(wake, session="s-1").status == GONE_STATUS


def test_a_locked_down_program_gets_gone(tmp_path):
    wake, _ = route(tmp_path, locked=True)
    assert asked(wake).status == GONE_STATUS


def test_a_main_agent_with_a_waiting_line_gets_it_at_once(tmp_path):
    wake, bus = route(tmp_path, lines=[WAKING])
    answer = asked(wake, seconds=5)
    assert (answer.status, answer.line, answer.line_id, answer.token) == (GIVEN_STATUS, "[journal] new message 12: read it", 7, "t-1")
    assert [type(command) for command in bus.commands] == [ClaimAgentLine]


def test_a_main_agent_with_no_line_gets_nothing_after_the_wait(tmp_path):
    wake, _ = route(tmp_path)
    assert asked(wake).status == NOTHING_STATUS
    assert wake.live_waiters() == 1


def test_a_new_ask_cancels_the_older_waiter(tmp_path):
    wake, _ = route(tmp_path)
    older = wake.answer(WakeAsk("claude", "s-1", "", "older"))
    wake.answer(WakeAsk("claude", "s-1", "", "newer"))
    assert wake.waited(older, 0.05).status == GONE_STATUS
    assert wake.live_waiters() == 1


def test_confirm_enters_the_line(tmp_path):
    wake, bus = route(tmp_path, lines=[WAKING])
    answer = asked(wake, seconds=5)
    assert not wake.received(answer.line_id, "another token")
    assert wake.received(answer.line_id, answer.token)
    assert [type(command) for command in bus.commands] == [ClaimAgentLine, EnterAgentLine]


def test_a_project_hook_line_becomes_a_wake_line_for_the_agent(tmp_path):
    wake, bus = route(tmp_path)
    assert wake.line(WakeAsk("claude", "s-1", "", ""), "watch", "the build broke")
    [command] = bus.commands
    assert isinstance(command, RecordAgentMessage) and command.agent_id == 3 and command.agent_message.text == ProjectHookWakeMessage.declared().agent_message(hook="watch", text="the build broke").text
    assert command.agent_message.declaration.delivery is LineDelivery.WAKE_HOOK


def test_a_project_hook_line_for_a_helper_is_refused(tmp_path):
    wake, bus = route(tmp_path, agent(role="helper"))
    assert not wake.line(WakeAsk("claude", "s-1", "", ""), "watch", "the build broke") and bus.commands == []
