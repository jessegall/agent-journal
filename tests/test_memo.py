from controllers.types import Todos
from engine.record import Record
from tests.conftest import fresh


def test_a_memoized_record_forgets_on_its_own_write_and_hands_out_copies():
    plain = fresh()
    Todos(plain).create("first")
    record = Record(plain.root, plain.env, memo=True)
    todos = Todos(record)
    row = todos.all()[0]
    row.title, row.refs = "changed", ["todo:9"]
    assert (todos.all()[0].title, todos.all()[0].refs) == ("first", []), \
        "a remembered row handed out is a copy: an unsaved change stays with its holder"
    Todos(plain).create("second")
    assert [t.title for t in todos.all()] == ["first"], "a write through another record is not seen until this record writes"
    todos.update(1, title="renamed")
    assert [t.title for t in todos.all()] == ["renamed", "second"], "this record's own write forgets what it remembered"
    assert [t.title for t in Todos(plain).all()] == ["renamed", "second"], "a record without memo always reads fresh"
