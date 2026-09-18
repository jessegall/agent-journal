import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.record import Record  # noqa: E402
from resources.shapes import Field  # noqa: E402
from resources.types import AgentRow, Plan, Todo, Tool  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

check("a field read on the class is its own name — the one definition of the key", (Todo.priority, AgentRow.status, Plan.phases), ("priority", "status", "phases"))
t = Todo(n=1, data={"priority": 150})
check("a field read on a row is the value in its data", t.priority, 150)
check("an undeclared value reads as the field's default", (t.assigned, Plan().current), (None, 1))
p = Plan()
p.phases.append({"title": "one"})
check("a mutable default is made once and kept in the data, so appending to it sticks", p.data, {"phases": [{"title": "one"}]})
p.status = "active"
check("setting a field writes its data", p.data["status"], "active")
check("a field with a spec is one of the type's typed fields; one without is not", (Tool.fields, "status" in Plan.fields), ({"entry": "text", "usage": "text"}, False))
check("Field is the one declaration", isinstance(vars(Todo)["assigned"], Field), True)

record = fresh()
check("a setting read on the class is its key", (Record.keep, Record.triggers), ("keep", "triggers"))
check("an unset setting reads as its default", (record.keep, record.cleanup_read_at), ({}, 0))
record.keep = {"report": 7}
check("setting it writes settings.json and reads back", (record.keep, record.setting("keep")), ({"report": 7}, {"report": 7}))

done()
