from controllers.types import ACTIVE, CONTROLLERS, WAITING
from resources.base import SYSTEM
from resources.types import PHASE, PRIORITY, Plan, TYPES


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


def handed(record, type_: str) -> list:
    return [r for r in standing(record, type_) if r.data.get(Plan.status, ACTIVE) in (ACTIVE, WAITING)]


def describe(r) -> str:
    if isinstance(r, Plan):
        i = r.current
        phase = r.phases[i - 1][PHASE.title] if 0 < i <= len(r.phases) else ""
        return f"{r.title} is {r.status} — phase {i}, {phase}"
    return f"{r.title}  ({r.abstract})" if r.abstract else r.title


def start_block(record) -> str:
    from features.skills.catalogue import handed as skills_handed
    parts = [f"THE JOURNAL IS IN FORCE HERE — this session is bound to environment `{record.env}`.", skills_handed(record)]
    for type_ in reversed(PRIORITY):
        kind = TYPES[type_]
        rows = handed(record, type_) if kind.handed else []
        if not rows:
            continue
        parts.append(f"{len(rows)} {kind.handed}." if kind.counted else f"{kind.handed} ({len(rows)}):\n{lines(rows, describe)}")
    return "\n\n".join(p for p in parts if p) + "\n"


def carry(record) -> str:
    out = [start_block(record)]
    for type_ in PRIORITY:
        for r in standing(record, type_) if TYPES[type_].handed else []:
            out.append(f"{TYPES[type_].title_.upper()} {r.n}  {r.title}\n{r.brief}".rstrip())
    return "\n\n".join(out) + "\n"
