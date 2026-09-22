import re
import time
from argparse import _SubParsersAction

from commands.parser import parser
from controllers.types import Facts, Questions, Reminders, Rules, Todos
from resources.base import SYSTEM

CLAIMS = (Rules, Facts, Reminders)
PATH = re.compile(r"(?<![\w/])((?:[\w.-]+/)+[\w.-]+\.\w+|[\w-]+\.(?:py|js|vue|md|json|css|html|sh))\b")
COMMAND = re.compile(r"`journal\s+([a-z][a-z-]*)(?:\s+([a-z][a-z-]*))?[^`]*`|^\s*journal\s+([a-z][a-z-]*)(?:\s+([a-z][a-z-]*))?", re.MULTILINE)
WAITING_DAYS = 7


def command_words() -> dict[str, set[str]]:
    top = next(a for a in parser()._actions if isinstance(a, _SubParsersAction))
    out = {}
    for name, command in top.choices.items():
        nested = next((a for a in command._actions if isinstance(a, _SubParsersAction)), None)
        out[name] = set(nested.choices) if nested else set()
    return out


def missing_paths(project, text: str) -> list[str]:
    return sorted({p for p in PATH.findall(text) if not (project / p).exists()})


def unknown_verbs(text: str, words: dict[str, set[str]]) -> list[str]:
    found = set()
    for match in COMMAND.findall(text):
        noun, word = (match[0], match[1]) if match[0] else (match[2], match[3])
        if noun not in words:
            found.add(f"journal {noun}")
        elif words[noun] and word not in words[noun]:
            found.add(f"journal {noun}{f' {word}' if word else ''}")
    return sorted(found)


def evidence(record) -> list[dict]:
    project = record.root.parent
    words = command_words()
    found = []
    for claims in CLAIMS:
        controller = claims(record, actor=SYSTEM)
        type_, close = controller.type, controller.named("complete")
        for r in controller._every():
            if r.completed:
                continue
            text = f"{r.title}\n{r.brief}"
            retire = f"journal {type_} {r.n} {close} \"<why>\""
            for what in missing_paths(project, text):
                found.append({"ref": r.ref, "title": r.title, "evidence": f"names {what}, which is gone", "retire": retire})
            for what in unknown_verbs(text, words):
                found.append({"ref": r.ref, "title": r.title, "evidence": f"names {what}, which the CLI does not answer to", "retire": retire})
    questions = Questions(record, actor=SYSTEM)
    for t in Todos(record, actor=SYSTEM)._every():
        if t.completed:
            continue
        waiting = [q for q in questions._standing() if t.ref in q.refs]
        if waiting and time.time() - min(q.created for q in waiting) > WAITING_DAYS * 86400:
            found.append({"ref": t.ref, "title": t.title, "evidence": f"waiting on the user for over {WAITING_DAYS} days (question {waiting[0].n})", "retire": f"journal todo {t.n} done \"<why>\""})
    return found
