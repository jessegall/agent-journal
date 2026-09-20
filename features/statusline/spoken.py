import re

DIGITS = re.compile(r"^\d+$")
QUERIES = {
    "open": "the open work",
    "status": "where things stand",
    "search": "searching the journal",
    "user": "reading the user's words",
    "carry": "what a session is handed",
}


def one(noun: str, n: str) -> str:
    return f"{noun} {n}" if n else f"the {noun}"


SAID = {
    "create": lambda noun, n: f"adding a {noun}",
    "complete": lambda noun, n: f"closing {one(noun, n)}",
    "read": lambda noun, n: f"reading {one(noun, n)}",
    "show": lambda noun, n: f"reading {one(noun, n)}",
    "unread": lambda noun, n: f"checking for unread {noun}s",
    "all": lambda noun, n: f"the {noun} list",
    "update": lambda noun, n: f"updating {one(noun, n)}",
    "reply": lambda noun, n: f"replying to {one(noun, n)}",
    "comment": lambda noun, n: f"commenting on {one(noun, n)}",
    "link": lambda noun, n: f"linking {one(noun, n)}",
    "delete": lambda noun, n: f"dropping {one(noun, n)}",
    "search": lambda noun, n: f"searching the {noun}s",
    "priority": lambda noun, n: f"reordering {one(noun, n)}",
    "start": lambda noun, n: "starting work",
    "end": lambda noun, n: f"ending work {n}",
}


def ing(word: str) -> str:
    if word.endswith("e"):
        return f"{word[:-1]}ing"
    if re.search(r"[^aeiou][aeiou][bdgmnprt]$", word):
        return f"{word}{word[-1]}ing"
    return f"{word}ing"


def fallback(said: str, name: str, n: str) -> str:
    return f"the {said} of {one(name, n)}" if said.endswith("s") else f"{ing(said)} {one(name, n)}"


def kinds() -> list[dict]:
    from resources.types import TYPES
    return [{"name": t.type, "title": t.title_, "names": t.names} for t in TYPES.values()]


def spoken(said_words: list[str], types: list[dict] | None = None) -> str:
    types = kinds() if types is None else types
    noun = said_words[0] if said_words else ""
    said = said_words[1] if len(said_words) > 1 else ""
    rest = said_words[2:]
    kind = next((t for t in types if t["name"] == noun or f"{t['name']}s" == noun), None)
    n = next((x for x in rest if DIGITS.match(x)), "")
    if not kind:
        return QUERIES.get(noun) or (f"checking {noun}" if noun else "the journal")
    name = kind["title"].lower()
    if not said:
        return f"the {name} list"
    method = next((m for m, word in kind["names"].items() if word == said), "")
    say = SAID.get(said) or SAID.get(method or said)
    return (say(name, n) if say else fallback(said, name, n)).strip()
