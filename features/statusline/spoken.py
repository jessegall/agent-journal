import re

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
    "answer": "answering",
    "add": "adding",
    "ask": "asking",
    "strike": "striking",
    "retire": "retiring",
    "archive": "archiving",
    "acknowledge": "acknowledging",
    "decide": "deciding",
    "suggest": "suggesting",
    "withdraw": "withdrawing",
    "final": "settling",
    "remove": "removing",
    "prepare": "preparing",
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
    from resources.types import TYPES
    return [{"name": t.type, "title": t.title_, "names": t.names} for t in TYPES.values()]


def spoken(said_words: list[str], types: list[dict] | None = None) -> str:
    types = kinds() if types is None else types
    noun = said_words[0] if said_words else ""
    said = said_words[1] if len(said_words) > 1 else ""
    kind = next((t for t in types if t["name"] == noun or f"{t['name']}s" == noun), None)
    if not kind:
        action, name = QUERIES.get(noun) or ("checking", noun or "journal")
        return f"{action} {name}"
    if not said:
        return f"listing {kind['name']}s"
    method = next((m for m, own in kind["names"].items() if own == said), "")
    action = ACTIONS.get(said) or ACTIONS.get(method) or ing(said)
    name = f"{kind['name']}s" if said in MANY else kind["name"]
    n = next((x for x in said_words[2:] if DIGITS.match(x)), "")
    return f"{action} {name} {n}".strip()
