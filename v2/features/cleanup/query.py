import re
import time

from v2.commands.generate import actions
from v2.controllers.types import CONTROLLERS
from v2.resources.base import SYSTEM

CLAIMS = ("rule", "pin", "reminder")
PATH = re.compile(r"(?<![\w/])((?:[\w.-]+/)+[\w.-]+\.\w+|[\w-]+\.(?:py|js|vue|md|json|css|html|sh))\b")
VERB = re.compile(r"journal ([a-z][a-z-]*)(?: ([a-z][a-z-]*))?")
WAITING_DAYS = 7


def known_words() -> set[str]:
    words = set(CONTROLLERS)
    for c in CONTROLLERS.values():
        words |= set(actions(c)) | set(c.resource.names.values())
    return words


def missing_paths(project, text: str) -> list[str]:
    return sorted({p for p in PATH.findall(text) if not (project / p).exists()})


def unknown_verbs(text: str, words: set[str]) -> list[str]:
    return sorted({f"journal {a}" for a, b in VERB.findall(text) if a not in words})


def evidence(record) -> list[dict]:
    project = record.root.parent
    words = known_words()
    found = []
    for type_ in CLAIMS:
        for r in CONTROLLERS[type_](record, actor=SYSTEM).all():
            if r.completed:
                continue
            text = f"{r.title}\n{r.brief}"
            for what in missing_paths(project, text):
                found.append({"ref": r.ref, "title": r.title, "evidence": f"names {what}, which is gone", "retire": f"journal {type_} {r.n} {CONTROLLERS[type_].named(CONTROLLERS[type_], 'complete')} \"<why>\""})
            for what in unknown_verbs(text, words):
                found.append({"ref": r.ref, "title": r.title, "evidence": f"names {what}, which the CLI does not answer to", "retire": f"journal {type_} {r.n} {CONTROLLERS[type_].named(CONTROLLERS[type_], 'complete')} \"<why>\""})
    questions = CONTROLLERS["question"](record, actor=SYSTEM)
    for t in CONTROLLERS["todo"](record, actor=SYSTEM).all():
        if t.completed:
            continue
        waiting = [q for q in questions.all() if not q.completed and t.ref in q.refs]
        if waiting and time.time() - min(q.created for q in waiting) > WAITING_DAYS * 86400:
            found.append({"ref": t.ref, "title": t.title, "evidence": f"waiting on the user for over {WAITING_DAYS} days (question {waiting[0].n})", "retire": f"journal todo {t.n} done \"<why>\""})
    return found


def read(record) -> list:
    record.set_setting("cleanup_read_at", time.time())
    return [r for type_ in ("rule", "pin") for r in CONTROLLERS[type_](record, actor=SYSTEM).all() if not r.completed]


def read_owed(record, days: int = 7) -> bool:
    events = record.events()
    since = float(record.setting("cleanup_read_at", 0)) or (events[0].at if events else time.time())
    return time.time() - since > days * 86400
