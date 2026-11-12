from core.modules.library.support.sync_outcome import SyncOutcome
from core.modules.library.ticks.library_sync_tick import LibrarySyncTick


class StubSync:
    def __init__(self, *outcomes: SyncOutcome) -> None:
        self.outcomes, self.rounds = list(outcomes), 0

    def round(self, memory: object) -> SyncOutcome:
        self.rounds += 1
        return self.outcomes.pop(0)


class StubContainer:
    def __init__(self, sync: StubSync) -> None:
        self.sync = sync

    def get(self, wanted: type) -> StubSync:
        return self.sync


class StubSeconds:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


FAILED = SyncOutcome.failed("down", False)
REACHED = SyncOutcome.reached(1, 0, False)


def test_a_round_that_reached_the_server_is_followed_by_a_round_on_the_next_tick():
    sync, seconds = StubSync(REACHED, REACHED), StubSeconds()
    tick = LibrarySyncTick(seconds)
    tick(StubContainer(sync))
    tick(StubContainer(sync))
    assert sync.rounds == 2


def test_each_failed_round_doubles_the_wait_up_to_five_minutes_and_a_reached_round_ends_it():
    sync, seconds = StubSync(*[FAILED] * 7, REACHED), StubSeconds()
    tick, container, waits = LibrarySyncTick(seconds), StubContainer(sync), []
    for _ in range(7):
        tick(container)
        waits.append(tick.next_at - seconds.now)
        seconds.now = tick.next_at
    assert waits == [20, 40, 80, 160, 300, 300, 300]
    tick(container)
    assert (tick.failure_count, tick.next_at) == (0, seconds.now)


def test_a_tick_inside_the_wait_runs_no_round():
    sync, seconds = StubSync(FAILED, REACHED), StubSeconds()
    tick, container = LibrarySyncTick(seconds), StubContainer(sync)
    tick(container)
    seconds.now = 19
    assert tick(container) is False
    assert sync.rounds == 1


def test_a_tick_tells_the_ticker_when_a_round_wrote_rows():
    sync = StubSync(SyncOutcome.reached(1, 1, True))
    assert LibrarySyncTick(StubSeconds())(StubContainer(sync)) is True
