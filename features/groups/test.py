from controllers.types import CONTROLLERS, Docs, Messages, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_group_holds_rows_of_any_type_and_a_row_can_sit_in_several():
    record = fresh()
    groups = CONTROLLERS["group"](record, actor=AGENT)
    task, doc = Todos(record, actor=AGENT).create("a task"), Docs(record, actor=AGENT).create("a doc")
    note = Messages(record, actor=USER).create("a note")
    launch, later = groups.create("Launch"), groups.create("Later")
    groups.add(launch.n, [task.ref, doc.ref, note.ref])
    groups.add(later.n, [task.ref])
    assert groups.members(launch.n) == ["todo 1  a task", "doc 1  a doc", "message 1  a note"], "any type joins, in the order it was added"
    assert groups.members(later.n) == ["todo 1  a task"], "the same row sits in a second group"

    groups.remove(launch.n, doc.ref)
    Messages(record, actor=USER).delete(note.n, why="gone")
    assert groups.members(launch.n) == ["todo 1  a task"], "a removed row and a deleted one are left out"

    assert "already open" in refused(lambda: groups.create("launch")), "an open group's name is not taken twice"
    assert "type:number" in refused(lambda: groups.add(launch.n, ["nothing"])), "a ref that is not a row is refused"
    assert refused(lambda: groups.add(launch.n, ["todo:99"])) != "", "a row that does not exist is refused"
