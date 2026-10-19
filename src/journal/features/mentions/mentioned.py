import re

from journal.support.ref import Ref

NOUNS = {"task": "tasks", "plan": "plans", "message": "messages", "doc": "docs", "document": "docs", "report": "reports", "question": "questions", "worker": "workers", "check": "checks", "sequence": "sequences"}
"""The words a text names a row by, as the viewer shows them as pills, and the table each names."""
MENTION = re.compile(r"\b(" + "|".join(NOUNS) + r")\s+(\d+)\b", re.I)


class Mentioned:
    """The rows a text names, such as task 12 or report 3, in the order it names them, each once."""

    @staticmethod
    def in_(text: str) -> list[Ref]:
        found = [Ref(NOUNS[noun.lower()], int(n)) for noun, n in MENTION.findall(text)]
        return list(dict.fromkeys(found))
