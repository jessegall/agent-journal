import re
import time
from dataclasses import dataclass
from pathlib import Path
from argparse import _SubParsersAction

from engine.command_line import command_line
from controllers.types import Facts, Questions, Reminders, Rules, Todos
from engine.project_files import is_listed, matching
from resources.base import SYSTEM
from features.trigger import DAY

CLAIMS = (Rules, Facts, Reminders)
PATH = re.compile(r"(?<![\w/.~])(~/)?((?:[\w.-]+/)+[\w.-]+\.\w+|[\w-]+\.(?:py|js|vue|md|json|css|html|sh))\b")
COMMAND = re.compile(r"`journal\s+([a-z][a-z-]*)(?:\s+([a-z][a-z-]*))?[^`]*`|^\s*journal\s+([a-z][a-z-]*)(?:\s+([a-z][a-z-]*))?", re.MULTILINE)
WAITING_DAYS = 7


def command_words() -> dict[str, set[str]]:
    top = next(a for a in command_line().parser()._actions if isinstance(a, _SubParsersAction))
    out = {}
    for name, command in top.choices.items():
        nested = next((a for a in command._actions if isinstance(a, _SubParsersAction)), None)
        out[name] = set(nested.choices) if nested else set()
    return out


def missing_paths(project, text: str) -> list[str]:
    return sorted({home + path for home, path in PATH.findall(text) if not present(project, home, path)})


def present(project, home: str, path: str) -> bool:
    if home:
        return (Path.home() / path).exists()
    listed = is_listed(project)
    return (project / path).exists() or bool(matching(project, path)) or not listed


def unknown_verbs(text: str, words: dict[str, set[str]]) -> list[str]:
    found = set()
    for match in COMMAND.findall(text):
        noun, word = (match[0], match[1]) if match[0] else (match[2], match[3])
        if noun not in words:
            found.add(f"journal {noun}")
        elif words[noun] and word not in words[noun]:
            found.add(f"journal {noun}{f' {word}' if word else ''}")
    return sorted(found)


@dataclass(frozen=True)
class Evidence:
    ref: str
    evidence: str
    retire: str


def retiring(controller, r) -> str:
    return f"journal {controller.type} {r.n} {controller.named('complete')} \"<why>\""


def claim_evidence(record) -> list[Evidence]:
    project, words = record.root.parent, command_words()
    found = []
    for claims in CLAIMS:
        controller = claims(record, actor=SYSTEM)
        for r in controller.rows.standing():
            text = f"{r.title}\n{r.brief}"
            found += [Evidence(r.ref, f"names {what}, which is gone", retiring(controller, r)) for what in missing_paths(project, text)]
            found += [Evidence(r.ref, f"names {what}, which the CLI does not answer to", retiring(controller, r)) for what in unknown_verbs(text, words)]
    return found


def waiting_evidence(record) -> list[Evidence]:
    questions, todos = Questions(record, actor=SYSTEM).rows.standing(), Todos(record, actor=SYSTEM)
    found = []
    for t in todos.rows.standing():
        waiting = [q for q in questions if t.ref in q.refs]
        if waiting and time.time() - min(q.created for q in waiting) > WAITING_DAYS * DAY:
            found.append(Evidence(t.ref, f"waiting on the user for over {WAITING_DAYS} days (question {waiting[0].n})", retiring(todos, t)))
    return found


def evidence(record) -> list[Evidence]:
    return claim_evidence(record) + waiting_evidence(record)
