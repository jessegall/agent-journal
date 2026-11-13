import pytest

from engine.container.container import Container
from engine.database.database import Database
from engine.module.module_finder import ModuleFinder
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.tasks.models.task import Task
from engine.query.queries import Queries
from server.tick.ticker import Ticker
from server.work.journal_round import JournalRound
from server.work.kept_round_container import KeptRoundContainer
from server.work.listeners.ordinary_listener_work import OrdinaryListenerWork
from server.work.round_work import RoundWork
from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import StartedPlanTask, UserJoined
from tests.stories.server.support.server_client import server_story
from engine.testing.stories.counted_connections import CountedConnections
from engine.testing.stories.database_file_copy import replace_with_copy

TICK_COUNT = 10
JOIN_SECONDS = 30.0
LATER_SECONDS = 1_000_000.0
SESSION = "s-1"


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


def test_ten_ticks_open_no_connection(new_story):
    story = new_story(fixture=UserJoined)
    clock = TickClock()
    ticker = Ticker(story.home, Ticker.module_handlers(ModuleFinder(story.home)), lambda: None, clock)
    ticker.start()
    ticks(ticker, clock, 1)
    with CountedConnections(story.home) as connections:
        ticks(ticker, clock, TICK_COUNT)
    ticker.stop(JOIN_SECONDS)
    story.expected(connections.count == 0, f"ten ticks opened {connections.count} connections")


def test_a_tick_handler_sees_a_task_changed_between_two_ticks(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "First title" --environment main')
    clock, title_reader = TickClock(), TaskTitleReader()
    ticker = Ticker(story.home, [TickHandler(TickInterval(seconds=1), title_reader, "task title")], lambda: None, clock)
    ticker.start(1)
    ticks(ticker, clock, 1)
    story.expect_success('task edit 1 --title "Second title"')
    ticks(ticker, clock, 1)
    ticker.stop(JOIN_SECONDS)
    story.expected(title_reader.titles == ["First title", "Second title"], f"the handler read {title_reader.titles}")


def test_a_listener_round_starts_with_nothing_prepared(new_story):
    story = new_story(fixture=UserJoined)
    work = RecordedRound()
    journal_round = JournalRound(story.home, "listener thread", work, KeptRoundContainer(story.home))
    journal_round.run()
    work.containers[0].get(Scopes).causing_agents[1] = story.agent.id
    journal_round.run()
    journal_round.close()
    story.expected(work.containers[0] is work.containers[1] and work.causing_agent_counts == [0, 0], f"rounds began with {work.causing_agent_counts} causing agents")


def test_a_module_sync_rebuilds_each_kept_container_once(new_story):
    story = new_story(fixture=UserJoined)
    works = [RecordedRound(), RecordedRound()]
    rounds = [JournalRound(story.home, f"listener thread {number}", work, KeptRoundContainer(story.home)) for number, work in enumerate(works)]
    for journal_round in rounds:
        journal_round.run()
    code, report = story.synced_with(DEPOT)
    for _ in range(2):
        for journal_round in rounds:
            journal_round.run()
    for journal_round in rounds:
        journal_round.close()
    rebuilt = [(work.containers[0] is not work.containers[1], work.containers[1] is work.containers[2]) for work in works]
    uses_new_registry = all(any("Depot" in entry for entry in work.containers[2].get(Registry).entries_text().split(",")) for work in works)
    story.expected(code == 0 and rebuilt == [(True, True), (True, True)] and uses_new_registry, f"sync {code}: {report}; rebuilt {rebuilt}")


def test_a_broken_connection_is_rebuilt_with_a_logged_reason(new_story):
    story = new_story(fixture=UserJoined)
    work = RecordedRound()
    journal_round = JournalRound(story.home, "listener thread", work, KeptRoundContainer(story.home))
    journal_round.run()
    work.containers[0].get(Database).close()
    with pytest.raises(Exception) as raised:
        journal_round.run()
    journal_round.report(raised.value)
    journal_round.run()
    journal_round.close()
    log = story.home.system_log.read_text()
    story.expected(work.containers[-1] is not work.containers[0] and "kept container rebuilt: listener thread" in log, f"containers {len(work.containers)}")


def test_a_replaced_database_is_picked_up(new_story):
    story = new_story(fixture=UserJoined)
    work = RecordedRound()
    journal_round = JournalRound(story.home, "listener thread", work, KeptRoundContainer(story.home))
    journal_round.run()
    replace_with_copy(story.home)
    journal_round.run()
    journal_round.close()
    story.expected(work.containers[1] is not work.containers[0] and "kept container rebuilt: database file replaced" in story.home.system_log.read_text(), "the round kept its container")


def test_a_server_stop_closes_every_kept_connection(new_story):
    story = new_story(fixture=StartedPlanTask)
    with CountedConnections(story.home) as connections:
        with server_story(story) as running:
            running.run_as(lines.TASK_CLOSE, SESSION)
            running.expect_eventually(lines.SECOND_TASK_DETAILS, "state: started")
    story.expected(connections.count > 0 and connections.open_count() == 0, f"{connections.open_count()} of {connections.count} connections stayed open")
