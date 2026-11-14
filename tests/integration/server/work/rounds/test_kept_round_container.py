import pytest

from core.modules.developer.support.developer_settings import PREVENT_LAZY_LOADING_SETTING, TOOLS_SETTING
from engine.command.command import Command
from engine.command.handler import Handler
from engine.container.container import Container
from engine.errors.late_resolve_error import LateResolveError
from engine.database.database import Database
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.testing.stories.counted_connections import CountedConnections
from engine.testing.stories.database_file_copy import replace_with_copy
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.tasks.models.task import Task
from server.tick.ticker import Ticker
from server.work.listeners.ordinary_listener_work import OrdinaryListenerWork
from server.work.rounds.journal_round import JournalRound
from server.work.rounds.kept_round_container import KeptRoundContainer
from server.work.rounds.round_work import RoundWork

TICK_COUNT = 10
DEPOT_MODULE = "acme.depot"
DEPOT = "tests.stories.core.modules.assignments.support.assignable_samples:DepotModule"
JOIN_SECONDS = 30.0
LATER_SECONDS = 1_000_000.0
AGENT = 7


class LateCommand(Command[None]):
    """A command no module registers, whose handler only a late build would make."""


class LateHandler(Handler[LateCommand, None]):
    pass


class TickClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


class RecordedRound(RoundWork):
    """Keeps each round's container and the causing agents its scopes held when the round began."""

    def __init__(self) -> None:
        self.containers: list[Container] = []
        self.causing_agent_counts: list[int] = []

    def run(self, container: Container) -> None:
        self.containers.append(container)
        self.causing_agent_counts.append(len(container.get(Scopes).causing_agents))
        OrdinaryListenerWork().run(container)


class TaskTitleReader:
    def __init__(self) -> None:
        self.titles: list[str] = []

    def __call__(self, container: Container) -> None:
        self.titles.append(container.get(Queries).query(Task).find(1).title)


def ticks(ticker: Ticker, clock: TickClock, count: int) -> None:
    for _ in range(count):
        clock.now += LATER_SECONDS
        ticker.tick()
        ticker.join(JOIN_SECONDS)


def test_ten_ticks_open_no_connection(journal):
    clock = TickClock()
    ticker = Ticker(journal.home, Ticker.module_handlers(ModuleFinder(journal.home)), lambda: None, clock)
    ticker.start()
    ticks(ticker, clock, 1)
    with CountedConnections(journal.home) as connections:
        ticks(ticker, clock, TICK_COUNT)
    ticker.stop(JOIN_SECONDS)
    assert connections.count == 0


def test_a_tick_handler_sees_a_task_changed_between_two_ticks(journal):
    journal.run('task make "First title" --environment main')
    clock, title_reader = TickClock(), TaskTitleReader()
    ticker = Ticker(journal.home, [TickHandler(TickInterval(seconds=1), title_reader, "task title")], lambda: None, clock)
    ticker.start(1)
    ticks(ticker, clock, 1)
    journal.run('task edit 1 --title "Second title"')
    ticks(ticker, clock, 1)
    ticker.stop(JOIN_SECONDS)
    assert title_reader.titles == ["First title", "Second title"]


def test_a_listener_round_starts_with_nothing_prepared(journal):
    work = RecordedRound()
    journal_round = JournalRound(journal.home, "listener thread", work, KeptRoundContainer(journal.home))
    journal_round.run()
    work.containers[0].get(Scopes).causing_agents[1] = AGENT
    journal_round.run()
    journal_round.close()
    assert work.containers[0] is work.containers[1] and work.causing_agent_counts == [0, 0]


def test_a_module_sync_rebuilds_each_kept_container_once(journal):
    works = [RecordedRound(), RecordedRound()]
    rounds = [JournalRound(journal.home, f"listener thread {number}", work, KeptRoundContainer(journal.home)) for number, work in enumerate(works)]
    for journal_round in rounds:
        journal_round.run()
    synced = journal.synced_with(DEPOT)
    for _ in range(2):
        for journal_round in rounds:
            journal_round.run()
    for journal_round in rounds:
        journal_round.close()
    assert synced.code == 0, synced.text
    assert [(work.containers[0] is not work.containers[1], work.containers[1] is work.containers[2]) for work in works] == [(True, True), (True, True)]
    assert all(f'"module": "{DEPOT_MODULE}"' in work.containers[2].get(Registry).entries_text() for work in works)


def test_a_broken_connection_is_rebuilt_with_a_logged_reason(journal):
    work = RecordedRound()
    journal_round = JournalRound(journal.home, "listener thread", work, KeptRoundContainer(journal.home))
    journal_round.run()
    work.containers[0].get(Database).close()
    with pytest.raises(Exception) as raised:
        journal_round.run()
    journal_round.report(raised.value)
    journal_round.run()
    journal_round.close()
    assert work.containers[-1] is not work.containers[0]
    assert "kept container rebuilt: listener thread" in journal.home.system_log.read_text()


def test_a_replaced_database_is_picked_up(journal):
    work = RecordedRound()
    journal_round = JournalRound(journal.home, "listener thread", work, KeptRoundContainer(journal.home))
    journal_round.run()
    replace_with_copy(journal.home)
    journal_round.run()
    journal_round.close()
    assert work.containers[1] is not work.containers[0]
    assert "kept container rebuilt: database file replaced" in journal.home.system_log.read_text()


def test_with_lazy_loading_prevented_a_kept_container_builds_at_boot_and_refuses_a_late_build(journal):
    for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {PREVENT_LAZY_LOADING_SETTING} true --project"):
        assert journal.run(line).code == 0, line
    kept = KeptRoundContainer(journal.home)
    try:
        container = kept.round_container()
        assert container.is_sealed
        with pytest.raises(LateResolveError, match="LateHandler was built after boot"):
            container.get(LateHandler)
    finally:
        kept.close()


def test_without_the_setting_a_kept_container_builds_as_it_goes(journal):
    kept = KeptRoundContainer(journal.home)
    try:
        container = kept.round_container()
        assert not container.is_sealed and isinstance(container.get(LateHandler), LateHandler)
    finally:
        kept.close()
