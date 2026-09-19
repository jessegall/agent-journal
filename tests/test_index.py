import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.base import INDEX  # noqa: E402
from controllers.types import Messages, Todos  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh()
todos = Todos(record, actor=USER)
for title in ("one", "two", "three"):
    todos.create(title)
index = todos.path(1).parent / INDEX

# A LIST writes one index file of the rows' summaries
rows = todos.summaries()
check("the index holds each row's summary", [(r["n"], r["title"]) for r in rows], [(1, "one"), (2, "two"), (3, "three")])
check("it is kept as one file beside the rows", sorted(json.loads(index.read_text())), ["1", "2", "3"])

# EVERY CHANGE shows, whichever way the file was written
todos.update(2, title="two, renamed")
todos.complete(3, how="done")
(todos.path(1)).write_text(todos.path(1).read_text().replace('"title": "one"', '"title": "one, by hand"'))
check("a save, a completion and a hand edit are all seen", [(r["title"], bool(r["completed"])) for r in todos.summaries()],
      [("one, by hand", False), ("two, renamed", False), ("three", True)])
todos.path(2).unlink()
check("a row whose file is gone leaves the index", [r["n"] for r in todos.summaries()], [1, 3])

# A BROKEN INDEX is rebuilt from the rows
index.write_text("not json")
check("a corrupt index is rebuilt", [r["n"] for r in todos.summaries()], [1, 3])

# UNREAD AND LINKED read the index and load only what matches
messages = Messages(record, actor=USER)
first = messages.create("first")
messages.create("second", about="todo:1")
Messages(record, actor=AGENT).read(first.n)
check("unread loads only the rows the agent has not seen", [r.title for r in Messages(record, actor=AGENT).unread()], ["second"])
check("linked_to finds the rows that reference it", [r.title for r in messages.linked_to("todo:1")], ["second"])
messages.delete(2)
check("a deleted row is neither unread nor linked", ([r.title for r in Messages(record, actor=AGENT).unread()], messages.linked_to("todo:1")), ([], []))

done()
