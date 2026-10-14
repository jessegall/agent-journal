"""How a word naming a row, such as todo 12 or plan 3 in another environment, is found in a text."""

import re
from dataclasses import dataclass
from functools import cache

from resources.types import TYPES


# what a type is called in Dutch, for a chat held in Dutch; a type that is the same word in both needs none
DUTCH = {"todo": "taak", "work": "werk", "doc": "document", "report": "rapport", "fact": "feit", "rule": "regel", "question": "vraag",
         "message": "bericht", "reminder": "herinnering", "suggestion": "suggestie", "sequence": "reeks", "comment": "opmerking",
         "notice": "melding", "notification": "notificatie", "check": "controle", "collection": "verzameling", "board": "bord",
         "template": "sjabloon", "profile": "profiel", "secret": "geheim", "environment": "omgeving", "reaction": "reactie"}


@cache
def named(places: tuple = ()) -> tuple[dict[str, str], re.Pattern]:
    names = {spelling: name for name, type_ in TYPES.items() for spelling in (name, type_.details.title.lower(), DUTCH.get(name, "")) if spelling}
    spelled = "|".join(sorted(map(re.escape, names), key=len, reverse=True))
    where = "|".join(sorted(map(re.escape, places), key=len, reverse=True)) or r"(?!)"
    return names, re.compile(rf"(?:\b(?P<place>{where})\s+)?\b(?P<kind>{spelled})s?\s+#?(?P<n>\d+)\b"
                             r"(?P<more>(?:(?:\s*,\s*(?:(?:and|en)\s+)?|\s+(?:and|en)\s+)#?\d+\b)*)"
                             rf"(?:\s+in\s+(?P<within>{where})\b)?", re.IGNORECASE)


@dataclass(frozen=True)
class Mention:
    name: str
    spelled: str
    env: str | None
    numbers: tuple[str, ...]

    @classmethod
    def of(cls, m: re.Match, names: dict[str, str]) -> "Mention":
        return cls(names[m["kind"].lower()], m["kind"], m["place"] or m["within"], (m["n"], *re.findall(r"\d+", m["more"])))

    def ref(self, n: str) -> str:
        return f"{self.name}:{n}" if self.env is None else f"{self.name}:{n}@{self.env}"
