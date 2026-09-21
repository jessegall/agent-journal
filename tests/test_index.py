import json

from controllers.base import INDEX
from controllers.types import Messages, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_the_index_tracks_every_change_and_rebuilds_itself_when_corrupt():
    record = fresh()
    todos = Todos(record, actor=USER)
    for title in ("one", "two", "three"):
        todos.create(title)
    index = todos.path(1).parent / INDEX

    rows = todos.summaries()
    assert [(r["n"], r["title"]) for r in rows] == [(1, "one"), (2, "two"), (3, "three")], \
        "the index holds each row's summary"
    assert sorted(json.loads(index.read_text())) == ["1", "2", "3"], "it is kept as one file beside the rows"

    todos.update(2, title="two, renamed")
    todos.complete(3, how="done")
    (todos.path(1)).write_text(todos.path(1).read_text().replace('"title": "one"', '"title": "one, by hand"'))
    assert [(r["title"], bool(r["completed"])) for r in todos.summaries()] == \
        [("one, by hand", False), ("two, renamed", False), ("three", True)], "a save, a completion and a hand edit are all seen"
    todos.path(2).unlink()
    assert [r["n"] for r in todos.summaries()] == [1, 3], "a row whose file is gone leaves the index"

    index.write_text("not json")
    assert [r["n"] for r in todos.summaries()] == [1, 3], "a corrupt index is rebuilt"

    messages = Messages(record, actor=USER)
    first = messages.create("first")
    messages.create("second", about="todo:1")
    Messages(record, actor=AGENT).read(first.n)
    assert [r.title for r in Messages(record, actor=AGENT).unread()] == ["second"], \
        "unread loads only the rows the agent has not seen"
    assert [r.title for r in messages.linked_to("todo:1")] == ["second"], "linked_to finds the rows that reference it"
    messages.delete(2)
    assert ([r.title for r in Messages(record, actor=AGENT).unread()], messages.linked_to("todo:1")) == ([], []), \
        "a deleted row is neither unread nor linked"
