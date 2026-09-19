import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Todos  # noqa: E402
from engine.record import Record  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

plain = fresh()
Todos(plain).create("first")
record = Record(plain.root, plain.env, memo=True)
todos = Todos(record)
row = todos.all()[0]
row.title, row.refs = "changed", ["todo:9"]
check("a remembered row handed out is a copy: an unsaved change stays with its holder", (todos.all()[0].title, todos.all()[0].refs), ("first", []))
Todos(plain).create("second")
check("a write through another record is not seen until this record writes", [t.title for t in todos.all()], ["first"])
todos.update(1, title="renamed")
check("this record's own write forgets what it remembered", [t.title for t in todos.all()], ["renamed", "second"])
check("a record without memo always reads fresh", [t.title for t in Todos(plain).all()], ["renamed", "second"])

done()
