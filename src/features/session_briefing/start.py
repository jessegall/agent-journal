from controllers.types import CONTROLLERS, Works
from resources.base import SYSTEM, WHOM
from resources.types import TYPES, priority
from engine.extension import Extension

WAITING = (None, "active", "waiting")


def standing(record, type_: str) -> list:
    return CONTROLLERS[type_](record, actor=SYSTEM).rows.standing()


def counts(record) -> dict[str, int]:
    return {t: len(standing(record, t)) for t in priority() if TYPES[t].in_sidebar}


def open_work(record) -> list:
    return Works(record, actor=SYSTEM).rows.standing()


def lines(rows: list, how=lambda r: r.title) -> str:
    return "\n".join(f"  {r.n:>3}  {how(r)}" for r in rows)


def status(record) -> str:
    out = [f"JOURNAL  environment {record.env}", ""]
    for type_, n in counts(record).items():
        out.append(f"  {TYPES[type_].details.title.lower():<14}{n:>4}")
    return "\n".join(out)


def waiting(type_: str, status: str | None, whom: str | None) -> bool:
    return (type_ == "doc" or status in WAITING) and not whom


def counted(record, type_: str) -> int:
    return sum(1 for row in CONTROLLERS[type_](record, actor=SYSTEM).rows.standing_summaries() if not row["hidden"] and waiting(type_, row.get("status"), row.get(WHOM)))


def handed(record, type_: str) -> list:
    return [r for r in standing(record, type_) if waiting(type_, r.data.get("status"), r.data.get(WHOM))]


QUIET = ("HANDLE THE JOURNAL QUIETLY. In the chat, talk only about the user's work. Never mention the journal's notifications, "
         "nudges, hooks, skills or replies, and never announce that you are reading, replying, loading or logging something: just do it. "
         "A line that starts with [journal] is the journal speaking, not the user: act on it, and never answer it in the chat.")


START_PARTS = Extension()
ADDRESS, ORCHESTRATION, LAW, SKILLS, MODE = 1, 2, 3, 4, 5


def start_block(record) -> str:
    parts = [f"THE JOURNAL IS IN FORCE HERE — this session is bound to environment `{record.env}`.", QUIET,
             *(part(record) for _, part in sorted(START_PARTS.keyed(record).items()))]
    parts += [handed_part(record, TYPES[type_]) for type_ in reversed(priority()) if TYPES[type_].start_heading]
    return "\n\n".join(p for p in parts if p) + "\n"


def handed_part(record, kind) -> str:
    if kind.start_as_count:
        count = counted(record, kind.type)
        return f"{count} {kind.start_heading}." if count else ""
    rows = handed(record, kind.type)
    return f"{kind.start_heading} ({len(rows)}):\n{lines(rows, lambda r: r.start_line())}" if rows else ""


def carry(record) -> str:
    out = [start_block(record)]
    for type_ in priority():
        for r in standing(record, type_) if TYPES[type_].start_heading else []:
            out.append(f"{TYPES[type_].details.title.upper()} {r.n}  {r.title}\n{r.brief}".rstrip())
    return "\n\n".join(out) + "\n"
