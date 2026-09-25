from controllers.types import CONTROLLERS
from resources.base import SYSTEM, WHOM
from resources.types import TYPES, priority


def standing(record, type_: str) -> list:
    return CONTROLLERS[type_](record, actor=SYSTEM)._standing()


def counts(record) -> dict[str, int]:
    return {t: len(standing(record, t)) for t in priority() if TYPES[t].in_sidebar}


def open_work(record) -> list:
    return standing(record, "work")


def lines(rows: list, how=lambda r: r.title) -> str:
    return "\n".join(f"  {r.n:>3}  {how(r)}" for r in rows)


def status(record) -> str:
    out = [f"JOURNAL  environment {record.env}", ""]
    for type_, n in counts(record).items():
        out.append(f"  {TYPES[type_].details.title.lower():<14}{n:>4}")
    return "\n".join(out)


def handed(record, type_: str) -> list:
    return [r for r in standing(record, type_) if r.data.get("status", "active") in ("active", "waiting") and not r.data.get(WHOM)]


def describe(r) -> str:
    if r.type == "plan":
        i = r.current
        phase = r.phases[i - 1]["title"] if 0 < i <= len(r.phases) else ""
        return f"{r.title} is {r.status} — phase {i}, {phase}"
    return f"{r.title}  ({r.abstract})" if r.abstract else r.title


QUIET = ("HANDLE THE JOURNAL QUIETLY. In the chat, talk only about the user's work. Never mention the journal's notifications, "
         "nudges, hooks, skills or replies, and never announce that you are reading, replying, loading or logging something: just do it. "
         "A line that starts with [journal] is the journal speaking, not the user: act on it, and never answer it in the chat.")


def start_block(record) -> str:
    from features.journal_laws.policy import carry as law
    from features.skill_loading.catalogue import handed as skills_handed
    parts = [f"THE JOURNAL IS IN FORCE HERE — this session is bound to environment `{record.env}`.", QUIET, law(record), skills_handed(record)]
    for type_ in reversed(priority()):
        kind = TYPES[type_]
        rows = handed(record, type_) if kind.start_heading else []
        if not rows:
            continue
        parts.append(f"{len(rows)} {kind.start_heading}." if kind.start_as_count else f"{kind.start_heading} ({len(rows)}):\n{lines(rows, describe)}")
    return "\n\n".join(p for p in parts if p) + "\n"


def carry(record) -> str:
    out = [start_block(record)]
    for type_ in priority():
        for r in standing(record, type_) if TYPES[type_].start_heading else []:
            out.append(f"{TYPES[type_].details.title.upper()} {r.n}  {r.title}\n{r.brief}".rstrip())
    return "\n\n".join(out) + "\n"
