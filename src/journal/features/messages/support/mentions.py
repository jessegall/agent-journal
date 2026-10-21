import re

from journal.support.ref import Ref

NAMED = re.compile(r"\b(task|todo|plan|doc|document|report|message|template|sequence|trigger|check|question|fact|rule|reminder|worker|secret|phase)s?\s+#?(\d+)\b", re.IGNORECASE)
TABLES = {"todo": "tasks", "document": "docs"}


class Mentions:
    """The rows a text names: plan 1 is plans:1, task 12 is tasks:12. In the order named, each once."""

    @staticmethod
    def in_(text: str) -> list[Ref]:
        rows = []
        for kind, n in NAMED.findall(text):
            ref = Ref(TABLES.get(kind.lower(), f"{kind.lower()}s"), int(n))
            if ref not in rows:
                rows.append(ref)
        return rows
