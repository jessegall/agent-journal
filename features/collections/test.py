from controllers.types import CONTROLLERS, Docs, Messages, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_collection_holds_rows_of_any_type_and_a_row_can_sit_in_several():
    record = fresh()
    collections = CONTROLLERS["collection"](record, actor=AGENT)
    task, doc = Todos(record, actor=AGENT).create("a task"), Docs(record, actor=AGENT).create("a doc")
    note = Messages(record, actor=USER).create("a note")
    launch, later = collections.create("Launch"), collections.create("Later")
    collections.add(launch.n, [task.ref, doc.ref, note.ref])
    collections.add(later.n, [task.ref])
    assert collections.members(launch.n) == ["todo 1  a task", "doc 1  a doc", "message 1  a note"], "any type joins, in the order it was added"
    assert collections.members(later.n) == ["todo 1  a task"], "the same row sits in a second collection"

    collections.remove(launch.n, doc.ref)
    Messages(record, actor=USER).delete(note.n, why="gone")
    assert collections.members(launch.n) == ["todo 1  a task"], "a removed row and a deleted one are left out"

    assert "already open" in refused(lambda: collections.create("launch")), "an open collection's name is not taken twice"
    assert "type:number" in refused(lambda: collections.add(launch.n, ["nothing"])), "a ref that is not a row is refused"
    assert refused(lambda: collections.add(launch.n, ["todo:99"])) != "", "a row that does not exist is refused"
