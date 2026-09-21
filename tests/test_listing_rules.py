import features
from controllers.base import LAST
from controllers.types import Todos
from resources.base import SYSTEM
from tests.conftest import fresh


def stocked(record, n: int, done: int = 0):
    c = Todos(record, actor=SYSTEM)
    rows = [c.create(f"row {i}") for i in range(n)]
    for r in rows[:done]:
        c.complete(r.n, how="done")
    return c


def test_a_listing_stops_at_twenty_five():
    features.load()
    c = stocked(fresh(), 40)
    assert len(c.all()) == LAST == 25
    assert len(c.all(last=40)) == 40
    assert len(c.all(last=0)) == 40


def test_a_listing_never_carries_completed_rows():
    features.load()
    c = stocked(fresh(), 10, done=4)
    assert [r.n for r in c.all()] == [r.n for r in c._every() if not r.completed]
    assert len(c.all(completed=True)) == 10


def test_the_raw_read_is_not_a_command():
    features.load()
    assert not hasattr(Todos, "every")
    assert Todos._every.__name__ == "_every"
