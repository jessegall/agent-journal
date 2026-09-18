from controllers.types import CONTROLLERS
from resources.base import SYSTEM
from resources.types import PRIORITY, TYPES


def standing(record, type_: str) -> list:
    return [r for r in CONTROLLERS[type_](record, actor=SYSTEM).all() if not r.completed]


def counts(record) -> dict[str, int]:
    return {t: len(standing(record, t)) for t in PRIORITY if TYPES[t].nav}


def open_work(record) -> list:
    return standing(record, "work")


def lines(rows: list, how=lambda r: r.title) -> str:
    return "\n".join(f"  {r.n:>3}  {how(r)}" for r in rows)


def status(record) -> str:
    out = [f"JOURNAL  environment {record.env}", ""]
    for type_, n in counts(record).items():
        out.append(f"  {TYPES[type_].title_.lower():<14}{n:>4}")
    return "\n".join(out)


def start_block(record) -> str:
    parts = [f"THE JOURNAL IS IN FORCE HERE — this session is bound to environment `{record.env}`."]
    for type_, heading in (("rule", "RULES, in force on every environment"), ("pin", f"PINS on `{record.env}`"), ("reminder", "REMINDERS, said again at every stop")):
        rows = standing(record, type_)
        if rows:
            parts.append(f"{heading}:\n{lines(rows)}")
    work = open_work(record)
    if work:
        parts.append(f"STILL OPEN, from this or an earlier session:\n{lines(work)}")
    plans = [p for p in standing(record, "plan") if p.data.get("status") in ("active", "waiting")]
    for p in plans:
        i = p.data["current"]
        phase = p.data["phases"][i - 1]["title"] if 0 < i <= len(p.data["phases"]) else ""
        parts.append(f"PLAN {p.n} {p.title} is {p.data['status']}: phase {i}, {phase}")
    docs = standing(record, "doc")
    if docs:
        parts.append(f"DOCS, {len(docs)} catalogued — read one before you re-investigate what it settles:\n{lines(docs, lambda d: f'{d.title}  ({d.abstract})' if d.abstract else d.title)}")
    todos = standing(record, "todo")
    if todos:
        parts.append(f"{len(todos)} to-do(s) waiting: delayed work, not an instruction to start any of it.")
    return "\n\n".join(parts) + "\n"


def carry(record) -> str:
    out = [start_block(record)]
    for type_ in ("rule", "pin", "reminder", "work", "todo"):
        for r in standing(record, type_):
            out.append(f"{TYPES[type_].title_.upper()} {r.n}  {r.title}\n{r.brief}".rstrip())
    return "\n\n".join(out) + "\n"
