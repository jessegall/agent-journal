import re

NAMED = re.compile(r"\b(task|todo|plan|doc|document|report|message|template|sequence|trigger|check|question|fact|rule|reminder|worker|secret|phase|chart)s?\s+#?(\d+)\b", re.IGNORECASE)
TYPES = {"task": "todo", "document": "doc"}
"""A mention names a row by its kind and number, as plan 1 or task 12; the viewer draws each as a chip that opens the row."""


class Mentions:
    """The rows a text names, as the viewer refers to them: plan 1 is plan:1, task 12 is todo:12. In the order named, each once."""

    @staticmethod
    def in_(text: str) -> list[str]:
        found = []
        for kind, n in NAMED.findall(text):
            ref = f"{TYPES.get(kind.lower(), kind.lower())}:{int(n)}"
            if ref not in found:
                found.append(ref)
        return found
