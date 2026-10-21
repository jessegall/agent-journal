import re

from journal.support.ref import Ref

NOUNS = {"task": "tasks", "plan": "plans", "message": "messages", "doc": "docs", "document": "docs", "report": "reports", "question": "questions", "worker": "workers", "check": "checks", "sequence": "sequences"}
MENTION = re.compile(r"\b(" + "|".join(NOUNS) + r")\s+(\d+)\b", re.I)


class MentionMatch:
    """The rows a text names, such as task 12 or report 3, in the order it names them, each once."""

    @staticmethod
    def in_(text: str) -> list[Ref]:
        rows = [Ref(NOUNS[noun.lower()], int(n)) for noun, n in MENTION.findall(text)]
        return list(dict.fromkeys(rows))
