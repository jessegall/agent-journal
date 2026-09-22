import re

from resources.types import TYPES

DIGITS = re.compile(r"^\d+$")
QUERIES = {
    "open": ("checking", "open work"),
    "status": ("checking", "status"),
    "search": ("searching", "journal"),
    "user": ("reading", "user"),
    "carry": ("reading", "carry"),
}
ACTIONS = {
    "create": "adding",
    "complete": "closing",
    "read": "reading",
    "show": "reading",
    "unread": "checking",
    "all": "listing",
    "update": "updating",
    "reply": "replying",
    "comment": "commenting",
    "link": "linking",
    "delete": "dropping",
    "search": "searching",
    "priority": "reordering",
    "start": "starting",
    "end": "ending",
    "done": "closing",
    "processed": "closing",
    "add": "adding",
    "process": "filing",
}
MANY = ("unread", "all", "search")


def ing(word: str) -> str:
    if word.endswith("s"):
        return "reading"
    if word.endswith("e"):
        return f"{word[:-1]}ing"
    if re.search(r"[^aeiou][aeiou][bdgmnprt]$", word):
        return f"{word}{word[-1]}ing"
    return f"{word}ing"


def kinds() -> list[dict]:
    return [{"name": t.type, "title": t.details.title, "names": t.command_names, "labels": t.status_labels} for t in TYPES.values()]


def spoken(words: list[str], types: list[dict] | None = None) -> str:
    types = kinds() if types is None else types
    noun = words[0] if words else ""
    verb = words[1] if len(words) > 1 else ""
    kind = next((t for t in types if t["name"] == noun or f"{t['name']}s" == noun), None)
    if not kind:
        action, name = QUERIES.get(noun) or ("checking", noun or "journal")
        return f"{action} {name}"
    if not verb:
        return f"listing {kind['name']}s"
    method = next((m for m, own in kind["names"].items() if own == verb), "") or verb
    labels = kind.get("labels") or {}
    action = labels.get(method) or ACTIONS.get(verb) or ACTIONS.get(method) or ing(verb)
    name = f"{kind['name']}s" if verb in MANY else kind["name"]
    n = next((x for x in words[2:] if DIGITS.match(x)), "")
    return f"{action} {name} {n}".strip()
