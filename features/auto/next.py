from controllers.types import CONTROLLERS
from features.plans.query import held
from resources.base import SYSTEM
from resources.shapes import LEVELS


def open_rows(record) -> list:
    return [t for t in CONTROLLERS["todo"](record, actor=SYSTEM).all() if not t.completed]


def asked(record, todo) -> bool:
    return any(not q.completed and todo.ref in q.refs for q in CONTROLLERS["question"](record, actor=SYSTEM).all())


def waiting_on(record, todo, rows: list) -> bool:
    open_refs = {t.ref for t in rows}
    return any(ref in open_refs for ref in todo.refs if ref.startswith("todo:"))


def ready(record) -> list:
    rows = open_rows(record)
    fit = [t for t in rows if not t.data.get("blocked") and not waiting_on(record, t, rows) and not asked(record, t) and not held(record, t)]
    return sorted(fit, key=lambda t: (-int(t.data.get("priority") or LEVELS["default"]), t.n))


def next(record):
    rows = ready(record)
    return rows[0] if rows else None
