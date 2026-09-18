from dataclasses import dataclass
from pathlib import Path


@dataclass
class Turn:
    line: int
    who: str          # user | agent | summary
    text: str


def search(turns: list[Turn], term: str, page: int = 0, size: int = 25) -> list[Turn]:
    want = term.lower()
    hits = [t for t in reversed(turns) if want in t.text.lower()]
    return hits[page * size:(page + 1) * size]


def conversation(turns: list[Turn], back: int = 1) -> list[Turn]:
    marks = [i for i, t in enumerate(turns) if t.who == "summary"]
    if len(marks) < back:
        return turns[:marks[0]] if marks else turns
    end = marks[-back]
    start = marks[-back - 1] + 1 if len(marks) > back else 0
    return turns[start:end]


def user(turns: list[Turn]) -> list[Turn]:
    return [t for t in turns if t.who == "user"]
